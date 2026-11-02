"""
Airtel Stadium360 — Network Demand and Capacity Engine
Implements technical telecom formulas, spectral efficiency modeling,
practical vs theoretical throughput calculations, match-phase historical analysis,
and site-level capacity gap detection.
"""

from typing import Dict, Any, List
from app.services.data_loader import STADIUM_SITES, MATCH_MEASUREMENTS, UPI_FAILURES

# Realistic crowd traffic distribution across the 8 stadium sites
# Based on azimuth, tier coverage, and proximity to pitch/stands
SITE_DISTRIBUTION_WEIGHTS = {
    "M1": 0.13,  # North-East Macro (Gates 1-3 & Pavilion)
    "M2": 0.14,  # East Macro (East Stand Upper & Concourse)
    "M3": 0.13,  # South Macro (South Stand & Media Box)
    "M4": 0.10,  # South-West Macro (Microwave bottleneck)
    "M5": 0.14,  # West Macro (West Stand VIP)
    "M6": 0.08,  # North-West Macro (Perimeter, lower density)
    "S1": 0.14,  # Lower Tier In-Bowl North
    "S2": 0.14,  # Lower Tier In-Bowl South
}

# Spectral Efficiency parameters documented under engineering assumptions
# 5G: 100 MHz @ 3.5 GHz (Band n78, 64T64R Massive MIMO)
# 4G: 70 MHz across 3 bands (Band 1 10MHz, Band 3 20MHz, Band 40 40MHz, 4x4 MIMO)
SPECTRUM_CONFIG = {
    "5G": {
        "band": "n78 (3500 MHz TDD)",
        "bandwidth_mhz": 100.0,
        "theoretical_spectral_efficiency": 7.5,   # bps/Hz (ideal 256QAM 8-layer MIMO peak)
        "practical_spectral_efficiency": 3.2,     # bps/Hz (stadium interference, multi-user MIMO)
        "practical_sector_capacity_mbps": 320.0,  # 100MHz * 3.2 bps/Hz
        "macro_sectors": 3,
        "macro_practical_capacity_gbps": 0.960,   # 3 sectors * 320 Mbps
        "small_cell_capacity_gbps": 0.600,        # in-bowl small cell 5G
        "channel_model": "3GPP TR 38.901 Urban Macro (Dense Crowd)",
        "snr_attenuation_db": 14.5,
        "notes": "Degradation from 7.5 to 3.2 bps/Hz due to human body RF shadowing, high Doppler/movement, and pilot contamination."
    },
    "4G": {
        "band": "B1 (10MHz) + B3 (20MHz) + B40 (40MHz)",
        "bandwidth_mhz": 70.0,
        "theoretical_spectral_efficiency": 4.0,   # bps/Hz (ideal 256QAM 4x4 MIMO peak)
        "practical_spectral_efficiency": 1.5,     # bps/Hz (stadium dense interference)
        "practical_sector_capacity_mbps": 105.0,  # 70MHz * 1.5 bps/Hz
        "macro_sectors": 3,
        "macro_practical_capacity_gbps": 0.315,   # 3 sectors * 105 Mbps
        "small_cell_capacity_gbps": 0.150,        # single sector in-bowl
        "channel_model": "3GPP TR 36.873 3D-UMa",
        "snr_attenuation_db": 18.2,
        "notes": "Degradation from 4.0 to 1.5 bps/Hz due to excessive PRB utilization (near 100%), inter-cell interference (ICIC limit), and uplink noise rise."
    }
}

# Match Phase Characteristics
MATCH_PHASE_PROFILES = [
    {
        "phase": "Crowd building up",
        "time": "17:00",
        "active_online_pct": 0.08,
        "description": "Spectators arriving at entry gates; ticket validation, turnstiles, social meetups.",
        "historical_avg_4g_load": 57.5,
        "historical_avg_4g_speed": 7.8,
        "historical_avg_5g_speed": 138.8,
        "historical_upi_failure": 1.84,
    },
    {
        "phase": "Innings break",
        "time": "21:00",
        "active_online_pct": 0.18,
        "description": "Intermission between innings; massive surge in food, beverage, UPI payments and social media uploads.",
        "historical_avg_4g_load": 98.6,
        "historical_avg_4g_speed": 1.0,
        "historical_avg_5g_speed": 27.9,
        "historical_upi_failure": 7.11,
    },
    {
        "phase": "Final over",
        "time": "22:45",
        "active_online_pct": 0.16,
        "description": "Peak match tension; live video streaming, messaging, photo sharing.",
        "historical_avg_4g_load": 98.4,
        "historical_avg_4g_speed": 0.9,
        "historical_avg_5g_speed": 11.8,
        "historical_upi_failure": 6.82,
    },
    {
        "phase": "Post-match",
        "time": "23:15",
        "active_online_pct": 0.12,
        "description": "Award ceremony & stadium egress; ride-hailing (Uber/Ola), calls, UPI parking/cabs.",
        "historical_avg_4g_load": 97.9,
        "historical_avg_4g_speed": 0.9,
        "historical_avg_5g_speed": 47.2,
        "historical_upi_failure": 5.23,
    }
]

def calculate_network_demand(
    capacity: int = 100000,
    airtel_share: float = 0.40,
    device_share_5g: float = 0.70,
    peak_online_pct: float = 0.18,
    target_speed_5g_mbps: float = 5.0,
    target_speed_4g_mbps: float = 3.0,
    target_utilization: float = 0.80,
) -> Dict[str, Any]:
    """
    Executes the exact master equations for network demand and capacity.
    """
    # 1. User equations
    airtel_spectators = int(capacity * airtel_share)
    spectators_5g_capable = int(airtel_spectators * device_share_5g)
    spectators_4g_only = airtel_spectators - spectators_5g_capable

    peak_active_airtel_users = int(airtel_spectators * peak_online_pct)
    active_5g_users = int(peak_active_airtel_users * device_share_5g)
    active_4g_users = int(peak_active_airtel_users * (1.0 - device_share_5g))

    # 2. Demand equations (Mbps -> Gbps)
    demand_5g_mbps = active_5g_users * target_speed_5g_mbps
    demand_4g_mbps = active_4g_users * target_speed_4g_mbps
    total_demand_mbps = demand_5g_mbps + demand_4g_mbps

    demand_5g_gbps = round(demand_5g_mbps / 1000.0, 3)
    demand_4g_gbps = round(demand_4g_mbps / 1000.0, 3)
    total_demand_gbps = round(total_demand_mbps / 1000.0, 3)

    # 3. Capacity requirement at target utilization (e.g. 80%)
    required_capacity_total_gbps = round(total_demand_gbps / target_utilization, 3)
    required_capacity_5g_gbps = round(demand_5g_gbps / target_utilization, 3)
    required_capacity_4g_gbps = round(demand_4g_gbps / target_utilization, 3)

    # 4. Spectral Capacity Estimates (Practical Usable vs Theoretical Peak)
    # 4 sites currently have 5G (M1, M2, M3, M5), 8 sites have 4G
    sites_with_5g_count = 4
    sites_4g_macro_count = 6
    sites_4g_small_cell_count = 2

    practical_5g_rf_gbps = round(sites_with_5g_count * SPECTRUM_CONFIG["5G"]["macro_practical_capacity_gbps"], 3)
    practical_4g_rf_gbps = round(
        (sites_4g_macro_count * SPECTRUM_CONFIG["4G"]["macro_practical_capacity_gbps"]) +
        (sites_4g_small_cell_count * SPECTRUM_CONFIG["4G"]["small_cell_capacity_gbps"]),
        3
    )
    total_practical_rf_capacity_gbps = round(practical_5g_rf_gbps + practical_4g_rf_gbps, 3)

    # Theoretical peak numbers (ideal channel conditions)
    theoretical_5g_rf_gbps = round(sites_with_5g_count * 100.0 * 7.5 * 3 / 1000.0, 2)
    theoretical_4g_rf_gbps = round(8 * 70.0 * 4.0 * 3 / 1000.0, 2)

    # 5. Site-level demand and capacity breakdown
    site_breakdowns = []
    total_deficit_gbps = 0.0

    for site in STADIUM_SITES:
        sid = site["site_id"]
        weight = SITE_DISTRIBUTION_WEIGHTS.get(sid, 0.125)

        # Users assigned to site
        site_active_users = int(peak_active_airtel_users * weight)
        site_active_5g = int(site_active_users * device_share_5g)
        site_active_4g = site_active_users - site_active_5g

        # Demand for this site
        site_demand_5g = round((site_active_5g * target_speed_5g_mbps) / 1000.0, 3)
        site_demand_4g = round((site_active_4g * target_speed_4g_mbps) / 1000.0, 3)
        site_demand_total = round(site_demand_5g + site_demand_4g, 3)
        site_req_capacity = round(site_demand_total / target_utilization, 3)

        # Delivered practical RF capacity currently installed
        has_5g = site["has_5g"]
        is_macro = site["type"] == "Macro"
        
        cap_4g = SPECTRUM_CONFIG["4G"]["macro_practical_capacity_gbps"] if is_macro else SPECTRUM_CONFIG["4G"]["small_cell_capacity_gbps"]
        cap_5g = SPECTRUM_CONFIG["5G"]["macro_practical_capacity_gbps"] if has_5g else 0.0
        delivered_rf_cap = round(cap_4g + cap_5g, 3)

        # Backhaul limit
        backhaul_cap = site["backhaul_capacity_gbps"]
        is_backhaul_constrained = backhaul_cap <= 2.0 or backhaul_cap < site_req_capacity

        # Usable throughput cannot exceed backhaul
        usable_throughput = min(delivered_rf_cap, backhaul_cap)

        # Deficit compared to required capacity at 80%
        deficit = round(max(0.0, site_req_capacity - usable_throughput), 3)
        total_deficit_gbps += deficit

        # Utilization calculation
        utilization_pct = min(99.9, round((site_demand_total / max(0.1, usable_throughput)) * 100, 1))

        site_breakdowns.append({
            "site_id": sid,
            "type": site["type"],
            "distance_m": site["distance_m"],
            "has_5g": has_5g,
            "backhaul": site["backhaul"],
            "backhaul_capacity_gbps": backhaul_cap,
            "traffic_weight_pct": round(weight * 100, 1),
            "assigned_active_users": site_active_users,
            "assigned_5g_users": site_active_5g,
            "assigned_4g_users": site_active_4g,
            "demand_5g_gbps": site_demand_5g,
            "demand_4g_gbps": site_demand_4g,
            "total_demand_gbps": site_demand_total,
            "required_capacity_80_gbps": site_req_capacity,
            "delivered_rf_capacity_gbps": delivered_rf_cap,
            "usable_capacity_gbps": usable_throughput,
            "capacity_deficit_gbps": deficit,
            "is_backhaul_constrained": is_backhaul_constrained,
            "utilization_pct": utilization_pct,
            "status": "CRITICAL" if utilization_pct >= 90 else "WARNING" if utilization_pct >= 80 else "OPTIMAL"
        })

    # Overall Capacity Gap
    overall_gap_gbps = round(max(0.0, required_capacity_total_gbps - total_practical_rf_capacity_gbps), 3)

    return {
        "parameters": {
            "capacity": capacity,
            "airtel_share": airtel_share,
            "device_share_5g": device_share_5g,
            "peak_online_pct": peak_online_pct,
            "target_speed_5g_mbps": target_speed_5g_mbps,
            "target_speed_4g_mbps": target_speed_4g_mbps,
            "target_utilization": target_utilization,
        },
        "spectators": {
            "total_spectators": capacity,
            "airtel_spectators": airtel_spectators,
            "spectators_5g_capable": spectators_5g_capable,
            "spectators_4g_only": spectators_4g_only,
        },
        "active_users": {
            "peak_active_airtel_users": peak_active_airtel_users,
            "active_5g_users": active_5g_users,
            "active_4g_users": active_4g_users,
        },
        "throughput_demand_gbps": {
            "demand_5g": demand_5g_gbps,
            "demand_4g": demand_4g_gbps,
            "total_demand": total_demand_gbps,
        },
        "capacity_requirements_gbps": {
            "required_total_at_80_pct": required_capacity_total_gbps,
            "required_5g_at_80_pct": required_capacity_5g_gbps,
            "required_4g_at_80_pct": required_capacity_4g_gbps,
        },
        "spectral_efficiency": {
            "practical_5g_rf_gbps": practical_5g_rf_gbps,
            "practical_4g_rf_gbps": practical_4g_rf_gbps,
            "total_practical_rf_capacity_gbps": total_practical_rf_capacity_gbps,
            "theoretical_5g_rf_gbps": theoretical_5g_rf_gbps,
            "theoretical_4g_rf_gbps": theoretical_4g_rf_gbps,
            "config": SPECTRUM_CONFIG,
        },
        "capacity_gap": {
            "total_required_gbps": required_capacity_total_gbps,
            "current_delivered_rf_gbps": total_practical_rf_capacity_gbps,
            "overall_gap_gbps": overall_gap_gbps,
            "total_site_deficit_gbps": round(total_deficit_gbps, 3),
        },
        "site_breakdowns": site_breakdowns,
    }

def get_match_phase_forecast(
    capacity: int = 100000,
    airtel_share: float = 0.40,
    device_share_5g: float = 0.70,
    target_speed_5g_mbps: float = 5.0,
    target_speed_4g_mbps: float = 3.0,
) -> List[Dict[str, Any]]:
    """
    Computes network demand and capacity gap progression across the four match phases
    contrasted with actual 65k match baseline measurements.
    """
    airtel_spectators = int(capacity * airtel_share)
    forecast = []

    # Current installed capacity
    # 4 macros with 5G + 4G = 4 * (0.960 + 0.315) = 5.10 Gbps
    # 2 macros 4G only = 2 * 0.315 = 0.630 Gbps
    # 2 small cells 4G only = 2 * 0.150 = 0.300 Gbps
    # Total installed practical RF = 6.030 Gbps
    installed_capacity_gbps = 6.03

    for profile in MATCH_PHASE_PROFILES:
        active_ratio = profile["active_online_pct"]
        active_users = int(airtel_spectators * active_ratio)
        active_5g = int(active_users * device_share_5g)
        active_4g = active_users - active_5g

        demand_5g_gbps = round((active_5g * target_speed_5g_mbps) / 1000.0, 3)
        demand_4g_gbps = round((active_4g * target_speed_4g_mbps) / 1000.0, 3)
        total_demand_gbps = round(demand_5g_gbps + demand_4g_gbps, 3)
        required_cap_80 = round(total_demand_gbps / 0.80, 3)

        unmitigated_utilization_pct = min(150.0, round((total_demand_gbps / installed_capacity_gbps) * 100, 1))

        forecast.append({
            "phase": profile["phase"],
            "time": profile["time"],
            "active_online_pct": round(active_ratio * 100, 1),
            "projected_active_users": active_users,
            "projected_5g_users": active_5g,
            "projected_4g_users": active_4g,
            "projected_demand_gbps": total_demand_gbps,
            "required_capacity_gbps": required_cap_80,
            "installed_capacity_gbps": installed_capacity_gbps,
            "unmitigated_utilization_pct": unmitigated_utilization_pct,
            "historical_baseline": {
                "4g_load_pct": profile["historical_avg_4g_load"],
                "4g_speed_mbps": profile["historical_avg_4g_speed"],
                "5g_speed_mbps": profile["historical_avg_5g_speed"],
                "upi_failure_pct": profile["historical_upi_failure"],
            },
            "description": profile["description"],
            "risk_level": "SEVERE CONGESTION" if unmitigated_utilization_pct > 100 else "HIGH LOAD" if unmitigated_utilization_pct > 80 else "MODERATE"
        })

    return forecast

def get_spectral_efficiency_breakdown() -> Dict[str, Any]:
    """
    Returns spectral efficiency comparison between theoretical Shannon limit and
    practical 3GPP stadium RF propagation realities.
    """
    return {
        "spectrum_allocation": SPECTRUM_CONFIG,
        "comparison": [
            {
                "tech": "5G NR (Band n78)",
                "frequency": "3500 MHz TDD",
                "bandwidth_mhz": 100.0,
                "mimo_config": "64T64R Massive MIMO (Active Antenna Unit)",
                "theoretical_bps_hz": 7.5,
                "theoretical_macro_gbps": 2.25,  # 100MHz * 7.5 * 3 sectors
                "practical_bps_hz": 3.2,
                "practical_macro_gbps": 0.960,  # 100MHz * 3.2 * 3 sectors
                "efficiency_loss_pct": 57.3,
                "primary_loss_factors": [
                    "High human body RF absorption at 3.5 GHz (body loss ~6-10 dB)",
                    "Severe multi-user spatial correlation due to dense seating grid",
                    "Pilot contamination between adjacent sectors in the bowl",
                    "Uplink sounding reference signal (SRS) collision during peak traffic"
                ]
            },
            {
                "tech": "4G LTE (Carrier Aggregation)",
                "frequency": "B1 (2100MHz) + B3 (1800MHz) + B40 (2300MHz)",
                "bandwidth_mhz": 70.0,
                "mimo_config": "4x4 MIMO (Macro) / 2x2 MIMO (Small Cell)",
                "theoretical_bps_hz": 4.0,
                "theoretical_macro_gbps": 0.840,  # 70MHz * 4.0 * 3 sectors
                "practical_bps_hz": 1.5,
                "practical_macro_gbps": 0.315,  # 70MHz * 1.5 * 3 sectors
                "efficiency_loss_pct": 62.5,
                "primary_loss_factors": [
                    "Physical Resource Block (PRB) exhaustion causing constant 100% utilization",
                    "Inter-cell interference (ICIC) failure at high crowd density",
                    "PDCCH (control channel) block failure preventing new user scheduling",
                    "Severe uplink noise rise (RoT > 20 dB) degrading SINR to < 0 dB"
                ]
            }
        ],
        "engineering_methodology": {
            "standard": "3GPP TR 38.901 & TR 36.873 Dense Urban / Stadium Scenario",
            "confidence_level": "Documented Engineering Assumption (Airtel SYNC Technical Standard)"
        }
    }

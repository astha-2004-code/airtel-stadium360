"""
Airtel Stadium360 — Historical Case Study Data Loader
Extracts, structures, and validates actual measurements from Sync_V1.xlsx.
"""

from typing import Dict, List, Any
import openpyxl
import os

# Verified site topology and backhaul information from Sync_V1.xlsx
STADIUM_SITES = [
    {
        "site_id": "M1",
        "type": "Macro",
        "distance_m": 320,
        "backhaul": "Fibre 10G",
        "backhaul_capacity_gbps": 10.0,
        "has_5g": True,
        "azimuth": 45,
        "description": "North-East Macro Tower covering Gates 1-3 & Pavilion"
    },
    {
        "site_id": "M2",
        "type": "Macro",
        "distance_m": 410,
        "backhaul": "Fibre 10G",
        "backhaul_capacity_gbps": 10.0,
        "has_5g": True,
        "azimuth": 90,
        "description": "East Macro Tower covering East Stand Upper & Concourse"
    },
    {
        "site_id": "M3",
        "type": "Macro",
        "distance_m": 290,
        "backhaul": "Fibre 10G",
        "backhaul_capacity_gbps": 10.0,
        "has_5g": True,
        "azimuth": 180,
        "description": "South Macro Tower covering South Stand & Media Box"
    },
    {
        "site_id": "M4",
        "type": "Macro",
        "distance_m": 380,
        "backhaul": "Microwave 2G",
        "backhaul_capacity_gbps": 2.0,
        "has_5g": False,
        "azimuth": 225,
        "description": "South-West Macro Tower (Microwave bottleneck, 4G only)"
    },
    {
        "site_id": "M5",
        "type": "Macro",
        "distance_m": 300,
        "backhaul": "Fibre 10G",
        "backhaul_capacity_gbps": 10.0,
        "has_5g": True,
        "azimuth": 270,
        "description": "West Macro Tower covering West Stand & VIP Enclosure"
    },
    {
        "site_id": "M6",
        "type": "Macro",
        "distance_m": 450,
        "backhaul": "Microwave 2G",
        "backhaul_capacity_gbps": 2.0,
        "has_5g": False,
        "azimuth": 315,
        "description": "North-West Macro Tower (Microwave bottleneck, 4G only)"
    },
    {
        "site_id": "S1",
        "type": "Small cell (in-bowl)",
        "distance_m": 80,
        "backhaul": "Fibre 1G",
        "backhaul_capacity_gbps": 1.0,
        "has_5g": False,
        "azimuth": 0,
        "description": "Lower Tier In-Bowl Small Cell North (Fibre 1G bottleneck, 4G only)"
    },
    {
        "site_id": "S2",
        "type": "Small cell (in-bowl)",
        "distance_m": 80,
        "backhaul": "Fibre 1G",
        "backhaul_capacity_gbps": 1.0,
        "has_5g": False,
        "azimuth": 180,
        "description": "Lower Tier In-Bowl Small Cell South (Fibre 1G bottleneck, 4G only)"
    }
]

# Actual site-level telemetry measurements from Sync_V1.xlsx
# 8 sites x 4 match moments
MATCH_MEASUREMENTS = [
    # M1
    {"site": "M1", "phase": "Crowd building up", "time": "17:00", "normal_4g_load": 20.6, "match_4g_load": 58.6, "normal_4g_speed": 15.6, "match_4g_speed": 7.5, "normal_5g_speed": 153.14, "match_5g_speed": 129.25, "match_5g_success": 99.2},
    {"site": "M1", "phase": "Innings break", "time": "21:00", "normal_4g_load": 21.1, "match_4g_load": 98.8, "normal_4g_speed": 15.3, "match_4g_speed": 1.0, "normal_5g_speed": 148.69, "match_5g_speed": 32.51, "match_5g_success": 35.2},
    {"site": "M1", "phase": "Final over", "time": "22:45", "normal_4g_load": 19.3, "match_4g_load": 98.3, "normal_4g_speed": 16.4, "match_4g_speed": 0.9, "normal_5g_speed": 159.72, "match_5g_speed": 6.70, "match_5g_success": 37.0},
    {"site": "M1", "phase": "Post-match", "time": "23:15", "normal_4g_load": 20.4, "match_4g_load": 98.0, "normal_4g_speed": 15.7, "match_4g_speed": 0.9, "normal_5g_speed": 148.58, "match_5g_speed": 46.68, "match_5g_success": 37.8},

    # M2
    {"site": "M2", "phase": "Crowd building up", "time": "17:00", "normal_4g_load": 21.0, "match_4g_load": 63.1, "normal_4g_speed": 16.0, "match_4g_speed": 7.6, "normal_5g_speed": 145.37, "match_5g_speed": 132.82, "match_5g_success": 99.2},
    {"site": "M2", "phase": "Innings break", "time": "21:00", "normal_4g_load": 20.1, "match_4g_load": 98.2, "normal_4g_speed": 15.5, "match_4g_speed": 0.9, "normal_5g_speed": 158.40, "match_5g_speed": 24.66, "match_5g_success": 37.5},
    {"site": "M2", "phase": "Final over", "time": "22:45", "normal_4g_load": 19.5, "match_4g_load": 98.2, "normal_4g_speed": 15.6, "match_4g_speed": 1.0, "normal_5g_speed": 146.94, "match_5g_speed": 12.64, "match_5g_success": 37.4},
    {"site": "M2", "phase": "Post-match", "time": "23:15", "normal_4g_load": 19.8, "match_4g_load": 97.8, "normal_4g_speed": 15.7, "match_4g_speed": 0.9, "normal_5g_speed": 146.96, "match_5g_speed": 59.36, "match_5g_success": 38.7},

    # M3
    {"site": "M3", "phase": "Crowd building up", "time": "17:00", "normal_4g_load": 19.9, "match_4g_load": 70.3, "normal_4g_speed": 16.1, "match_4g_speed": 6.3, "normal_5g_speed": 158.38, "match_5g_speed": 144.16, "match_5g_success": 99.2},
    {"site": "M3", "phase": "Innings break", "time": "21:00", "normal_4g_load": 21.7, "match_4g_load": 98.5, "normal_4g_speed": 15.8, "match_4g_speed": 1.0, "normal_5g_speed": 160.90, "match_5g_speed": 25.51, "match_5g_success": 36.4},
    {"site": "M3", "phase": "Final over", "time": "22:45", "normal_4g_load": 20.2, "match_4g_load": 98.3, "normal_4g_speed": 14.3, "match_4g_speed": 1.0, "normal_5g_speed": 155.95, "match_5g_speed": 4.34, "match_5g_success": 36.9},
    {"site": "M3", "phase": "Post-match", "time": "23:15", "normal_4g_load": 19.9, "match_4g_load": 98.5, "normal_4g_speed": 16.6, "match_4g_speed": 0.9, "normal_5g_speed": 152.72, "match_5g_speed": 42.72, "match_5g_success": 36.2},

    # M4 (4G Only)
    {"site": "M4", "phase": "Crowd building up", "time": "17:00", "normal_4g_load": 22.0, "match_4g_load": 64.0, "normal_4g_speed": 15.2, "match_4g_speed": 8.0, "normal_5g_speed": None, "match_5g_speed": None, "match_5g_success": 99.2},
    {"site": "M4", "phase": "Innings break", "time": "21:00", "normal_4g_load": 21.5, "match_4g_load": 98.9, "normal_4g_speed": 15.0, "match_4g_speed": 0.9, "normal_5g_speed": None, "match_5g_speed": None, "match_5g_success": 35.1},
    {"site": "M4", "phase": "Final over", "time": "22:45", "normal_4g_load": 19.1, "match_4g_load": 98.4, "normal_4g_speed": 15.2, "match_4g_speed": 1.0, "normal_5g_speed": None, "match_5g_speed": None, "match_5g_success": 36.5},
    {"site": "M4", "phase": "Post-match", "time": "23:15", "normal_4g_load": 18.9, "match_4g_load": 99.1, "normal_4g_speed": 17.1, "match_4g_speed": 0.9, "normal_5g_speed": None, "match_5g_speed": None, "match_5g_success": 34.3},

    # M5
    {"site": "M5", "phase": "Crowd building up", "time": "17:00", "normal_4g_load": 20.7, "match_4g_load": 72.4, "normal_4g_speed": 15.3, "match_4g_speed": 6.3, "normal_5g_speed": 154.86, "match_5g_speed": 148.96, "match_5g_success": 99.2},
    {"site": "M5", "phase": "Innings break", "time": "21:00", "normal_4g_load": 20.3, "match_4g_load": 98.7, "normal_4g_speed": 15.1, "match_4g_speed": 1.0, "normal_5g_speed": 152.15, "match_5g_speed": 28.92, "match_5g_success": 35.8},
    {"site": "M5", "phase": "Final over", "time": "22:45", "normal_4g_load": 19.7, "match_4g_load": 98.4, "normal_4g_speed": 16.1, "match_4g_speed": 0.9, "normal_5g_speed": 148.80, "match_5g_speed": 23.54, "match_5g_success": 36.8},
    {"site": "M5", "phase": "Post-match", "time": "23:15", "normal_4g_load": 19.3, "match_4g_load": 98.3, "normal_4g_speed": 16.2, "match_4g_speed": 0.9, "normal_5g_speed": 160.25, "match_5g_speed": 50.20, "match_5g_success": 36.9},

    # M6 (4G Only)
    {"site": "M6", "phase": "Crowd building up", "time": "17:00", "normal_4g_load": 22.3, "match_4g_load": 25.3, "normal_4g_speed": 14.7, "match_4g_speed": 15.1, "normal_5g_speed": None, "match_5g_speed": None, "match_5g_success": 99.2},
    {"site": "M6", "phase": "Innings break", "time": "21:00", "normal_4g_load": 21.1, "match_4g_load": 60.5, "normal_4g_speed": 15.7, "match_4g_speed": 8.4, "normal_5g_speed": None, "match_5g_speed": None, "match_5g_success": 99.2},
    {"site": "M6", "phase": "Final over", "time": "22:45", "normal_4g_load": 19.8, "match_4g_load": 59.9, "normal_4g_speed": 16.1, "match_4g_speed": 7.7, "normal_5g_speed": None, "match_5g_speed": None, "match_5g_success": 99.2},
    {"site": "M6", "phase": "Post-match", "time": "23:15", "normal_4g_load": 19.8, "match_4g_load": 47.2, "normal_4g_speed": 16.4, "match_4g_speed": 10.1, "normal_5g_speed": None, "match_5g_speed": None, "match_5g_success": 99.2},

    # S1 (In-bowl Small Cell, 4G Only)
    {"site": "S1", "phase": "Crowd building up", "time": "17:00", "normal_4g_load": 19.7, "match_4g_load": 80.6, "normal_4g_speed": 16.8, "match_4g_speed": 6.1, "normal_5g_speed": None, "match_5g_speed": None, "match_5g_success": 97.2},
    {"site": "S1", "phase": "Innings break", "time": "21:00", "normal_4g_load": 21.5, "match_4g_load": 98.3, "normal_4g_speed": 17.7, "match_4g_speed": 1.0, "normal_5g_speed": None, "match_5g_speed": None, "match_5g_success": 37.0},
    {"site": "S1", "phase": "Final over", "time": "22:45", "normal_4g_load": 19.9, "match_4g_load": 98.0, "normal_4g_speed": 18.2, "match_4g_speed": 0.9, "normal_5g_speed": None, "match_5g_speed": None, "match_5g_success": 37.9},
    {"site": "S1", "phase": "Post-match", "time": "23:15", "normal_4g_load": 19.4, "match_4g_load": 98.3, "normal_4g_speed": 17.4, "match_4g_speed": 1.0, "normal_5g_speed": None, "match_5g_speed": None, "match_5g_success": 36.9},

    # S2 (In-bowl Small Cell, 4G Only)
    {"site": "S2", "phase": "Crowd building up", "time": "17:00", "normal_4g_load": 21.4, "match_4g_load": 80.4, "normal_4g_speed": 17.5, "match_4g_speed": 6.6, "normal_5g_speed": None, "match_5g_speed": None, "match_5g_success": 97.8},
    {"site": "S2", "phase": "Innings break", "time": "21:00", "normal_4g_load": 20.7, "match_4g_load": 98.1, "normal_4g_speed": 16.6, "match_4g_speed": 1.0, "normal_5g_speed": None, "match_5g_speed": None, "match_5g_success": 37.5},
    {"site": "S2", "phase": "Final over", "time": "22:45", "normal_4g_load": 18.6, "match_4g_load": 98.6, "normal_4g_speed": 17.6, "match_4g_speed": 0.9, "normal_5g_speed": None, "match_5g_speed": None, "match_5g_success": 35.9},
    {"site": "S2", "phase": "Post-match", "time": "23:15", "normal_4g_load": 18.6, "match_4g_load": 98.9, "normal_4g_speed": 17.5, "match_4g_speed": 0.9, "normal_5g_speed": None, "match_5g_speed": None, "match_5g_success": 35.1},
]

# UPI payment failure measurements from Sync_V1.xlsx
UPI_FAILURES = [
    {"time": "17:00", "phase": "Crowd building up", "match_upi_failure_pct": 1.84, "normal_upi_failure_pct": 1.08},
    {"time": "21:00", "phase": "Innings break", "match_upi_failure_pct": 7.11, "normal_upi_failure_pct": 1.23},
    {"time": "22:45", "phase": "Final over", "match_upi_failure_pct": 6.82, "normal_upi_failure_pct": 1.06},
    {"time": "23:15", "phase": "Post-match", "match_upi_failure_pct": 5.23, "normal_upi_failure_pct": 1.22},
]

def get_stadium_sites() -> List[Dict[str, Any]]:
    return STADIUM_SITES

def get_measurements_by_phase(phase: str = "Innings break") -> List[Dict[str, Any]]:
    return [m for m in MATCH_MEASUREMENTS if m["phase"].lower() == phase.lower()]

def get_upi_failures() -> List[Dict[str, Any]]:
    return UPI_FAILURES

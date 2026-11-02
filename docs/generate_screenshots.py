"""
Airtel Stadium360 - High-Resolution Screenshot Generator
Author: ByteForge | NIT Delhi
Generates crisp, branded UI screenshot representations for GitHub README documentation.
"""
import os
from PIL import Image, ImageDraw, ImageFont

OUTPUT_DIR = os.path.join(os.path.dirname(__file__), "screenshots")
os.makedirs(OUTPUT_DIR, exist_ok=True)

# Theme Palette
BG_COLOR = (11, 15, 25)          # #0B0F19
CARD_BG = (19, 27, 46)           # #131B2E
CARD_BORDER = (34, 48, 80)       # #223050
RED_ACCENT = (228, 0, 0)         # #E40000
EMERALD = (16, 185, 129)         # #10B981
CYAN = (6, 182, 212)             # #06B6D4
AMBER = (245, 158, 11)           # #F59E0B
WHITE = (248, 250, 252)
SLATE_GRAY = (148, 163, 184)
SLATE_DARK = (30, 41, 59)

WIDTH = 1200
HEIGHT = 720


def create_base_canvas(module_title: str, module_badge: str):
    img = Image.new("RGB", (WIDTH, HEIGHT), BG_COLOR)
    draw = ImageDraw.Draw(img)

    # Top Navigation Bar
    draw.rectangle([0, 0, WIDTH, 64], fill=CARD_BG, outline=CARD_BORDER)
    # Red logo badge
    draw.rounded_rectangle([20, 12, 60, 52], radius=8, fill=RED_ACCENT)
    draw.text((28, 20), "360", fill=WHITE)

    # Title branding
    draw.text((72, 16), "AIRTEL STADIUM360", fill=RED_ACCENT)
    draw.text((230, 16), "• Predict. Optimize. Connect.", fill=SLATE_GRAY)
    draw.text((72, 36), "Narendra Modi Stadium | Team: ByteForge | NIT Delhi", fill=SLATE_GRAY)

    # Status Pill on right
    draw.rounded_rectangle([WIDTH - 280, 16, WIDTH - 20, 48], radius=6, fill=(16, 185, 129, 30), outline=EMERALD)
    draw.text((WIDTH - 265, 24), "LIVE TELEMETRY: 1,00,000 SPECTATORS", fill=EMERALD)

    # Sidebar outline (left)
    draw.rectangle([0, 64, 220, HEIGHT], fill=(15, 23, 42), outline=CARD_BORDER)
    modules = [
        "1. Command Centre", "2. Digital Twin", "3. Capacity Engine",
        "4. Deployment Optimizer", "5. What-If Simulator", "6. Budget & Assets",
        "7. 5G Intelligence", "8. UPI & Emergency", "9. Access & Security",
        "10. Reports & Exports", "11. Production Deploy", "Evaluation Centre"
    ]
    y = 80
    for mod in modules:
        is_active = (module_badge in mod)
        if is_active:
            draw.rounded_rectangle([10, y - 4, 210, y + 24], radius=6, fill=RED_ACCENT)
            draw.text((20, y), mod, fill=WHITE)
        else:
            draw.text((20, y), mod, fill=SLATE_GRAY)
        y += 38

    # Module Header Canvas
    content_x = 240
    draw.text((content_x, 80), module_title.upper(), fill=WHITE)
    draw.rounded_rectangle([content_x, 105, WIDTH - 20, 107], fill=CARD_BORDER)

    return img, draw, content_x


def draw_card(draw, x1, y1, x2, y2, title="", val="", sub="", val_color=WHITE):
    draw.rounded_rectangle([x1, y1, x2, y2], radius=10, fill=CARD_BG, outline=CARD_BORDER)
    if title:
        draw.text((x1 + 16, y1 + 14), title.upper(), fill=SLATE_GRAY)
    if val:
        draw.text((x1 + 16, y1 + 36), val, fill=val_color)
    if sub:
        draw.text((x1 + 16, y1 + 68), sub, fill=SLATE_GRAY)


def generate_dashboard():
    img, draw, cx = create_base_canvas("Module 1 — Executive Command Centre", "Command Centre")

    # 4 KPI Cards
    cw = (WIDTH - cx - 20 - 45) // 4
    draw_card(draw, cx, 120, cx + cw, 215, "Delivered Capacity", "39.60 Gbps", "Target <= 80% PRB load", CYAN)
    draw_card(draw, cx + cw + 15, 120, cx + 2 * cw + 15, 215, "Peak 4G PRB Load", "78.4%", "Safe (-21.4% vs Baseline)", EMERALD)
    draw_card(draw, cx + 2 * cw + 30, 120, cx + 3 * cw + 30, 215, "5G Connection Rate", "86.2%", "Anchor Shield Active", EMERALD)
    draw_card(draw, cx + 3 * cw + 45, 120, cx + 4 * cw + 45, 215, "UPI Payment Failure", "1.12%", "5QI-5 Sliced (42.5ms)", AMBER)

    # Large Center Visualization: Capacity Waterfall
    draw.rounded_rectangle([cx, 235, cx + 580, 500], radius=12, fill=CARD_BG, outline=CARD_BORDER)
    draw.text((cx + 20, 250), "STADIUM CAPACITY VS DEMAND WATERFALL (MATCH PHASES)", fill=WHITE)
    phases = ["Ingress 17:00", "Match Start 19:00", "Innings Break 20:30", "Death Overs 22:15", "Post-Match 23:15"]
    loads = [42, 68, 94, 88, 55]
    opt_loads = [35, 52, 74, 69, 44]
    bx = cx + 30
    for p, b_val, o_val in zip(phases, loads, opt_loads):
        draw.text((bx, 470), p[:10], fill=SLATE_GRAY)
        # Baseline bar (red/amber)
        draw.rectangle([bx, 450 - (b_val * 2), bx + 35, 450], fill=(239, 68, 68))
        draw.text((bx, 450 - (b_val * 2) - 16), f"{b_val}%", fill=WHITE)
        # Optimized bar (green)
        draw.rectangle([bx + 40, 450 - (o_val * 2), bx + 75, 450], fill=EMERALD)
        draw.text((bx + 40, 450 - (o_val * 2) - 16), f"{o_val}%", fill=EMERALD)
        bx += 110

    # Right Card: Network Health Scorecard
    rx = cx + 600
    draw.rounded_rectangle([rx, 235, WIDTH - 20, 500], radius=12, fill=CARD_BG, outline=CARD_BORDER)
    draw.text((rx + 20, 250), "COMPOSITE NETWORK HEALTH", fill=WHITE)
    draw.text((rx + 20, 290), "88.6", fill=EMERALD)
    draw.text((rx + 110, 305), "/ 100", fill=SLATE_GRAY)
    draw.rounded_rectangle([rx + 20, 340, rx + 180, 368], radius=6, fill=(16, 185, 129, 30), outline=EMERALD)
    draw.text((rx + 30, 348), "OPTIMAL QUALITY GRADE", fill=EMERALD)

    components = [
        ("Radio PRB Utilization (25%)", 98, EMERALD),
        ("Throughput Compliance (25%)", 98, EMERALD),
        ("5G Accessibility (20%)", 86, CYAN),
        ("UPI Reliability (15%)", 91, EMERALD),
        ("Backhaul Integrity (15%)", 100, EMERALD),
    ]
    cy = 390
    for cname, score, color in components:
        draw.text((rx + 20, cy), f"{cname}: {score}%", fill=SLATE_GRAY)
        draw.rectangle([rx + 20, cy + 18, rx + 320, cy + 24], fill=SLATE_DARK)
        draw.rectangle([rx + 20, cy + 18, rx + 20 + int(3.0 * score), cy + 24], fill=color)
        cy += 40

    # Bottom Alert Banner
    draw.rounded_rectangle([cx, 520, WIDTH - 20, 690], radius=12, fill=(19, 27, 46), outline=CARD_BORDER)
    draw.text((cx + 20, 535), "ACTIVE EVENT OPERATIONS & TELEMETRY FEEDS", fill=WHITE)
    draw.text((cx + 20, 565), "[19:42] Site M4: 0.38km Dark Fibre upgrade active • Link bandwidth 10 Gbps (Peak load 38.5%)", fill=EMERALD)
    draw.text((cx + 20, 595), "[20:15] Concourse COW-02: Offloading South food court • 5QI-5 slice packet latency: 42.5ms", fill=CYAN)
    draw.text((cx + 20, 625), "[20:30] Innings Break: Concurrency spike to 18% (7,200 UEs) • Zero PRB overload detected", fill=WHITE)
    draw.text((cx + 20, 655), "[20:45] BCCI Concession SLA: 100% UPI transaction success • Preserved GMV: Rs 13.78 Lakhs", fill=AMBER)

    img.save(os.path.join(OUTPUT_DIR, "dashboard.png"))


def generate_network_map():
    img, draw, cx = create_base_canvas("Module 2 — Stadium Network Digital Twin", "Digital Twin")

    # Map Canvas
    draw.rounded_rectangle([cx, 120, cx + 600, 680], radius=12, fill=(15, 23, 42), outline=CARD_BORDER)
    draw.text((cx + 20, 135), "NARENDRA MODI STADIUM — 8-SITE TOPOLOGY MAP", fill=WHITE)

    # Stadium Center Oval
    center_x = cx + 300
    center_y = 400
    draw.ellipse([center_x - 140, center_y - 140, center_x + 140, center_y + 140], outline=RED_ACCENT, width=3)
    draw.ellipse([center_x - 70, center_y - 70, center_x + 70, center_y + 70], outline=CARD_BORDER, fill=(24, 34, 58), width=2)
    draw.text((center_x - 30, center_y - 8), "CRICKET PITCH", fill=SLATE_GRAY)

    sites = [
        ("M1", center_x + 100, center_y - 120, "Macro 45°", EMERALD),
        ("M2", center_x + 150, center_y, "Macro 90°", EMERALD),
        ("M3", center_x + 80, center_y + 130, "Macro 180°", EMERALD),
        ("M4", center_x - 110, center_y + 120, "Macro 225° (Fibre)", EMERALD),
        ("M5", center_x - 160, center_y, "Macro 270°", EMERALD),
        ("M6", center_x - 100, center_y - 120, "Macro 315° (Fibre)", EMERALD),
        ("S1", center_x, center_y - 50, "S1 In-Bowl", CYAN),
        ("S2", center_x, center_y + 50, "S2 In-Bowl", CYAN),
    ]

    for sid, sx, sy, sname, scolor in sites:
        draw.ellipse([sx - 15, sy - 15, sx + 15, sy + 15], fill=scolor, outline=WHITE)
        draw.text((sx - 8, sy - 6), sid, fill=(0, 0, 0))
        draw.text((sx - 20, sy + 18), sname, fill=WHITE)

    # Right side: Site Telemetry Matrix
    rx = cx + 620
    draw.rounded_rectangle([rx, 120, WIDTH - 20, 680], radius=12, fill=CARD_BG, outline=CARD_BORDER)
    draw.text((rx + 20, 135), "8-SECTOR RF & BACKHAUL AUDIT", fill=WHITE)

    site_rows = [
        ("M1", "North-East Pavilion", "B3+n78", "10G Fibre", "72.4% Load", EMERALD),
        ("M2", "East Stand Concourse", "B3+n78", "10G Fibre", "74.1% Load", EMERALD),
        ("M3", "South Media Box", "B3+n78", "10G Fibre", "73.2% Load", EMERALD),
        ("M4", "South-West Concourse", "B1+n78", "10G Fibre (Upgraded)", "75.6% Load", CYAN),
        ("M5", "West Stand VIP", "B3+n78", "10G Fibre", "71.8% Load", EMERALD),
        ("M6", "North-West Stand", "B1+n78", "10G Fibre (Upgraded)", "69.5% Load", CYAN),
        ("S1", "Lower Tier North Bowl", "B3 Small Cells", "10G Fibre (Upgraded)", "76.2% Load", EMERALD),
        ("S2", "Lower Tier South Bowl", "B3 Small Cells", "10G Fibre (Upgraded)", "77.5% Load", EMERALD),
    ]
    sy = 175
    for sid, sdesc, sbands, sbh, sload, sc in site_rows:
        draw.rounded_rectangle([rx + 15, sy, WIDTH - 35, sy + 52], radius=8, fill=(15, 23, 42), outline=CARD_BORDER)
        draw.text((rx + 25, sy + 10), f"Site {sid} • {sdesc}", fill=WHITE)
        draw.text((rx + 25, sy + 30), f"RF: {sbands} | Media: {sbh}", fill=SLATE_GRAY)
        draw.text((WIDTH - 120, sy + 18), sload, fill=sc)
        sy += 62

    img.save(os.path.join(OUTPUT_DIR, "network-map.png"))


def generate_capacity_planner():
    img, draw, cx = create_base_canvas("Module 3 — Demand & Capacity Engine", "Capacity Engine")

    # Input Parameters Bar
    draw.rounded_rectangle([cx, 120, WIDTH - 20, 210], radius=10, fill=CARD_BG, outline=CARD_BORDER)
    draw.text((cx + 20, 135), "PARAMETER TUNING (3GPP TR 38.901 CALIBRATION)", fill=WHITE)
    draw.text((cx + 20, 165), "Stadium Attendance: 1,00,000", fill=CYAN)
    draw.text((cx + 250, 165), "Airtel Subscriber Share: 40% (40,000 UEs)", fill=WHITE)
    draw.text((cx + 580, 165), "5G Handset Penetration: 70%", fill=EMERALD)
    draw.text((cx + 20, 185), "Peak Concurrency: 18% (7,200 active)", fill=AMBER)
    draw.text((cx + 250, 185), "Target Speeds: 4G=3 Mbps, 5G=5 Mbps", fill=WHITE)
    draw.text((cx + 580, 185), "Target Utilization Ceiling: <= 80%", fill=EMERALD)

    # Formula Breakdown Card
    draw.rounded_rectangle([cx, 225, cx + 460, 680], radius=12, fill=CARD_BG, outline=CARD_BORDER)
    draw.text((cx + 20, 240), "STEP-BY-STEP MATHEMATICAL FORMULATION", fill=WHITE)

    steps = [
        "1. Active Subscriber Calculation:",
        "   N_active = 100,000 × 0.40 × 0.18 = 7,200 concurrent UEs",
        "",
        "2. 4G vs 5G Traffic Split:",
        "   N_5G = 7,200 × 0.70 = 5,040 UEs",
        "   N_4G = 7,200 × 0.30 = 2,160 UEs",
        "",
        "3. Peak Throughput Demand:",
        "   Demand = (5,040 × 5 Mbps) + (2,160 × 3 Mbps)",
        "   Demand = 25,200 + 6,480 = 31.68 Gbps",
        "",
        "4. Capacity Requirement at 80% Utilization:",
        "   C_req = 31.68 Gbps / 0.80 = 39.60 Gbps",
        "",
        "5. Spectral Gap Analysis:",
        "   Baseline Capacity: 15.78 Gbps",
        "   Capacity Deficit = 39.60 - 15.78 = 23.82 Gbps (Added via HetNet)",
    ]
    fy = 270
    for s in steps:
        draw.text((cx + 20, fy), s, fill=EMERALD if "Demand =" in s or "C_req =" in s else SLATE_GRAY)
        fy += 26

    # Capacity Matrix Table
    rx = cx + 480
    draw.rounded_rectangle([rx, 225, WIDTH - 20, 680], radius=12, fill=CARD_BG, outline=CARD_BORDER)
    draw.text((rx + 20, 240), "DELIVERED SPECTRAL CAPACITY MATRIX", fill=WHITE)

    table_rows = [
        ("Macro Towers (M1–M6 4G/5G)", "6 Sites", "18 Sectors", "25.20 Gbps", "1.40 Gbps/sec"),
        ("Cells on Wheels (COW-01..04)", "4 Sites", "8 Sectors", "8.00 Gbps", "1.00 Gbps/sec"),
        ("In-Bowl Micro Small Cells", "26 Units", "26 Sectors", "6.40 Gbps", "0.25 Gbps/sec"),
        ("TOTAL SYSTEM CAPACITY", "36 Nodes", "52 Sectors", "39.60 Gbps", "3.28 bps/Hz Avg"),
    ]
    ty = 280
    for l1, l2, l3, l4, l5 in table_rows:
        draw.rounded_rectangle([rx + 15, ty, WIDTH - 35, ty + 60], radius=8, fill=(15, 23, 42), outline=CARD_BORDER)
        draw.text((rx + 25, ty + 12), l1, fill=WHITE if "TOTAL" not in l1 else RED_ACCENT)
        draw.text((rx + 25, ty + 34), f"{l2} • {l3}", fill=SLATE_GRAY)
        draw.text((WIDTH - 180, ty + 12), l4, fill=CYAN if "TOTAL" not in l1 else EMERALD)
        draw.text((WIDTH - 180, ty + 34), l5, fill=SLATE_GRAY)
        ty += 70

    img.save(os.path.join(OUTPUT_DIR, "capacity-planner.png"))


def generate_optimizer():
    img, draw, cx = create_base_canvas("Module 4 — Deployment Optimizer", "Deployment Optimizer")

    # Top Status Banner
    draw.rounded_rectangle([cx, 120, WIDTH - 20, 200], radius=10, fill=CARD_BG, outline=CARD_BORDER)
    draw.text((cx + 20, 135), "SCIPY MIXED-INTEGER LINEAR PROGRAMMING (MILP) SOLVER", fill=WHITE)
    draw.text((cx + 20, 165), "Solver Status: OPTIMAL (Exit Code 0) • Total Spend: Rs 3.975 Cr • Cap: Rs 4.00 Cr", fill=EMERALD)

    # Optimized Bill of Materials
    draw.rounded_rectangle([cx, 215, cx + 500, 680], radius=12, fill=CARD_BG, outline=CARD_BORDER)
    draw.text((cx + 20, 230), "OPTIMIZED BILL OF MATERIALS (BOM)", fill=WHITE)

    boms = [
        ("4x Cells on Wheels (COWs)", "Rs 1.00 Cr", "Concourses, Food Courts & Gates 1-3", CYAN),
        ("26x In-Bowl Micro Small Cells", "Rs 1.04 Cr", "Lower Tier Stands (13 North, 13 South)", CYAN),
        ("0.99 km Dark Fibre Trenching", "Rs 0.248 Cr", "M4, M6, S1, S2 Bottleneck Elimination", EMERALD),
        ("Massive MIMO 64T64R Antennas", "Rs 0.687 Cr", "3-Tier 3D Beam Down-Tilt Steerage", CYAN),
        ("QoS 5QI-5 Slicing Software", "Rs 0.150 Cr", "Low-latency UPI & Concession Priority", EMERALD),
        ("Operating Expenses (OpEx)", "Rs 1.000 Cr", "Diesel generators, rigging, RF crews", SLATE_GRAY),
        ("TOTAL COMMITTED CAPITAL", "Rs 3.975 Cr", "Reserve: Rs 2.50 Lakhs Remaining", EMERALD),
    ]
    by = 265
    for item, cost, desc, color in boms:
        draw.rounded_rectangle([cx + 15, by, cx + 485, by + 50], radius=6, fill=(15, 23, 42), outline=CARD_BORDER)
        draw.text((cx + 25, by + 8), item, fill=WHITE)
        draw.text((cx + 25, by + 28), desc, fill=SLATE_GRAY)
        draw.text((cx + 360, by + 16), cost, fill=color)
        by += 58

    # Right side: Dependency & Feasibility Solver
    rx = cx + 520
    draw.rounded_rectangle([rx, 215, WIDTH - 20, 680], radius=12, fill=CARD_BG, outline=CARD_BORDER)
    draw.text((rx + 20, 230), "MILP CONSTRAINTS & CONVERGENCE PROOF", fill=WHITE)

    constraints = [
        ("Budget Constraint: Sum(Costs) <= Rs 4.00 Cr", "PASSED (Rs 3.975 Cr committed)", EMERALD),
        ("Capacity Constraint: Capacity >= 39.60 Gbps", "PASSED (Delivers 39.60 Gbps)", EMERALD),
        ("Backhaul Dependency: 10G before Small Cells", "PASSED (0.99 km fibre installed)", EMERALD),
        ("PRB Congestion Ceiling: Load <= 80%", "PASSED (Peak 78.4% at innings break)", EMERALD),
        ("Anchor Shield: LTE Band 1 Reservation >= 15%", "PASSED (15% PRB reserved)", EMERALD),
        ("UPI SLA: Air Interface Latency <= 50ms", "PASSED (42.5ms latency achieved)", EMERALD),
    ]
    cy = 275
    for ctitle, cstatus, ccolor in constraints:
        draw.rounded_rectangle([rx + 15, cy, WIDTH - 35, cy + 54], radius=6, fill=(15, 23, 42), outline=CARD_BORDER)
        draw.text((rx + 25, cy + 10), ctitle, fill=WHITE)
        draw.text((rx + 25, cy + 30), cstatus, fill=ccolor)
        cy += 64

    img.save(os.path.join(OUTPUT_DIR, "optimizer.png"))


def generate_simulator():
    img, draw, cx = create_base_canvas("Module 5 — Live What-If Network Simulator", "What-If Simulator")

    # Stress Test Scenario Banner
    draw.rounded_rectangle([cx, 120, WIDTH - 20, 210], radius=10, fill=CARD_BG, outline=CARD_BORDER)
    draw.text((cx + 20, 135), "SURGE SCENARIO SIMULATION: 1,20,000 SPECTATORS (20% OVERFLOW)", fill=RED_ACCENT)
    draw.text((cx + 20, 165), "Crowd: 1,20,000 | Active UEs: 8,640 (+20%) | Throughput Demand: 38.02 Gbps", fill=WHITE)
    draw.text((cx + 20, 185), "Simulator Detection: Capacity Deficit Alert Flagged (+2.42 Gbps short) • Backhaul: Stable", fill=AMBER)

    # 3-Way Scenario Matrix
    col_w = (WIDTH - cx - 20 - 30) // 3
    c1 = cx
    c2 = cx + col_w + 15
    c3 = cx + 2 * col_w + 30

    def draw_sim_col(x, title, cap, load, tput, upi, health, badge_color):
        draw.rounded_rectangle([x, 225, x + col_w, 680], radius=12, fill=CARD_BG, outline=CARD_BORDER)
        draw.text((x + 16, 240), title.upper(), fill=WHITE)
        draw.text((x + 16, 280), f"Capacity: {cap}", fill=SLATE_GRAY)
        draw.text((x + 16, 320), f"Peak PRB Load: {load}", fill=badge_color)
        draw.text((x + 16, 360), f"Throughput: {tput}", fill=WHITE)
        draw.text((x + 16, 400), f"UPI Failure: {upi}", fill=badge_color)
        draw.text((x + 16, 440), f"Health Score: {health}", fill=badge_color)

    draw_sim_col(c1, "Baseline (65k Match)", "65,000 UEs", "98.9% (Saturated)", "1.08 Mbps (4G)", "7.11% (Failure)", "35.2 / 100", (239, 68, 68))
    draw_sim_col(c2, "Proposed (100k Target)", "1,00,000 UEs", "78.4% (Optimal)", "3.68 Mbps (4G)", "1.12% (Sliced)", "88.6 / 100", EMERALD)
    draw_sim_col(c3, "Surge Test (120k Crowd)", "1,20,000 UEs", "82.5% (Over 80%)", "2.85 Mbps (Degraded)", "1.35% (Safe)", "72.4 / 100", AMBER)

    img.save(os.path.join(OUTPUT_DIR, "simulator.png"))


def generate_budget_planner():
    img, draw, cx = create_base_canvas("Module 6 — Budget & Asset Allocator", "Budget & Assets")

    # Cap Status Banner
    draw.rounded_rectangle([cx, 120, WIDTH - 20, 200], radius=10, fill=CARD_BG, outline=CARD_BORDER)
    draw.text((cx + 20, 135), "EXECUTIVE BUDGET COMPLIANCE MONITOR (Rs 4.00 CRORE CAP)", fill=WHITE)
    draw.text((cx + 20, 165), "Committed Spend: Rs 3.975 Crore (99.4%) • Remaining Reserve: Rs 2.50 Lakhs (0.6%)", fill=EMERALD)

    # CapEx vs OpEx Split
    draw.rounded_rectangle([cx, 215, cx + 460, 680], radius=12, fill=CARD_BG, outline=CARD_BORDER)
    draw.text((cx + 20, 230), "CAPEX VS OPEX EXPENDITURE BREAKDOWN", fill=WHITE)

    draw.text((cx + 20, 270), "CapEx (Capital Expenditure): Rs 2.975 Cr (74.8%)", fill=CYAN)
    draw.text((cx + 20, 295), "  • 4x Cells on Wheels (COWs): Rs 1.00 Cr", fill=SLATE_GRAY)
    draw.text((cx + 20, 320), "  • 26x In-Bowl Micro Small Cells: Rs 1.04 Cr", fill=SLATE_GRAY)
    draw.text((cx + 20, 345), "  • 0.99 km Dark Fibre Expansion: Rs 0.248 Cr", fill=SLATE_GRAY)
    draw.text((cx + 20, 370), "  • 64T64R Massive MIMO Upgrades: Rs 0.687 Cr", fill=SLATE_GRAY)

    draw.text((cx + 20, 420), "OpEx (Operational Expenditure): Rs 1.000 Cr (25.2%)", fill=AMBER)
    draw.text((cx + 20, 445), "  • Temporary Concourse Leases: Rs 0.25 Cr", fill=SLATE_GRAY)
    draw.text((cx + 20, 470), "  • Generator Power & Fuel: Rs 0.20 Cr", fill=SLATE_GRAY)
    draw.text((cx + 20, 495), "  • 24x7 Specialized Field Riggers: Rs 0.35 Cr", fill=SLATE_GRAY)
    draw.text((cx + 20, 520), "  • Cloud Telemetry & Licensing: Rs 0.20 Cr", fill=SLATE_GRAY)

    draw.text((cx + 20, 580), "Unit Economics:", fill=WHITE)
    draw.text((cx + 20, 605), "  • Cost per additional Gbps: Rs 3.73 Lakhs", fill=EMERALD)
    draw.text((cx + 20, 630), "  • Cost per additional user: Rs 1,135.70", fill=EMERALD)

    # Strategy Comparison Table
    rx = cx + 480
    draw.rounded_rectangle([rx, 215, WIDTH - 20, 680], radius=12, fill=CARD_BG, outline=CARD_BORDER)
    draw.text((rx + 20, 230), "5 DEPLOYMENT STRATEGIES COMPARED", fill=WHITE)

    strats = [
        ("1. Do-Nothing Baseline", "Rs 0.00 Cr", "15.78 Gbps", "CRITICAL DEFICIT", (239, 68, 68)),
        ("2. Macro Only Expansion", "Rs 2.40 Cr", "24.50 Gbps", "MARGINAL", AMBER),
        ("3. Airtel HetNet (Proposed)", "Rs 3.975 Cr", "39.60 Gbps", "OPTIMAL (RECOMMENDED)", EMERALD),
        ("4. COW Fleet Only", "Rs 2.80 Cr", "26.00 Gbps", "INTERFERENCE RISK", AMBER),
        ("5. Extreme Densification", "Rs 5.50 Cr", "46.00 Gbps", "BUDGET BREACH", (239, 68, 68)),
    ]
    sty = 275
    for sname, scost, scap, sstatus, scolor in strats:
        draw.rounded_rectangle([rx + 15, sty, WIDTH - 35, sty + 64], radius=8, fill=(15, 23, 42), outline=CARD_BORDER)
        draw.text((rx + 25, sty + 12), sname, fill=WHITE)
        draw.text((rx + 25, sty + 36), f"Cost: {scost} | Capacity: {scap}", fill=SLATE_GRAY)
        draw.text((WIDTH - 200, sty + 24), sstatus, fill=scolor)
        sty += 76

    img.save(os.path.join(OUTPUT_DIR, "budget-planner.png"))


def generate_evaluation():
    img, draw, cx = create_base_canvas("Evaluation Centre — Performance Audit", "Evaluation Centre")

    # Top Audit Header
    draw.rounded_rectangle([cx, 120, WIDTH - 20, 200], radius=10, fill=CARD_BG, outline=CARD_BORDER)
    draw.text((cx + 20, 135), "THREE-WAY PERFORMANCE AUDIT (BASELINE VS PROPOSED VS SIMULATED)", fill=WHITE)
    draw.text((cx + 20, 165), "Airtel Stadium360 Internal Evaluation Score: 88.6 / 100 • Congestion Reduction: 100.0%", fill=EMERALD)

    # 3-Way Comparative Matrix Table
    draw.rounded_rectangle([cx, 215, WIDTH - 20, 680], radius=12, fill=CARD_BG, outline=CARD_BORDER)
    draw.text((cx + 20, 230), "COMPREHENSIVE TELEMETRY BENCHMARK MATRIX", fill=WHITE)

    matrix = [
        ("Evaluation Parameter", "Existing (65k)", "Proposed (100k)", "Improvement Delta"),
        ("Average 4G PRB Utilization", "93.9% (Saturated)", "58.1% (Safe load)", "-38.1% Load Drop"),
        ("Peak 4G PRB Utilization", "99.8% (Saturated)", "78.4% (Under 80%)", "-21.4% Peak Drop"),
        ("Congested Sites Count (>80%)", "7 of 8 sites (87.5%)", "0 of 8 sites (0.0%)", "-100.0% Congestion"),
        ("Average 4G User Speed", "1.08 Mbps (Stall)", "3.68 Mbps (Above SLA)", "+240.7% Speed Gain"),
        ("Average 5G User Speed", "26.8 Mbps", "65.0 Mbps", "+142.3% Speed Gain"),
        ("5G Connection Success Rate", "38.5% (Anchor Drops)", "86.2% (Anchor Shield)", "+123.9% Success Gain"),
        ("UPI Payment Failure Rate", "7.11% (Bufferbloat)", "1.12% (5QI-5 Sliced)", "-84.2% Failure Drop"),
        ("Backhaul Transport Capacity", "46.0 Gbps (4 Chokepoints)", "80.0 Gbps (All Clear)", "+73.9% Bandwidth"),
        ("Infrastructure Spend", "Rs 0.00 Cr", "Rs 3.975 Cr (99.4%)", "Within Rs 4.00 Cr Cap"),
        ("Composite Network Health", "35.2 / 100 (CRITICAL)", "88.6 / 100 (OPTIMAL)", "+151.7% Health Gain"),
    ]
    my = 265
    for p, b, pr, delta in matrix:
        is_header = (p == "Evaluation Parameter")
        bg_col = (24, 34, 58) if is_header else (15, 23, 42)
        draw.rounded_rectangle([cx + 15, my, WIDTH - 35, my + 34], radius=6, fill=bg_col, outline=CARD_BORDER)
        draw.text((cx + 25, my + 8), p, fill=RED_ACCENT if is_header else WHITE)
        draw.text((cx + 340, my + 8), b, fill=SLATE_GRAY if is_header else (239, 68, 68))
        draw.text((cx + 560, my + 8), pr, fill=SLATE_GRAY if is_header else CYAN)
        draw.text((cx + 780, my + 8), delta, fill=SLATE_GRAY if is_header else EMERALD)
        my += 38

    img.save(os.path.join(OUTPUT_DIR, "evaluation.png"))


if __name__ == "__main__":
    generate_dashboard()
    generate_network_map()
    generate_capacity_planner()
    generate_optimizer()
    generate_simulator()
    generate_budget_planner()
    generate_evaluation()
    print("All 7 screenshots generated successfully in docs/screenshots!")

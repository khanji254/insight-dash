

# "Follow the Money" – Anti-Corruption Procurement Tracker

## Overview
A professional investigative dashboard that correlates campaign donations with government tender awards, flagging suspicious patterns between political financing and public procurement.

## Visual Identity
- **Theme**: Clean whites, deep navy (`#1e293b`) accents, warning red (`#dc2626`) for high-risk flags
- **Typography**: Sharp, professional — system fonts with tight spacing
- **Icons**: Lucide-react throughout
- **Components**: Shadcn UI cards, tables, badges, and tabs

## Navigation (Sidebar)
- **Dashboard** – Overview with KPIs and red flag feed
- **Risk Leaderboard** – Ranked entities by risk score
- **Entity Profile** – Deep-dive on a company or politician (accessed via clicking entities)
- **Data Sources** – Info pages for IEBC, PPIP, Kenya Gazette
- **About** – TI-Kenya compliance and methodology

## Pages & Features

### 1. Dashboard Overview
- **4 KPI Cards**: Total Disclosed Donations, Total Contracts Awarded to Donors, Average ROI for Donors, High-Risk Entities Flagged — each with trend indicators
- **Red Flag Feed**: Scrolling list of donor↔tender matches, each showing Entity A, Entity B, match confidence, risk score (color-coded 0–100), amounts, and dates
- **AI Insights Panel**: Highlighted boxes with auto-generated narratives about suspicious patterns

### 2. Risk Leaderboard
- Sortable/filterable data table of entities ranked by risk score
- Columns: Entity Name, Type (Company/Individual), Risk Score, Total Donations, Total Contracts Won, Match Count
- Click-through to Entity Profile

### 3. Entity Profile Page
- Header with entity name, type, risk score badge
- **Timeline Component**: Visual horizontal timeline showing Donation Date → Election Date → Company Registration → Tender Award
- **Connection Summary**: Cards showing linked donors, parties, ministries, and contracts
- **Connection Map Placeholder**: Styled placeholder for future Cytoscape/D3 graph showing Donor → Party → Ministry → Contract links
- **AI Insight Box**: Contextual narrative about this entity's patterns

### 4. Data Sources Page
- Cards for each data source (IEBC donations, PPIP tenders, Kenya Gazette appointments)
- Description of what each source provides and last sync date

### 5. About Page
- TI-Kenya compliance statement, methodology explanation

## Mock Data
- **Donors**: ~15 mock entries with Name, Amount, Party, Date
- **Tenders**: ~15 mock entries with Company Name, Amount, Ministry, Award Date
- **Appointments**: ~10 mock entries with Name, Role, Gazette Reference
- **Fuzzy Match Logic**: Simple string similarity function that flags partial name matches (e.g., "ABC Ltd" ↔ "ABC Kenya Limited") with confidence scores
- **Risk Score Calculation**: Based on donation-to-award timing, amount ratios, and match confidence


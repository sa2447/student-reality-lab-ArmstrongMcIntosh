# Data Notes

Default analysis year: 2025

## Minimum wage sources (2025)
- NY: https://dol.ny.gov/history-minimum-wage-new-york-state
	- Note: NY has region-specific rates; for this project we group them as **Downstate** (NYC + Long Island & Westchester) vs **Upstate** (remainder).
- NJ: https://www.nj.gov/labor/lwdhome/press/2024/20241008_minwage.shtml
- CT: https://portal.ct.gov/governor/news/press-releases/2024/09-2024/governor-lamont-announces-minimum-wage-will-increase-in-2025/

Working draft wage table (Toolkit project):
- `Projects/Midterm_Resources/inputs/wage_2025.json`

## Cost-of-living benchmark
We use a **constructed basic monthly budget** based on open government sources.

Definition (2025, 1 adult, 0 children):
- **Housing:** HUD FY2025 Fair Market Rent (FMR) for a **1-bedroom**, aggregated using **population-weighted averages (pop2022)**.
	- Note: HUD defines FMR as **gross rent** (rent + utilities).
	- NY is split into **Downstate vs Upstate** based on county membership (NYC + Nassau + Suffolk + Westchester vs remainder).
- **Food:** USDA Thrifty Food Plan (U.S. average), January 2025.
	- Use **adult 20–50** monthly costs for Female and Male, take the average, then apply USDA’s suggested **+20% 1-person household adjustment**.
- **Car operating (proxy):** BLS Consumer Expenditure Surveys (CEX) publication tables (All consumer units).
	- Use **2024** annual means as a proxy for 2025 (because 2025 annual means may not be published yet), then divide by 12 for a monthly value.

Outputs:
- Raw dataset used by the app: `data/raw.json`
- Convenience export (derived from `raw.json`): `data/raw.csv`
- Derived metrics (Income Gap, Coverage Ratio): `data/processed.json` (40 hours/week snapshot; interactive hours should be computed from `raw.json`)

Notes:
- This benchmark is intentionally “basic” (housing + food + a car operating proxy) and will undercount expenses like payroll/income taxes, healthcare, childcare, and car ownership costs (payments/insurance), among other items.
- MIT Living Wage Calculator was not used because the site states “Please do not scrape the data” and references licensing; we are avoiding storing/redistributing values without explicit permission.

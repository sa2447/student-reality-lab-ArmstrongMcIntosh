# Presentation Script (STAR)

## Situation (≈20–30s)
Minimum wage is usually discussed as a single hourly number, but affordability is a monthly problem: rent and food are paid in monthly cycles, and transportation costs don’t scale cleanly with hours worked. In the NY/NJ/CT area, the headline minimum wage is also not “one size fits all” because New York’s minimum wage differs Downstate vs Upstate.

## Task (≈20–30s)
Build a license-safe, reproducible comparison of minimum-wage affordability across four regions:
- NY (Downstate)
- NY (Upstate)
- NJ
- CT

The benchmark needed to be consistent across regions and grounded in public/government sources.

## Action (≈60–90s)
I created a simple “basic monthly cost of living” benchmark and a small interactive app that recomputes the results from raw data.

**Major engineering decision**
- Keep the project **license-safe and reproducible** by committing `data/raw.json` and recomputing all derived metrics in the app (no external database, no scraped closed data). The UI fetches the raw dataset from an API route and applies the same formulas on the client when the hours slider changes.

**Benchmark definition (USD/month)**
- Housing: HUD FY2025 Fair Market Rent for a 1-bedroom (gross rent; population-weighted where needed)
- Food: USDA Thrifty Food Plan (January 2025), single adult benchmark
- Transportation proxy: BLS Consumer Expenditure Survey (CEX) 2024 annual means used as a proxy for 2025, converted to monthly

**App story flow (three views, one page)**
- View 1: Wage context (USD/hour)
- View 2: Cost breakdown (components shown side-by-side)
- View 3: Monthly income vs monthly cost + Income Gap

**Two interactions**
- Focus Region selector: highlights one region across all views
- Hours/week slider (20–60): changes computed monthly income and the Income Gap view

## Result (≈30–45s)
The key metric is **Income Gap** = monthly income − monthly cost.

**Headline numbers (40 hours/week)**
- **NY Downstate:** −$356.15/month (coverage ratio 0.89)
- **NY Upstate:** +$614.81/month (coverage ratio 1.30)
- **NJ statewide:** +$78.12/month (coverage ratio 1.03)
- **CT statewide:** +$438.62/month (coverage ratio 1.18)

**What changes when you interact**
- Increasing hours/week increases monthly income linearly, so borderline regions can flip from a small surplus to a deficit (or vice-versa).
- Example: **NY Downstate** goes from **−$356/month at 40 hours/week** to about **+$1,073/month at 60 hours/week** under this benchmark.

At **40 hours/week**, some regions show a negative gap even for this basic bundle, especially where housing costs are higher.
The slider demonstrates how sensitive affordability is to hours worked—and where additional hours still may not fully close the gap.

## Reflection / Limitations (≈20–30s)
This benchmark is intentionally narrow and does **not** include taxes, healthcare, childcare, debt payments, or savings, so the real-world margin can be tighter.
The purpose is to provide a consistent, license-safe baseline for comparison—not a full household budget.

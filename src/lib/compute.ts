import type { ProcessedDataset, ProcessedRow, RawDataset, RawRow } from './schema';

export function roundToCents(value: number): number {
  return Math.round(value * 100) / 100;
}

export function computeMonthlyIncome(hourlyMinWage: number, hoursPerWeek: number): number {
  // 4.33 ≈ 52/12
  return hourlyMinWage * hoursPerWeek * 4.33;
}

export function computeMonthlyCostOfLiving(row: RawRow): number {
  return (
    row.costs.housing_monthly_1br_fmr +
    row.costs.food_monthly_tfp_1_adult +
    row.costs.car_operating_monthly
  );
}

export function computeProcessedRow(row: RawRow, hoursPerWeek: number): ProcessedRow {
  const monthly_income = roundToCents(computeMonthlyIncome(row.hourly_min_wage, hoursPerWeek));
  const monthly_cost_of_living = roundToCents(computeMonthlyCostOfLiving(row));
  const income_gap = roundToCents(monthly_income - monthly_cost_of_living);
  const coverage_ratio = roundToCents(monthly_income / monthly_cost_of_living);

  return {
    year: row.year,
    state: row.state,
    region: row.region,
    hours_per_week: hoursPerWeek,
    hourly_min_wage: row.hourly_min_wage,
    monthly_income,
    monthly_cost_of_living,
    income_gap,
    coverage_ratio,
    costs: row.costs
  };
}

export function computeProcessedDataset(raw: RawDataset, hoursPerWeek: number): ProcessedDataset {
  return {
    year: raw.year,
    retrieved_on: raw.retrieved_on,
    metric_definitions: {
      monthly_income: 'hourly_min_wage * hours_per_week * 4.33 (4.33 ≈ 52/12)',
      monthly_cost_of_living: 'housing (HUD FMR gross rent) + food (USDA TFP) + car operating (BLS CEX proxy)',
      income_gap: 'monthly_income - monthly_cost_of_living'
    },
    rows: raw.rows.map((r) => computeProcessedRow(r, hoursPerWeek))
  };
}

export type StateCode = 'NY' | 'NJ' | 'CT';

export interface SourceLink {
	name: string;
	url: string;
}

export interface RawCostComponents {
	housing_monthly_1br_fmr: number;
	food_monthly_tfp_1_adult: number;
	car_operating_monthly: number;
}

export interface RawRow {
	year: number;
	state: StateCode;
	region: string;
	effective_date: string;
	hourly_min_wage: number;
	costs: RawCostComponents;
}

export interface RawDataset {
	year: number;
	retrieved_on: string;
	definition: {
		household: string;
		cost_of_living: {
			housing: string;
			food: string;
			car_operating: string;
		};
		ny_handling: string;
	};
	sources: {
		minimum_wage: SourceLink[];
		hud_fmr: SourceLink;
		usda_tfp: SourceLink & {
			extracted: Record<string, number>;
		};
		bls_cex_car_operating: SourceLink & {
			year_used_as_proxy: number;
			extracted: {
				gasoline_and_other_fuels_annual_usd: number;
				other_vehicle_expenses_annual_usd: number;
				derived_car_operating_annual_usd: number;
				derived_car_operating_monthly_usd: number;
			};
		};
	};
	rows: RawRow[];
}

export interface ProcessedRow {
	year: number;
	state: StateCode;
	region: string;
	hours_per_week: number;
	hourly_min_wage: number;
	monthly_income: number;
	monthly_cost_of_living: number;
	income_gap: number;
	coverage_ratio: number;
	costs: RawCostComponents;
}

export interface ProcessedDataset {
	year: number;
	retrieved_on: string;
	metric_definitions: {
		monthly_income: string;
		monthly_cost_of_living: string;
		income_gap: string;
	};
	rows: ProcessedRow[];
}

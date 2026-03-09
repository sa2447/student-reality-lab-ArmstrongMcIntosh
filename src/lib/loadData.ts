import path from 'node:path';
import { readFile } from 'node:fs/promises';
import type { ProcessedDataset, ProcessedRow, RawDataset, RawRow } from './schema';

import { computeProcessedDataset, computeProcessedRow, computeMonthlyCostOfLiving, computeMonthlyIncome, roundToCents } from './compute';

export async function loadRawDataset(filePath?: string): Promise<RawDataset> {
	const resolvedPath =
		filePath ?? path.join(process.cwd(), 'data', 'raw.json');
	const rawText = await readFile(resolvedPath, 'utf8');
	return JSON.parse(rawText) as RawDataset;
}

export async function loadProcessedDataset(hoursPerWeek = 40, filePath?: string): Promise<ProcessedDataset> {
	const raw = await loadRawDataset(filePath);
	return computeProcessedDataset(raw, hoursPerWeek);
}

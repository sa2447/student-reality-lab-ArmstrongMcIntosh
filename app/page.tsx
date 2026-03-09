"use client";

import { useEffect, useMemo, useState } from 'react';

import { computeProcessedDataset } from '../src/lib/compute';
import { formatUsd, regionLabel } from '../src/lib/present';
import { makeRegionKey, parseRegionKey } from '../src/lib/regionKey';

import { useRawDataset } from './hooks/useRawDataset';
import { TriStateOutlineMap } from './ui/TriStateOutlineMap';
import { COLORS, STYLES } from './ui/theme';

import { FocusRegionSelector } from './components/FocusRegionSelector';
import { HoursAndUnitsPanel } from './components/HoursAndUnitsPanel';
import { View1WageContext } from './views/View1WageContext';
import { View2CostBreakdown } from './views/View2CostBreakdown';
import { View3IncomeVsCost } from './views/View3IncomeVsCost';

type Annotation = {
  title: string;
  body: string;
  key: string;
};

export default function Page() {
  const { raw, error: loadError, loading } = useRawDataset();
  const [hoursPerWeek, setHoursPerWeek] = useState<number>(40);
  const [selectedRegionKey, setSelectedRegionKey] = useState<string>('');

  useEffect(() => {
    if (!raw) return;
    if (selectedRegionKey) return;
    const first = raw.rows[0];
    if (first) setSelectedRegionKey(makeRegionKey(first.state, first.region));
  }, [raw, selectedRegionKey]);

  const processed = useMemo(() => {
    if (!raw) return null;
    return computeProcessedDataset(raw, hoursPerWeek);
  }, [raw, hoursPerWeek]);

  const regions = useMemo(() => {
    if (!raw) return [] as { key: string; label: string }[];
    return raw.rows.map((r) => ({ key: makeRegionKey(r.state, r.region), label: regionLabel(r.state, r.region) }));
  }, [raw]);

  const selectedRawRow = useMemo(() => {
    if (!raw || !selectedRegionKey) return null;
    const parsed = parseRegionKey(selectedRegionKey);
    return raw.rows.find((r) => r.state === parsed.state && r.region === parsed.region) ?? null;
  }, [raw, selectedRegionKey]);

  const selectedProcessedRow = useMemo(() => {
    if (!processed || !selectedRegionKey) return null;
    const parsed = parseRegionKey(selectedRegionKey);
    return processed.rows.find((r) => r.state === parsed.state && r.region === parsed.region) ?? null;
  }, [processed, selectedRegionKey]);

  const wageAnnotation: Annotation | null = useMemo(() => {
    if (!raw || raw.rows.length === 0) return null;
    const focus = raw.rows.reduce((best, cur) => (cur.hourly_min_wage > best.hourly_min_wage ? cur : best), raw.rows[0]);
    const key = makeRegionKey(focus.state, focus.region);
    const label = regionLabel(focus.state, focus.region);
    return {
      key,
      title: 'Highest minimum wage in our comparison set',
      body: `${label} has the highest hourly minimum wage in this dataset: $${focus.hourly_min_wage.toFixed(2)}/hour (effective ${focus.effective_date}).`
    };
  }, [raw]);

  const costAnnotation: Annotation | null = useMemo(() => {
    if (!raw || raw.rows.length === 0) return null;
    const focus = raw.rows.reduce(
      (best, cur) => (cur.costs.housing_monthly_1br_fmr > best.costs.housing_monthly_1br_fmr ? cur : best),
      raw.rows[0]
    );
    const key = makeRegionKey(focus.state, focus.region);
    const label = regionLabel(focus.state, focus.region);
    return {
      key,
      title: 'Housing is the biggest swing factor',
      body: `${label} has the highest housing benchmark in the dataset: ${formatUsd(focus.costs.housing_monthly_1br_fmr)}/month (HUD FY25 1BR FMR, pop-weighted).`
    };
  }, [raw]);

  const gapAnnotation: Annotation | null = useMemo(() => {
    if (!processed || processed.rows.length === 0) return null;

    const rows = processed.rows;
    const negatives = rows.filter((r) => r.income_gap < 0);

    const focusRows = negatives.length > 0 ? negatives : rows;
    const focus = focusRows.reduce((best, cur) => (cur.income_gap < best.income_gap ? cur : best), focusRows[0]);

    const key = makeRegionKey(focus.state, focus.region);
    const label = regionLabel(focus.state, focus.region);

    if (negatives.length > 0) {
      return {
        key,
        title: 'Biggest shortfall at this hours setting',
        body: `At ${hoursPerWeek} hours/week, ${label} falls short by ${formatUsd(Math.abs(focus.income_gap))} per month (income ${formatUsd(focus.monthly_income)} vs cost ${formatUsd(focus.monthly_cost_of_living)}).`
      };
    }

    return {
      key,
      title: 'Tightest margin at this hours setting',
      body: `At ${hoursPerWeek} hours/week, the tightest margin is ${label}: a surplus of ${formatUsd(focus.income_gap)} per month (income ${formatUsd(focus.monthly_income)} vs cost ${formatUsd(focus.monthly_cost_of_living)}).`
    };
  }, [processed, hoursPerWeek]);

  return (
    <div style={STYLES.page}>
      <main style={STYLES.pageInner}>
        <header style={STYLES.headerCard}>
          <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap' }}>
            <div style={{ minWidth: 320, flex: '1 1 520px' }}>
              <h1 style={{ margin: 0, fontSize: 28, lineHeight: 1.15, color: COLORS.ink }}>
                Minimum Wage vs Cost of Living (Tri-State Area)
              </h1>
              <p style={{ marginTop: 10, marginBottom: 0, color: COLORS.mutedInk, lineHeight: 1.5 }}>
                Does full-time minimum wage cover a consistent <strong>basic</strong> cost-of-living benchmark in the tri-state area? This
                walks from wage context to cost evidence to the income-gap takeaway.
              </p>
            </div>

            <div style={{ flex: '0 0 auto' }}>
              <TriStateOutlineMap selectedRegionKey={selectedRegionKey} />
            </div>
          </div>
        </header>

      <FocusRegionSelector
        value={selectedRegionKey}
        options={regions}
        disabled={!raw}
        onChange={(nextKey) => setSelectedRegionKey(nextKey)}
      />

      {loadError ? (
        <p style={{ marginTop: 16, color: 'crimson' }}>
          <strong>Error:</strong> {loadError}
        </p>
      ) : null}

      {!processed ? (
        <p style={{ marginTop: 16 }}>{loading ? 'Loading dataset…' : 'No data loaded.'}</p>
      ) : (
        <>
          <View1WageContext raw={raw!} selectedRegionKey={selectedRegionKey} wageAnnotation={wageAnnotation} />

          <hr style={STYLES.sectionDivider} />

          <View2CostBreakdown
            raw={raw!}
            selectedRegionKey={selectedRegionKey}
            selectedRawRow={selectedRawRow}
            costAnnotation={costAnnotation}
          />

          <hr style={STYLES.sectionDivider} />

          <HoursAndUnitsPanel hoursPerWeek={hoursPerWeek} onHoursChange={(next) => setHoursPerWeek(next)} />

          <hr style={STYLES.sectionDivider} />

          <View3IncomeVsCost
            processed={processed}
            selectedRegionKey={selectedRegionKey}
            hoursPerWeek={hoursPerWeek}
            selectedProcessedRow={selectedProcessedRow}
            gapAnnotation={gapAnnotation}
          />
        </>
      )}

      <footer style={{ marginTop: 24, fontSize: 12, color: COLORS.mutedInk }}>
        Data source files live in <code>data/raw.json</code> and <code>data/processed.json</code>. The app recomputes derived metrics from raw
        data for the selected hours/week.
      </footer>
      </main>
    </div>
  );
}

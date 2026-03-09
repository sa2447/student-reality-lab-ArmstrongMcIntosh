"use client";

import { useMemo } from 'react';

import type { ProcessedDataset, ProcessedRow } from '../../src/lib/schema';
import { formatUsd, regionLabel } from '../../src/lib/present';
import { makeRegionKey } from '../../src/lib/regionKey';

import { COLORS, STYLES } from '../ui/theme';
import { AnnotationCard } from './AnnotationCard';
import { ViewTitle } from './ViewTitle';

type Annotation = {
  title: string;
  body: string;
  key: string;
};

export function View3IncomeVsCost({
  processed,
  selectedRegionKey,
  hoursPerWeek,
  selectedProcessedRow,
  gapAnnotation
}: {
  processed: ProcessedDataset;
  selectedRegionKey: string;
  hoursPerWeek: number;
  selectedProcessedRow: ProcessedRow | null;
  gapAnnotation: Annotation | null;
}) {
  const maxUsd = useMemo(() => {
    const maxValue = Math.max(...processed.rows.flatMap((r) => [r.monthly_income, r.monthly_cost_of_living]));
    const step = 500;
    return Math.max(step, Math.ceil(maxValue / step) * step);
  }, [processed]);

  const ticks = useMemo(() => {
    const step = 1000;
    const out: number[] = [];
    for (let v = 0; v <= maxUsd; v += step) out.push(v);
    return out;
  }, [maxUsd]);

  return (
    <section aria-label="View 3: Income vs cost" style={{ marginTop: 16 }}>
      <ViewTitle view="View 3" title="Income vs cost of living + Income Gap (USD/month)" />

      {selectedProcessedRow ? (
        <div style={{ fontSize: 12, color: COLORS.mutedInk, marginBottom: 8 }}>
          Focused region at {hoursPerWeek} hrs/week: <strong>{regionLabel(selectedProcessedRow.state, selectedProcessedRow.region)}</strong>{' '}
          — income {formatUsd(selectedProcessedRow.monthly_income)}, cost {formatUsd(selectedProcessedRow.monthly_cost_of_living)}, gap{' '}
          {formatUsd(selectedProcessedRow.income_gap)}
        </div>
      ) : null}

      <div style={{ fontSize: 12, color: COLORS.mutedInk, marginBottom: 8 }}>
        <div>
          <strong>X-axis:</strong> USD per month (0 to {maxUsd.toLocaleString()})
        </div>
        <div>
          <strong>Bars:</strong> Income (gross) and Cost of living (basic)
        </div>
      </div>

      <div style={STYLES.card}>
        <svg width={900} height={440} viewBox="0 0 900 440" role="img" aria-label="Bar chart of income and cost by region">
          <title>Monthly income vs monthly basic cost of living by region</title>
          <rect x={0} y={0} width={900} height={440} fill={COLORS.white} />

          {ticks.map((t) => {
            const x = 120 + (t / maxUsd) * 760;
            return (
              <g key={t}>
                <line x1={x} y1={20} x2={x} y2={400} stroke={COLORS.grid} />
                <text x={x} y={422} fontSize={10} textAnchor="middle" fill={COLORS.mutedInk}>
                  {t === 0 ? '0' : `$${(t / 1000).toFixed(0)}k`}
                </text>
              </g>
            );
          })}

          {processed.rows.map((r, idx) => {
            const rowStep = 96;
            const yBase = 44 + idx * rowStep;
            const key = makeRegionKey(r.state, r.region);
            const label = regionLabel(r.state, r.region);
            const isSelected = key === selectedRegionKey;

            const incomeW = (r.monthly_income / maxUsd) * 760;
            const costW = (r.monthly_cost_of_living / maxUsd) * 760;

            const incomeLabelNaturalX = 120 + incomeW + 6;
            const costLabelNaturalX = 120 + costW + 6;
            const incomeLabelX = incomeLabelNaturalX > 840 ? 890 : incomeLabelNaturalX;
            const costLabelX = costLabelNaturalX > 840 ? 890 : costLabelNaturalX;
            const incomeLabelAnchor: 'start' | 'end' = incomeLabelX === 890 ? 'end' : 'start';
            const costLabelAnchor: 'start' | 'end' = costLabelX === 890 ? 'end' : 'start';

            return (
              <g key={key}>
                {isSelected ? (
                  <g>
                    <rect x={0} y={yBase - 26} width={900} height={92} fill={COLORS.cardBg} stroke={COLORS.border} />
                    <rect x={0} y={yBase - 26} width={6} height={92} fill={COLORS.income} />
                  </g>
                ) : null}

                <text x={12} y={yBase + 14} fontSize={12} fontWeight={isSelected ? 700 : 400} fill={COLORS.ink}>
                  {label}
                </text>

                <rect x={120} y={yBase} width={incomeW} height={18} fill={COLORS.income} />
                <text x={incomeLabelX} y={yBase + 14} fontSize={11} fill={COLORS.ink} textAnchor={incomeLabelAnchor}>
                  income {formatUsd(r.monthly_income)}
                </text>

                <rect x={120} y={yBase + 26} width={costW} height={18} fill={COLORS.housing} />
                <text x={costLabelX} y={yBase + 40} fontSize={11} fill={COLORS.ink} textAnchor={costLabelAnchor}>
                  cost {formatUsd(r.monthly_cost_of_living)}
                </text>

                <text x={120} y={yBase + 60} fontSize={11} fill={r.income_gap < 0 ? '#b91c1c' : '#1f2937'}>
                  income gap: {formatUsd(r.income_gap)} (ratio {r.coverage_ratio.toFixed(2)}x)
                </text>
              </g>
            );
          })}

          <text x={500} y={14} fontSize={12} textAnchor="middle" fill={COLORS.ink}>
            USD per month
          </text>
        </svg>

        <div style={{ display: 'flex', gap: 16, marginTop: 10, fontSize: 12, color: COLORS.mutedInk }}>
          <div>
            <span style={{ display: 'inline-block', width: 12, height: 12, background: COLORS.income, marginRight: 6 }} />Income (gross)
          </div>
          <div>
            <span style={{ display: 'inline-block', width: 12, height: 12, background: COLORS.housing, marginRight: 6 }} />Cost of living
            (basic)
          </div>
        </div>
      </div>

      {gapAnnotation ? <AnnotationCard annotation={gapAnnotation} /> : null}

      <h3 style={{ margin: '16px 0 8px' }}>What to notice</h3>
      <p style={{ lineHeight: 1.5, color: '#222' }}>
        Affordability is where wages and costs meet. This view converts each region’s minimum wage into <strong>monthly income</strong> using
        the selected hours/week, then compares it to the same <strong>basic cost-of-living</strong> benchmark you saw in View 2. The main metric
        is the <strong>Income Gap</strong>: monthly income minus monthly cost. The hours slider matters because it shows how quickly the gap
        changes as weekly hours change. When the gap is negative, it means a minimum-wage worker would need more hours, additional
        household income, or lower expenses to cover even this basic bundle.
      </p>
    </section>
  );
}

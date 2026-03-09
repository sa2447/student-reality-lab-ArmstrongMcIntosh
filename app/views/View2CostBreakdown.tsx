"use client";

import { useMemo } from 'react';

import type { RawDataset, RawRow } from '../../src/lib/schema';
import { formatUsd, regionLabel } from '../../src/lib/present';
import { makeRegionKey } from '../../src/lib/regionKey';

import { IconCar, IconFood, IconHouse } from '../ui/icons';
import { COLORS, STYLES } from '../ui/theme';
import { AnnotationCard } from './AnnotationCard';
import { ViewTitle } from './ViewTitle';

type Annotation = {
  title: string;
  body: string;
  key: string;
};

export function View2CostBreakdown({
  raw,
  selectedRegionKey,
  selectedRawRow,
  costAnnotation
}: {
  raw: RawDataset;
  selectedRegionKey: string;
  selectedRawRow: RawRow | null;
  costAnnotation: Annotation | null;
}) {
  const costMax = useMemo(() => {
    const totals = raw.rows.map(
      (r) => r.costs.housing_monthly_1br_fmr + r.costs.food_monthly_tfp_1_adult + r.costs.car_operating_monthly
    );
    const maxValue = Math.max(...totals);
    const step = 500;
    return Math.max(step, Math.ceil(maxValue / step) * step);
  }, [raw]);

  const costTicks = useMemo(() => {
    const step = 500;
    const out: number[] = [];
    for (let v = 0; v <= costMax; v += step) out.push(v);
    return out;
  }, [costMax]);

  return (
    <section aria-label="View 2: Cost breakdown" style={{ marginTop: 16 }}>
      <ViewTitle view="View 2" title="Cost of living breakdown (USD/month)" />

      <div style={{ fontSize: 12, color: COLORS.mutedInk, marginBottom: 8 }}>
        Components: housing (HUD FMR) + food (USDA TFP) + car operating proxy (BLS CEX)
      </div>

      {selectedRawRow ? (
        <div style={{ fontSize: 12, color: COLORS.mutedInk, marginBottom: 8 }}>
          Focused region costs: housing {formatUsd(selectedRawRow.costs.housing_monthly_1br_fmr)} · food{' '}
          {formatUsd(selectedRawRow.costs.food_monthly_tfp_1_adult)} · car op {formatUsd(selectedRawRow.costs.car_operating_monthly)} ·
          total{' '}
          {formatUsd(
            selectedRawRow.costs.housing_monthly_1br_fmr +
              selectedRawRow.costs.food_monthly_tfp_1_adult +
              selectedRawRow.costs.car_operating_monthly
          )}
        </div>
      ) : null}

      <div style={STYLES.card}>
        <svg
          width={900}
          height={360}
          viewBox="0 0 900 360"
          role="img"
          aria-label="Grouped vertical bar chart of cost components by region"
        >
          <title>Monthly cost of living components by region (grouped bars)</title>
          <rect x={0} y={0} width={900} height={360} fill={COLORS.white} />

          {(() => {
            const chartLeft = 70;
            const chartRight = 20;
            const chartTop = 30;
            const chartBottom = 70;
            const chartW = 900 - chartLeft - chartRight;
            const chartH = 360 - chartTop - chartBottom;
            const n = raw.rows.length;
            const groupW = chartW / Math.max(1, n);

            const barW = 18;
            const barGap = 8;
            const groupBarsW = barW * 3 + barGap * 2;

            const yFor = (value: number) => chartTop + chartH - (value / costMax) * chartH;
            const hFor = (value: number) => (value / costMax) * chartH;

            return (
              <g>
                {costTicks.map((t) => {
                  const y = yFor(t);
                  return (
                    <g key={t}>
                      <line x1={chartLeft} y1={y} x2={900 - chartRight} y2={y} stroke={COLORS.grid} />
                      <text x={chartLeft - 10} y={y + 4} fontSize={10} textAnchor="end" fill={COLORS.mutedInk}>
                        {t === 0 ? '0' : `$${(t / 1000).toFixed(1)}k`}
                      </text>
                    </g>
                  );
                })}

                <text x={500} y={18} fontSize={12} textAnchor="middle" fill={COLORS.ink}>
                  USD per month
                </text>

                {raw.rows.map((r, idx) => {
                  const key = makeRegionKey(r.state, r.region);
                  const label = regionLabel(r.state, r.region);
                  const isSelected = key === selectedRegionKey;

                  const housing = r.costs.housing_monthly_1br_fmr;
                  const food = r.costs.food_monthly_tfp_1_adult;
                  const car = r.costs.car_operating_monthly;
                  const total = housing + food + car;

                  const groupX0 = chartLeft + idx * groupW;
                  const barsX0 = groupX0 + (groupW - groupBarsW) / 2;
                  const labelX = groupX0 + groupW / 2;

                  const housingH = hFor(housing);
                  const foodH = hFor(food);
                  const carH = hFor(car);

                  const housingY = chartTop + chartH - housingH;
                  const foodY = chartTop + chartH - foodH;
                  const carY = chartTop + chartH - carH;

                  return (
                    <g key={key}>
                      {isSelected ? (
                        <g>
                          <rect
                            x={groupX0 + 6}
                            y={chartTop}
                            width={groupW - 12}
                            height={chartH + chartBottom - 10}
                            fill={COLORS.cardBg}
                            stroke={COLORS.border}
                          />
                          <rect
                            x={groupX0 + 6}
                            y={chartTop}
                            width={6}
                            height={chartH + chartBottom - 10}
                            fill={COLORS.income}
                          />
                        </g>
                      ) : null}

                      <rect x={barsX0} y={housingY} width={barW} height={housingH} fill={COLORS.housing} />
                      <rect x={barsX0 + barW + barGap} y={foodY} width={barW} height={foodH} fill={COLORS.income} />
                      <rect x={barsX0 + (barW + barGap) * 2} y={carY} width={barW} height={carH} fill={COLORS.ink} />

                      <text x={labelX} y={Math.max(26, yFor(total) - 6)} fontSize={10} textAnchor="middle" fill={COLORS.ink}>
                        {formatUsd(total)}
                      </text>

                      <text x={labelX} y={chartTop + chartH + 26} fontSize={11} textAnchor="middle" fill={COLORS.ink}>
                        {label}
                      </text>
                    </g>
                  );
                })}
              </g>
            );
          })()}
        </svg>

        <div style={{ display: 'flex', gap: 18, marginTop: 10, fontSize: 12, color: COLORS.mutedInk, flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <IconHouse />
            <span>Housing</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <IconFood />
            <span>Food</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <IconCar />
            <span>Car operating proxy</span>
          </div>
        </div>
      </div>

      {costAnnotation ? <AnnotationCard annotation={costAnnotation} /> : null}

      <h3 style={{ margin: '16px 0 8px' }}>What to notice</h3>
      <p style={{ lineHeight: 1.5, color: '#222' }}>
        This benchmark is intentionally a basic bundle so we can keep the methodology reproducible across regions. Housing uses HUD’s FY2025
        Fair Market Rent for a 1-bedroom (population-weighted), which is a useful baseline for a single adult but not a guarantee of what
        any one person pays. Food uses the USDA Thrifty Food Plan (January 2025), which is designed as a minimal-cost nutritious diet. Car
        operating costs are included as a proxy derived from BLS Consumer Expenditure Survey tables using 2024 annual means as a proxy for
        2025 (divided by 12). The point of this view is to show what is driving the cost benchmark before we compare it to income.
      </p>
    </section>
  );
}

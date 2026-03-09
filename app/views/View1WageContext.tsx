"use client";

import { useMemo } from 'react';

import type { RawDataset } from '../../src/lib/schema';
import { regionLabel } from '../../src/lib/present';
import { makeRegionKey } from '../../src/lib/regionKey';

import { COLORS, STYLES } from '../ui/theme';
import { AnnotationCard } from './AnnotationCard';
import { ViewTitle } from './ViewTitle';

type Annotation = {
  title: string;
  body: string;
  key: string;
};

export function View1WageContext({
  raw,
  selectedRegionKey,
  wageAnnotation
}: {
  raw: RawDataset;
  selectedRegionKey: string;
  wageAnnotation: Annotation | null;
}) {
  const wageMax = useMemo(() => {
    const maxValue = Math.max(...raw.rows.map((r) => r.hourly_min_wage));
    const step = 1;
    return Math.max(step, Math.ceil(maxValue / step) * step);
  }, [raw]);

  const wageMin = useMemo(() => {
    const minValue = Math.min(...raw.rows.map((r) => r.hourly_min_wage));
    const step = 1;
    return Math.max(0, Math.floor(minValue / step) * step);
  }, [raw]);

  const wageTicks = useMemo(() => {
    const start = Math.floor(wageMin);
    const end = Math.ceil(wageMax);
    const out: number[] = [];
    for (let v = start; v <= end; v += 0.5) out.push(v);
    return out;
  }, [wageMin, wageMax]);

  return (
    <section aria-label="View 1: Wage context" style={{ marginTop: 16 }}>
      <ViewTitle view="View 1" title="Wage context (USD/hour)" />

      <div style={STYLES.card}>
        <svg width={900} height={290} viewBox="0 0 900 290" role="img" aria-label="Dot plot of hourly minimum wage by region">
          <title>Hourly minimum wage by region (dot plot)</title>
          <rect x={0} y={0} width={900} height={290} fill={COLORS.white} />

          {(() => {
            const xStart = 220;
            const xEnd = 860;
            const wRange = Math.max(0.01, wageMax - wageMin);

            return (
              <g>
                {wageTicks.map((t) => {
                  const x = xStart + ((t - wageMin) / wRange) * (xEnd - xStart);
                  return (
                    <g key={t}>
                      <line x1={x} y1={30} x2={x} y2={260} stroke={COLORS.grid} />
                      <text x={x} y={275} fontSize={10} textAnchor="middle" fill={COLORS.mutedInk}>
                        ${t.toFixed(2)}
                      </text>
                    </g>
                  );
                })}

                <text x={500} y={18} fontSize={12} textAnchor="middle" fill={COLORS.ink}>
                  USD per hour
                </text>

                {raw.rows.map((r, idx) => {
                  const y = 60 + idx * 52;
                  const key = makeRegionKey(r.state, r.region);
                  const label = regionLabel(r.state, r.region);
                  const isSelected = key === selectedRegionKey;
                  const x = xStart + ((r.hourly_min_wage - wageMin) / wRange) * (xEnd - xStart);
                  const labelX = 12;

                  return (
                    <g key={key}>
                      {isSelected ? (
                        <g>
                          <rect x={0} y={y - 22} width={900} height={44} fill={COLORS.cardBg} stroke={COLORS.border} />
                          <rect x={0} y={y - 22} width={6} height={44} fill={COLORS.income} />
                        </g>
                      ) : null}

                      <text x={labelX} y={y + 4} fontSize={12} fontWeight={isSelected ? 700 : 400} fill={COLORS.ink}>
                        {label}
                      </text>

                      <line x1={xStart} y1={y} x2={x} y2={y} stroke={COLORS.housing} strokeWidth={2} />
                      <circle cx={x} cy={y} r={7} fill={isSelected ? COLORS.income : COLORS.ink} />

                      <text x={890} y={y + 4} fontSize={11} fill={COLORS.ink} textAnchor="end">
                        ${r.hourly_min_wage.toFixed(2)}/hr
                      </text>
                    </g>
                  );
                })}
              </g>
            );
          })()}
        </svg>
      </div>

      {wageAnnotation ? <AnnotationCard annotation={wageAnnotation} /> : null}

      <h3 style={{ margin: '16px 0 8px' }}>What to notice</h3>
      <p style={{ lineHeight: 1.5, color: '#222' }}>
        The story starts with wages because minimum wage is usually discussed as a policy set in dollars per hour. But “higher hourly pay”
        does not automatically mean “more affordable” once we compare it to monthly expenses. New York is split into Downstate and Upstate
        because the minimum wage is legally region-specific and because the cost environment is dramatically different across the state.
        Use the Focus Region selector to highlight one region while still seeing the full comparison. The goal of this view is not to
        declare a winner on wages alone—it is to set up the next step: converting wages into monthly income and comparing that income to a
        consistent cost benchmark.
      </p>
    </section>
  );
}

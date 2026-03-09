import { COLORS } from './theme';

export function TriStateOutlineMap({ selectedRegionKey }: { selectedRegionKey: string }) {
  const selectedState = selectedRegionKey.split('|')[0] || '';
  const isNY = selectedState === 'NY';
  const isNJ = selectedState === 'NJ';
  const isCT = selectedState === 'CT';

  return (
    <svg width={210} height={120} viewBox="0 0 210 120" role="img" aria-label="Tri-state outline map">
      <rect x={0} y={0} width={210} height={120} fill={COLORS.white} />

      <g>
        <path
          d="M10 18 L88 10 L96 50 L72 96 L18 92 Z"
          fill={isNY ? COLORS.cardBg : COLORS.white}
          stroke={COLORS.ink}
          strokeWidth={1}
        />
        <path
          d="M96 22 L200 22 L198 60 L118 62 L100 52 Z"
          fill={isCT ? COLORS.cardBg : COLORS.white}
          stroke={COLORS.ink}
          strokeWidth={1}
        />
        <path
          d="M92 56 L128 64 L186 70 L170 108 L110 112 L82 92 Z"
          fill={isNJ ? COLORS.cardBg : COLORS.white}
          stroke={COLORS.ink}
          strokeWidth={1}
        />
      </g>

      <g fontSize={12} fill={COLORS.ink} fontWeight={700}>
        <text x={38} y={62}>NY</text>
        <text x={152} y={48}>CT</text>
        <text x={128} y={98}>NJ</text>
      </g>
    </svg>
  );
}

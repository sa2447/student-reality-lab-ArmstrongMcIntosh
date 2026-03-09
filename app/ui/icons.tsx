import { COLORS } from './theme';

export function IconHouse({ size = 16, title = 'Housing' }: { size?: number; title?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" role="img" aria-label={title}>
      <path
        d="M3 11.5 12 4l9 7.5V21a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1v-9.5Z"
        fill={COLORS.housing}
      />
      <path d="M10 22v-6h4v6" fill={COLORS.white} opacity={0.6} />
    </svg>
  );
}

export function IconFood({ size = 16, title = 'Food' }: { size?: number; title?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" role="img" aria-label={title}>
      <path d="M4 3h16v6a8 8 0 0 1-16 0V3Z" fill={COLORS.income} />
      <path d="M7 21c0-4 10-4 10 0" fill={COLORS.ink} opacity={0.25} />
      <path d="M8 6h8v2H8z" fill={COLORS.white} opacity={0.5} />
    </svg>
  );
}

export function IconCar({ size = 16, title = 'Car operating' }: { size?: number; title?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" role="img" aria-label={title}>
      <path
        d="M6.5 7h11l1.6 5.3c.3 1-0.4 2-1.5 2H6.4c-1.1 0-1.8-1-1.5-2L6.5 7Z"
        fill={COLORS.ink}
      />
      <path d="M7 14v4" stroke={COLORS.ink} strokeWidth={2} />
      <path d="M17 14v4" stroke={COLORS.ink} strokeWidth={2} />
      <circle cx={8} cy={15.5} r={1.5} fill={COLORS.white} opacity={0.7} />
      <circle cx={16} cy={15.5} r={1.5} fill={COLORS.white} opacity={0.7} />
    </svg>
  );
}

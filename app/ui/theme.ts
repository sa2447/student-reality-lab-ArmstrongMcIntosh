export const COLORS = {
  income: '#2e7d32',
  housing: '#6b7280',
  ink: '#111',
  mutedInk: '#444',
  border: '#ddd',
  grid: '#eee',
  cardBg: '#f7f7f7',
  white: 'white'
} as const;

export const STYLES = {
  page: {
    minHeight: '100vh',
    background: COLORS.cardBg
  } as const,
  pageInner: {
    maxWidth: 980,
    margin: '0 auto',
    padding: '18px 16px 24px'
  } as const,
  headerCard: {
    padding: 14,
    border: `1px solid ${COLORS.border}`,
    borderRadius: 10,
    background: COLORS.white
  } as const,
  card: {
    padding: 12,
    border: `1px solid ${COLORS.border}`,
    borderRadius: 8,
    background: COLORS.white
  } as const,
  panel: {
    marginTop: 16,
    padding: 12,
    border: `1px solid ${COLORS.border}`,
    borderRadius: 8,
    background: COLORS.white
  } as const,
  sectionDivider: {
    margin: '18px 0',
    border: 0,
    borderTop: `1px solid ${COLORS.border}`
  } as const,
  viewTitleRow: {
    display: 'flex',
    alignItems: 'baseline',
    justifyContent: 'space-between',
    gap: 12,
    flexWrap: 'wrap'
  } as const,
  viewKicker: {
    fontSize: 12,
    color: COLORS.mutedInk,
    letterSpacing: 0.2
  } as const,
  annotation: {
    marginTop: 12,
    padding: 12,
    borderLeft: `4px solid ${COLORS.ink}`,
    background: COLORS.cardBg,
    borderRadius: 8
  } as const
};

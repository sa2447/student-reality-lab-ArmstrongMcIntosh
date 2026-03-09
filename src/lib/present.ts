export function formatUsd(value: number): string {
  const sign = value < 0 ? '-' : '';
  const abs = Math.abs(value);
  return `${sign}$${abs.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

export function regionLabel(state: string, region: string): string {
  return state === 'NY' ? `NY ${region}` : state;
}

import type { StateCode } from './schema';

export type RegionKey = string;

export function makeRegionKey(state: StateCode, region: string): RegionKey {
  return `${state}|${region}`;
}

export function parseRegionKey(key: RegionKey): { state: string; region: string } {
  const idx = key.indexOf('|');
  if (idx < 0) return { state: key, region: '' };
  return { state: key.slice(0, idx), region: key.slice(idx + 1) };
}

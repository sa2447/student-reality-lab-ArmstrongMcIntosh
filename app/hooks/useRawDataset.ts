"use client";

import { useEffect, useState } from 'react';

import type { RawDataset } from '../../src/lib/schema';

export function useRawDataset() {
  const [raw, setRaw] = useState<RawDataset | null>(null);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const abort = new AbortController();

    async function load() {
      try {
        const res = await fetch('/api/raw', { cache: 'no-store', signal: abort.signal });
        if (!res.ok) throw new Error(`Failed to load raw dataset (${res.status})`);
        const json = (await res.json()) as RawDataset;
        setRaw(json);
      } catch (e) {
        if (abort.signal.aborted) return;
        setError((e as any)?.message || String(e));
      }
    }

    void load();
    return () => abort.abort();
  }, []);

  return {
    raw,
    error,
    loading: !raw && !error
  };
}

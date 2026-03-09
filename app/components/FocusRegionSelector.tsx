"use client";

import { COLORS, STYLES } from '../ui/theme';

export type FocusRegionOption = {
  key: string;
  label: string;
};

export function FocusRegionSelector({
  value,
  options,
  disabled,
  onChange
}: {
  value: string;
  options: FocusRegionOption[];
  disabled: boolean;
  onChange: (nextKey: string) => void;
}) {
  return (
    <section aria-label="Focus region" style={STYLES.panel}>
      <label>
        <strong>Focus region:</strong>
        <div>
          <select
            value={value}
            onChange={(e) => onChange(e.target.value)}
            disabled={disabled}
            style={{ marginTop: 6, padding: 6, minWidth: 260 }}
          >
            {options.map((r) => (
              <option key={r.key} value={r.key}>
                {r.label}
              </option>
            ))}
          </select>
        </div>
      </label>

      <div style={{ marginTop: 8, fontSize: 12, color: COLORS.mutedInk }}>Highlights the selected region across all views.</div>
    </section>
  );
}

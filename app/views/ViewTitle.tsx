"use client";

import { COLORS, STYLES } from '../ui/theme';

export function ViewTitle({ view, title }: { view: string; title: string }) {
  return (
    <div style={STYLES.viewTitleRow}>
      <div>
        <div style={STYLES.viewKicker}>{view}</div>
        <h2 style={{ margin: '4px 0 8px', color: COLORS.ink }}>{title}</h2>
      </div>
    </div>
  );
}

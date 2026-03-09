"use client";

import { COLORS, STYLES } from '../ui/theme';

export function HoursAndUnitsPanel({
  hoursPerWeek,
  onHoursChange
}: {
  hoursPerWeek: number;
  onHoursChange: (next: number) => void;
}) {
  return (
    <section aria-label="Interactions" style={STYLES.panel}>
      <div style={{ display: 'flex', gap: 20, alignItems: 'flex-end', flexWrap: 'wrap' }}>
        <label style={{ minWidth: 260 }}>
          <strong>Hours per week:</strong> {hoursPerWeek}
          <input
            type="range"
            min={20}
            max={60}
            step={1}
            value={hoursPerWeek}
            onChange={(e) => onHoursChange(Number(e.target.value))}
            style={{ width: '100%', marginTop: 8 }}
          />
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: COLORS.mutedInk }}>
            <span>20</span>
            <span>40</span>
            <span>60</span>
          </div>
        </label>

        <div style={{ fontSize: 12, color: COLORS.mutedInk, maxWidth: 360 }}>
          <div>
            <strong>Units:</strong> wages in USD/hour; costs and income in USD/month
          </div>
          <div>
            <strong>Income formula:</strong> hourly min wage × hours/week × 4.33
          </div>
        </div>
      </div>
    </section>
  );
}

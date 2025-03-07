"use client"

import { INTERVALS, INTERVALS_PER_HOUR, NUM_TIMESLOTS } from "./timetable";

export default function Axis() {
  return (
    <div className="flex h-6 w-fit justify-between text-slate-400">
      {INTERVALS.map((label) => {
        let displayLabel: number|null = null;

        if (label % INTERVALS_PER_HOUR === 0) {
          if (label > NUM_TIMESLOTS)  label = label - NUM_TIMESLOTS;
          const hour = label / INTERVALS_PER_HOUR;
          displayLabel = hour > 12 ? hour - 12 : hour;
        }

        return (
          <div
            key={`axis-${label}`}
            className={`w-4 h-full flex items-end transform ${
              displayLabel && displayLabel >= 10 ? "translate-x-[-8px]" : "translate-x-[-5px]"
            }`}
          >
            {displayLabel}
          </div>
        );
      })}
    </div>
  );
}

"use client"

import { INTERVALS, INTERVALS_PER_HOUR, NUM_TIMESLOTS } from "./timetable";

export default function Axis() {
  return (
    <div className="flex h-10 w-fit justify-between">
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
            className={`w-4 h-10 flex items-end transform ${
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

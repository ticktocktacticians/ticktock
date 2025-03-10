"use client";

import { Moon, Sun } from "lucide-react";
import { INTERVALS, INTERVALS_PER_HOUR, NUM_TIMESLOTS } from "./timetable";
import { cn } from "../../lib/utils";

export default function Axis() {
  return (
    <div className="flex h-10 w-fit justify-between text-slate-400 no-select">
      {INTERVALS.map((label) => {
        let displayLabel: number | null = null;
        if (label > NUM_TIMESLOTS) label = label - NUM_TIMESLOTS;
        const hour = label / INTERVALS_PER_HOUR;

        if (label % INTERVALS_PER_HOUR === 0) {
          displayLabel = hour > 12 ? hour - 12 : hour;
        }

        return (
          <div
            key={`axis-${label}`}
            className={cn([
              "w-4 h-full flex flex-col justify-end transform",
              displayLabel && displayLabel >= 10
                ? "translate-x-[-8px]"
                : "translate-x-[-5px]",
              displayLabel === 12 && "font-semibold"
            ])}
          >
            {hour === 12 && <Sun width="16px" />}
            {hour === 24 && <Moon width="16px" />}

            <span className="h-6">{displayLabel}</span>
          </div>
        );
      })}
    </div>
  );
}

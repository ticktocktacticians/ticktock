"use client"

import { type Dayjs } from "dayjs";

const DATE_FORMAT = "ddd, D MMM YY";

export default function DaysColumn({ days }: { days: Dayjs[] }) {
  return (
    <div className="flex flex-col">
      <div className="box-border w-36 h-6 p-2 text-right" />
      <div className="box-border">
        {days.map((day, index) => {
          const border =
            index === 0
              ? "border-t"
              : index === days.length - 1
              ? "border-b"
              : "";
          return (
            <div
              key={`day-${day}`}
              className={`w-36 h-10 p-2 text-right border-r border-l border-b border-slate-900 ${border}`}
            >
              {day.format(DATE_FORMAT)}
            </div>
          );
        })}
      </div>
    </div>
  );
}

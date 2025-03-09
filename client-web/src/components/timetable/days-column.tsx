"use client";

import { cn } from "@/lib/utils";
import { type Dayjs } from "dayjs";
import { useContext } from "react";
import { TimetableContext } from "./timetable-context";

const DATE_FORMAT = "ddd, DD MMM YY";

export default function DaysColumn({ days }: { days: Dayjs[] }) {
  const { page } = useContext(TimetableContext);

  const daysToShow = days.slice((page - 1) * 5, page * 5);

  return (
    <div className="flex flex-col">
      <div className="box-border w-[138px] h-6 p-2 text-right" />
      <div className="box-border">
        {daysToShow.map((day, index) => (
          <div
            key={`day-${day}`}
            className={cn([
              `flex justify-end items-center w-[138px] h-11 p-2 text-right
                border-r border-l border-b border-slate-900`,
              index === 0 && "border-t",
            ])}
          >
            {day.format(DATE_FORMAT)}
          </div>
        ))}
      </div>
    </div>
  );
}

"use client";

import { cn } from "@/lib/utils";
import { type Dayjs } from "dayjs";
import { useContext } from "react";
import { TimetableContext } from "./timetable-context";
import { CreateMeetingContext } from "../../app/meeting/create/context";

const DATE_FORMAT = "ddd, DD MMM YY";

export default function DaysColumn({ days }: { days: Dayjs[] }) {
  const { page } = useContext(TimetableContext);
  const { errors } = useContext(CreateMeetingContext);

  const daysToShow = days.slice((page - 1) * 5, page * 5);

  return (
    <div className="flex flex-col">
      <div className="box-border w-[138px] h-10 p-2 text-right" />
      <div className="box-border">
        {daysToShow.map((day, index) => (
          <div
            key={`day-${day}`}
            className={cn([
              `flex justify-end items-center w-[138px] h-11 p-2 text-right
                border-r border-l border-b border-slate-900`,
              index === 0 && "border-t",
              index === 0 && errors.timeslots && "border-t-red-700",
              errors.timeslots && "border-l-red-700",
            ])}
          >
            {day.format(DATE_FORMAT)}
          </div>
        ))}
      </div>
    </div>
  );
}

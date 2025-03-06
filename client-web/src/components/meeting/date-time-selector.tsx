"use client";

import Timetable from "@/components/timetable/timetable";
import DateRangeInput from "@/components/meeting/date-range-input";
import { useEffect, useState } from "react";
import dayjs from "dayjs";

export default function DateTimeSelector({ name }: { name: string }) {
  const now = new Date();

  const [startDate, setStartDate] = useState<Date>(now);
  const [endDate, setEndDate] = useState<Date>(
    dayjs(startDate).add(7, "day").toDate()
  );
  // array of Date ISOStrings
  const [timeslots, setTimeslots] = useState<string[]>([]);

  useEffect(() => {
    startDate > endDate && setEndDate(startDate);
  }, [startDate]);

  return (
    <>
      <DateRangeInput
        startDate={startDate}
        endDate={endDate}
        setStartDate={(date?: Date) => setStartDate(date || now)}
        setEndDate={(date?: Date) =>
          setEndDate(date || dayjs(startDate).add(7, "day").toDate())
        }
      />
      <span>Timeslots to offer</span>
      <input
        type="hidden"
        name="startDateRange"
        value={startDate?.toISOString()}
      />
      <input type="hidden" name="endDateRange" value={endDate?.toISOString()} />
      <input type="hidden" name={name} value={JSON.stringify(timeslots)} />
      <Timetable
        dateRange={{ start: startDate, end: endDate }}
        setTimeslots={setTimeslots}
      />
    </>
  );
}

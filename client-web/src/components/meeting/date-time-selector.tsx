"use client";

import Timetable from "@/components/timetable/timetable";
import DateRangeInput from "@/components/meeting/date-range-input";
import { useContext, useEffect, useState } from "react";
import dayjs from "dayjs";
import { CreateMeetingContext } from "@/app/meeting/create/context";

export default function DateTimeSelector({ name }: { name: string; }) {
  const now = new Date();
  const { formData, setFormData } = useContext(CreateMeetingContext);

  const [startDate, setStartDate] = useState<Date>(now);
  const [endDate, setEndDate] = useState<Date>(
    dayjs(startDate).add(7, "day").toDate()
  );
  // array of Date ISOStrings
  const [timeslots, setTimeslots] = useState<string[]>([]);

  useEffect(() => {
    startDate > endDate && setEndDate(startDate);
  }, [startDate]);

  useEffect(() => {
    setFormData({ ...formData, startDate, endDate });
  }, [startDate, endDate])

  useEffect(() => {
    setFormData({ ...formData, timeslots });
  }, [timeslots.length])

  return (
    <div className="text-gray-900">
      <DateRangeInput
        startDate={startDate}
        endDate={endDate}
        setStartDate={(date?: Date) => setStartDate(date || now)}
        setEndDate={(date?: Date) =>
          setEndDate(date || dayjs(startDate).add(7, "day").toDate())
        }
      />
      <span>Timeslots to offer</span>
      <Timetable
        dateRange={{ start: startDate, end: endDate }}
        setTimeslots={setTimeslots}
      />
      <input
        type="hidden"
        name="startDateRange"
        value={startDate?.toISOString()}
      />
      <input type="hidden" name="endDateRange" value={endDate?.toISOString()} />
      <input type="hidden" name={name} value={JSON.stringify(timeslots)} />
    </div>
  );
}

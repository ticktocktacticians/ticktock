"use client"

import Timetable from "@/components/timetable/timetable";
import DateRangeInput from "@/components/meeting/date-range-input";
import { useState } from "react";

export default function DateTimeSelector() {
  const [startDate, setStartDate] = useState<Date | undefined>();
  const [endDate, setEndDate] = useState<Date | undefined>();

  return (
    <>
      <DateRangeInput
        startDate={startDate}
        endDate={endDate}
        setStartDate={setStartDate}
        setEndDate={setEndDate}
      />
      <span>Timeslots to offer</span>
      <Timetable dateRange={{ start: startDate, end: endDate }} />
    </>
  );
}

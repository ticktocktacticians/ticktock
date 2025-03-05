"use client"

import { Dispatch, SetStateAction } from "react";
import DatePicker from "./date-picker";

interface DateRangeInputProps {
  startDate?: Date
  setStartDate: (date: Date|undefined) => void
  endDate?: Date
  setEndDate: (date: Date|undefined) => void
}

export default function DateRangeInput({
  startDate,
  endDate,
  setStartDate,
  setEndDate,
}: DateRangeInputProps) {
  const currentDate = new Date();
  currentDate.setHours(0, 0, 0, 0);
  const disabledStartDates = (date: Date|undefined) => !!(date && date < currentDate);
  const disabledEndDates = (date: Date|undefined) => !!(date && startDate && date < startDate);

  return (
    <div>
      <h2>Set dates and times to select from</h2>
      <p>
        Between <DatePicker date={startDate} setDate={setStartDate} disabled={disabledStartDates} /> and{" "}
        <DatePicker date={endDate} setDate={setEndDate} disabled={disabledEndDates} />
      </p>
    </div>
  );
}

"use client";

import { Dispatch, SetStateAction, useContext } from "react";
import DatePicker from "./date-picker";
import { CreateMeetingContext } from "@/app/meeting/create/context";

interface DateRangeInputProps {
  startDate?: Date;
  setStartDate: (date: Date | undefined) => void;
  endDate?: Date;
  setEndDate: (date: Date | undefined) => void;
}

export default function DateRangeInput({
  startDate,
  endDate,
  setStartDate,
  setEndDate,
}: DateRangeInputProps) {
  const currentDate = new Date();
  currentDate.setHours(0, 0, 0, 0);
  const disabledStartDates = (date: Date | undefined) =>
    !!(date && date < currentDate);
  const disabledEndDates = (date: Date | undefined) =>
    !!(date && startDate && date < startDate);

  const { reviewing } = useContext(CreateMeetingContext);

  return (
    <div>
      <h2 className="text-xl text-indigo-600 font-semibold mb-[10px]">
        {reviewing
          ? "Dates and times offered"
          : "Set dates and times to select from"}
      </h2>
      <p className="mb-6">
        Between{" "}
        <DatePicker
          date={startDate}
          setDate={setStartDate}
          disabled={reviewing}
          disabledDates={disabledStartDates}
        />{" "}
        and{" "}
        <DatePicker
          date={endDate}
          setDate={setEndDate}
          disabled={reviewing}
          disabledDates={disabledEndDates}
        />
      </p>
    </div>
  );
}

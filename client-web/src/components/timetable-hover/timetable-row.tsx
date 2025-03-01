"use client";

import { useContext } from "react";
import { TimetableContext } from "./timetable-context";
import { NUM_TIMESLOTS } from "./timetable";

interface TimeTableRowProps {
  day: string;
}

export default function TimetableRow({ day }: TimeTableRowProps) {
  const { selected, setHoveredTimeslot } = useContext(TimetableContext);

  const timeslots = [];
  for (let i = 0; i < NUM_TIMESLOTS; i++) {
    const onMouseEnter = () =>
      setHoveredTimeslot({
        day,
        index: i,
      });
    timeslots.push(
      <TimeSlot
        isSelected={!!selected[day]?.has(i)}
        key={`${day}-${i}`}
        onMouseEnter={onMouseEnter}
      />
    );
  }
  return <div className="flex">{...timeslots}</div>;
}

function TimeSlot({
  isSelected,
  onMouseEnter,
}: {
  isSelected: boolean;
  onMouseEnter: () => void;
}) {
  return (
    <div
      onMouseEnter={onMouseEnter}
      className={`border border-gray-400 w-4 h-10 flex-shrink-0 ${
        isSelected ? "bg-blue-400" : ""
      }`}
    ></div>
  );
}

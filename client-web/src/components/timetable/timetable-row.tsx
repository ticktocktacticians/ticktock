"use client";

import { useContext } from "react";
import { TimetableContext } from "./timetable-context";
import { NUM_TIMESLOTS } from "./timetable";
import { IsWithin } from "../../utils/number";
import { cn } from "../../lib/utils";
import { CreateMeetingContext } from "../../app/meeting/create/context";

interface TimeTableRowProps {
  dayIndex: number;
}

export default function TimetableRow({ dayIndex }: TimeTableRowProps) {
  const {
    selected,
    isSelecting,
    hoveredTimeslot,
    setHoveredTimeslot,
    startTimeslot,
  } = useContext(TimetableContext);

  const timeslots = [];
  for (let timeIndex = 0; timeIndex < NUM_TIMESLOTS; timeIndex++) {
    let isSelected: boolean = !!selected[dayIndex]?.has(timeIndex);

    /** `true` select, `false` deselect, `null` if ignore */
    if (isSelecting !== null && hoveredTimeslot && startTimeslot) {
      const { dayIndex: startDay, timeIndex: startTime } = startTimeslot;
      const { dayIndex: currentDay, timeIndex: currentTime } = hoveredTimeslot;

      const isWithin =
        IsWithin(dayIndex, startDay, currentDay) &&
        IsWithin(timeIndex, startTime, currentTime);
      isWithin && (isSelected = isSelecting);
    }

    const onMouseEnter = () =>
      setHoveredTimeslot({
        dayIndex,
        timeIndex,
      });
    timeslots.push(
      <TimeSlot
        isSelected={isSelected}
        key={`timeslot-${dayIndex}-${timeIndex}`}
        onMouseEnter={onMouseEnter}
        index={dayIndex}
      />
    );
  }
  return (
    <div
      className={cn([
        "relative flex h-11"
      ])}
    >
      {...timeslots}
    </div>
  );
}

function TimeSlot({
  isSelected,
  onMouseEnter,
  index,
}: {
  isSelected: boolean;
  onMouseEnter: () => void;
  index: number;
}) {
  const { reviewing } = useContext(CreateMeetingContext);
  return (
    <div
      onMouseEnter={onMouseEnter}
      className={cn([
        "border-x-[0.5px] border-x-slate-200 w-4 h-11 flex-shrink-0",
        isSelected && "bg-blue-400",
        "border-b border-y-slate-900",
        index === 0 && "border-t",
        reviewing && isSelected && 'bg-zinc-400',
      ])}
    ></div>
  );
}

"use client";

import { useContext } from "react";
import { TimetableContext } from "./timetable-context";
import { NUM_TIMESLOTS } from "./timetable";
import { IsWithin } from "../../utils/number";
import { cn } from "../../lib/utils";
import { CreateMeetingContext } from "../../app/meeting/create/context";
import { PAGE_SIZE } from "./timetable-paginator";

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

    page,
  } = useContext(TimetableContext);

  const timeslots = [];
  const pageOffset = (page - 1) * PAGE_SIZE;

  for (let timeIndex = 0; timeIndex < NUM_TIMESLOTS; timeIndex++) {
    let isSelected: boolean = !!selected[dayIndex + pageOffset]?.has(timeIndex);

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
  return <div className={cn(["relative flex h-11"])}>{...timeslots}</div>;
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
  const { reviewing, errors } = useContext(CreateMeetingContext);
  return (
    <div
      onMouseEnter={onMouseEnter}
      onPointerEnter={onMouseEnter}
      className={cn([
        "border-x-[0.5px] border-x-slate-200 w-4 h-11 flex-shrink-0",
        isSelected && "bg-blue-400",
        "border-b border-y-slate-900",
        index === 0 && "border-t",
        index === 0 && errors.timeslots && "border-t-red-700",
        reviewing && isSelected && "bg-zinc-400",
      ])}
    ></div>
  );
}

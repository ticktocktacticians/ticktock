"use client";

import { useContext, useEffect } from "react";
import TimetableRow from "./timetable-row";
import { TimeslotData, TimetableContext } from "./timetable-context";

interface TimeslotsSelectorProps {
  days: string[];
}

export default function TimeslotsSelector({ days }: TimeslotsSelectorProps) {
  const {
    selected,
    setSelected,
    isSelecting,
    setIsSelecting,
    hoveredTimeslot,
    setHoveredTimeslot,
  } = useContext(TimetableContext);

  const isTimeslotSelected = (timeslot: TimeslotData | null) => {
    return !!(timeslot && selected[timeslot.day]?.has(timeslot.index));
  };

  /** @todo explore startpoint-endpoint dragging instead */
  useEffect(() => {
    if (!hoveredTimeslot || isSelecting === null) return;
    const { day, index } = hoveredTimeslot;

    if (isSelecting) {
      selected[day]
        ? selected[day].add(index)
        : (selected[day] = new Set([index]));
    } else {
      selected[day] && selected[day].delete(index);
    }

    setSelected(selected);
  }, [hoveredTimeslot, isSelecting]);

  return (
    <div
      className=""
      // if timeslot is already selected, then you are DESELECTING it (and vice versa)
      onMouseDown={() => setIsSelecting(!isTimeslotSelected(hoveredTimeslot))}
      onMouseUp={() => setIsSelecting(null)}
      onMouseLeave={() => setHoveredTimeslot(null)}
    >
      {days.map((day) => (
        <TimetableRow key={`time-table-row-${day}`} day={day} />
      ))}
    </div>
  );
}

"use client";

import { useContext } from "react";
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

    startTimeslot,
    setStartTimeslot,
    hoveredTimeslot,
    setHoveredTimeslot,
  } = useContext(TimetableContext);

  const isTimeslotSelected = (timeslot: TimeslotData | null) =>
    !!(timeslot && selected[timeslot.dayIndex]?.has(timeslot.timeIndex));
  const addCurrentSelection = () => {
    if (!hoveredTimeslot || !startTimeslot || isSelecting === null) return;

    const { dayIndex: startDay, timeIndex: startTime } = startTimeslot;
    const { dayIndex: currentDay, timeIndex: currentTime } = hoveredTimeslot;

    const minDay = Math.min(currentDay, startDay);
    const maxDay = Math.max(currentDay, startDay);

    if (isSelecting) {
      for (let i = minDay; i <= maxDay; i++) {
        for (let k = startTime; k <= currentTime; k++) {
          selected[i] ? selected[i]?.add(k) : (selected[i] = new Set([k]));
        }
      }
    } else {
      for (let i = minDay; i <= maxDay; i++) {
        for (let k = startTime; k <= currentTime; k++) {
          selected[i] && selected[i]?.delete(k);
        }
      }
    }

    setSelected(selected);
  };

  return (
    <div
      // if timeslot is already selected, then you are DESELECTING it (and vice versa)
      onMouseDown={() => {
        setIsSelecting(!isTimeslotSelected(hoveredTimeslot));
        setStartTimeslot(hoveredTimeslot);
      }}
      onMouseUp={() => {
        addCurrentSelection();
        setIsSelecting(null);
        setStartTimeslot(null);
        setHoveredTimeslot(null);
      }}
    >
      {days.map((_, dayIndex) => (
        <TimetableRow key={`time-table-row-${dayIndex}`} dayIndex={dayIndex} />
      ))}
    </div>
  );
}

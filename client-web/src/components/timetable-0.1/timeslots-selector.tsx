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

    startTimeslot,
    setStartTimeslot,
    hoveredTimeslot,
    setHoveredTimeslot,
  } = useContext(TimetableContext);

  const isTimeslotSelected = (timeslot: TimeslotData | null) => {
    return !!(timeslot && selected[timeslot.dayIndex]?.has(timeslot.timeIndex));
  };

  useEffect(() => {
    if (!hoveredTimeslot || !startTimeslot || isSelecting === null) return;

    const { dayIndex: startDay, timeIndex: startTime } = startTimeslot;
    const { dayIndex: currentDay, timeIndex: currentTime } = hoveredTimeslot;

    let i, j;
    if (currentDay < startDay) {
      i = currentDay;
      j = startDay;
    } else {
      i = startDay;
      j = currentDay;
    }

    if (isSelecting) {
      for (; i <= j; i++) {
        for (let k = startTime; k <= currentTime; k++) {
          selected[i] ? selected[i]?.add(k) : (selected[i] = new Set([k]));
        }
      }
    } else {
      for (; i <= j; i++) {
        for (let k = startTime; k <= currentTime; k++) {
          selected[i] && selected[i]?.delete(k);
        }
      }
    }

    setSelected(selected);
  }, [hoveredTimeslot, isSelecting]);

  const addCurrentSelection = () => {

  };

  return (
    <div
      className=""
      // if timeslot is already selected, then you are DESELECTING it (and vice versa)
      onMouseDown={() => {
        setIsSelecting(!isTimeslotSelected(hoveredTimeslot));
        setStartTimeslot(hoveredTimeslot);
      }}
      onMouseUp={() => {
        setIsSelecting(null);
        setStartTimeslot(null);
      }}
      onMouseLeave={() => setHoveredTimeslot(null)}
    >
      {days.map((_, dayIndex) => (
        <TimetableRow key={`time-table-row-${dayIndex}`} dayIndex={dayIndex} />
      ))}
    </div>
  );
}

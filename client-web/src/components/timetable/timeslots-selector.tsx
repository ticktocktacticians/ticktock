"use client";

import { useContext, useEffect, useState } from "react";
import TimetableRow from "./timetable-row";
import {
  SelectedTimeslots,
  TimeslotData,
  TimetableContext,
} from "./timetable-context";
import { type Dayjs } from "dayjs";
import { INTERVALS_PER_HOUR } from "./timetable";

interface TimeslotsSelectorProps {
  days: Dayjs[];
  setTimeslots: (dates: string[]) => void;
}

export default function TimeslotsSelector({
  days,
  setTimeslots,
}: TimeslotsSelectorProps) {
  const {
    selected,
    setSelected,
    isSelecting,
    setIsSelecting,

    startTimeslot,
    setStartTimeslot,
    hoveredTimeslot,
    setHoveredTimeslot,

    page,
  } = useContext(TimetableContext);

  const isTimeslotSelected = (timeslot: TimeslotData | null) =>
    !!(timeslot && selected[timeslot.dayIndex]?.has(timeslot.timeIndex));
  const updateProcessedTimeslots = (selected: SelectedTimeslots) => {
    const timeslotISOStrings = Object.keys(selected).reduce(
      (acc, dayIndexStr) => {
        const dayIndex = parseInt(dayIndexStr);
        const day = days[dayIndex];
        if (!day) return acc;
        selected[dayIndex as unknown as number]?.forEach((timeIndex) => {
          const hour = (24 * INTERVALS_PER_HOUR) / timeIndex;
          const datetime = day.hour(hour);
          acc.push(datetime.toISOString());
        });
        return acc;
      },
      [] as string[]
    );

    setTimeslots(timeslotISOStrings);
  };
  const addCurrentSelection = () => {
    if (!hoveredTimeslot || !startTimeslot || isSelecting === null) return;

    const { dayIndex: startDay, timeIndex: startTime } = startTimeslot;
    const { dayIndex: currentDay, timeIndex: currentTime } = hoveredTimeslot;

    const minDay = Math.min(currentDay, startDay);
    const maxDay = Math.max(currentDay, startDay);

    const minTime = Math.min(currentTime, startTime);
    const maxTime = Math.max(currentTime, startTime);

    if (isSelecting) {
      for (let i = minDay; i <= maxDay; i++) {
        for (let k = minTime; k <= maxTime; k++) {
          selected[i] ? selected[i]?.add(k) : (selected[i] = new Set([k]));
        }
      }
    } else {
      for (let i = minDay; i <= maxDay; i++) {
        for (let k = minTime; k <= maxTime; k++) {
          selected[i] && selected[i]?.delete(k);
        }
      }
    }

    setSelected(selected);
    updateProcessedTimeslots(selected);
  };

  const daysToShow = days.slice((page - 1) * 5, page * 5);

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
      {daysToShow.map((_, dayIndex) => {
        return (
          <TimetableRow
            key={`time-table-row-${dayIndex}`}
            dayIndex={dayIndex}
          />
        );
      })}
    </div>
  );
}

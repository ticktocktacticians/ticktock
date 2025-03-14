"use client";

import {
  createContext,
  PropsWithChildren,
  Dispatch,
  SetStateAction,
  useState,
} from "react";

export interface TimeslotData {
  dayIndex: number;
  timeIndex: number;
}

/** Record<dayIndex, timeIndex[]> */
export type SelectedTimeslots = Record<number, Set<number>>;

interface TimetableContext {
  selected: SelectedTimeslots;
  setSelected: Dispatch<SetStateAction<SelectedTimeslots>>;
  /** `true` if selecting, `false` if deselecting, `null` if no action  */
  isSelecting: boolean|null;
  setIsSelecting: Dispatch<SetStateAction<boolean|null>>;

  // used when (de)selecting
  startTimeslot: TimeslotData | null;
  setStartTimeslot: Dispatch<SetStateAction<TimeslotData | null>>;
  hoveredTimeslot: TimeslotData | null;
  setHoveredTimeslot: Dispatch<SetStateAction<TimeslotData | null>>;

  page: number;
  setPage: (page: number) => void;
}

export const TimetableContext = createContext<TimetableContext>({
  selected: {},
  setSelected: () => {},
  isSelecting: false,
  setIsSelecting: () => {},

  startTimeslot: null,
  setStartTimeslot:() => {},
  hoveredTimeslot: null,
  setHoveredTimeslot: () => {},

  page: 1,
  setPage: () => {},
});

export const TimetableProvider = ({ children }: PropsWithChildren) => {
  const [selected, setSelected] = useState<SelectedTimeslots>({});
  const [isSelecting, setIsSelecting] = useState<boolean|null>(false);

  const [startTimeslot, setStartTimeslot] = useState<TimeslotData | null>(
    null
  );
  const [hoveredTimeslot, setHoveredTimeslot] = useState<TimeslotData | null>(
    null
  );
  const [page, setPage] = useState<number>(1);

  return (
    <TimetableContext.Provider
      value={{
        selected,
        setSelected,

        isSelecting,
        setIsSelecting,

        startTimeslot,
        setStartTimeslot,
        hoveredTimeslot,
        setHoveredTimeslot,

        page,
        setPage,
      }}
    >
      {children}
    </TimetableContext.Provider>
  );
};

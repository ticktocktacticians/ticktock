"use client";

import {
  createContext,
  PropsWithChildren,
  Dispatch,
  SetStateAction,
  useState,
} from "react";

export interface TimeslotData {
  day: string;
  index: number; // timeslot index
}

/** Record<date, timeslotIndex[]> */
type SelectedTimeslots = Record<string, Set<number>>;

interface TimetableContext {
  selected: SelectedTimeslots;
  setSelected: Dispatch<SetStateAction<SelectedTimeslots>>;
  /** `true` if selecting, `false` if deselecting, `null` if no action  */
  isSelecting: boolean|null;
  setIsSelecting: Dispatch<SetStateAction<boolean|null>>;
  hoveredTimeslot: TimeslotData | null;
  setHoveredTimeslot: Dispatch<SetStateAction<TimeslotData | null>>;
}

export const TimetableContext = createContext<TimetableContext>({
  selected: {},
  setSelected: () => {},
  isSelecting: false,
  setIsSelecting: () => {},
  hoveredTimeslot: null,
  setHoveredTimeslot: () => {},
});

export const TimetableProvider = ({ children }: PropsWithChildren) => {
  const [selected, setSelected] = useState<SelectedTimeslots>({});
  const [isSelecting, setIsSelecting] = useState<boolean|null>(false);
  const [hoveredTimeslot, setHoveredTimeslot] = useState<TimeslotData | null>(
    null
  );

  return (
    <TimetableContext.Provider
      value={{
        selected,
        setSelected,

        isSelecting,
        setIsSelecting,

        hoveredTimeslot,
        setHoveredTimeslot,
      }}
    >
      {children}
    </TimetableContext.Provider>
  );
};

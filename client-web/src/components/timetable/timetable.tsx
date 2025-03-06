import dayjs, { Dayjs } from "dayjs";
import Axis from "./axis";
import DaysColumn from "./days-column";
import { TimetableProvider } from "./timetable-context";
import TimeslotsSelector from "./timeslots-selector";

/** @TODO enhancement - pagination */

export const INTERVALS_PER_HOUR = 2;
export const NUM_TIMESLOTS = INTERVALS_PER_HOUR * 24;

const START_INTERVAl = 7.5 * INTERVALS_PER_HOUR; // i.e. 7.30am

/** Represents timeslot of the day.
 * e.g. 0 represents midnight,
 * and assuming 2 intervals per hour, 15 represents 7:30am */
export const INTERVALS: number[] = [];
for (let i = START_INTERVAl; i < NUM_TIMESLOTS + START_INTERVAl; i++) INTERVALS.push(i);

interface TimeTableProps {
  dateRange: DateRange;
  setTimeslots: (timeslots: string[]) => void;
}

export interface DateRange {
  start: Date|undefined;
  end: Date|undefined;
}

export default function Timetable({ dateRange, setTimeslots }: TimeTableProps) {
  const startDate = dateRange.start ? dayjs(dateRange.start) : dayjs();
  const endDate = dateRange.end ? dayjs(dateRange.end) : startDate.add(7, "day");

  if (startDate > endDate) return <div>Invalid dateRange</div>;

  const numDays = endDate.diff(startDate, "day");

  let currentDay = startDate;
  let days: Dayjs[] = [currentDay];
  for (let i = 0; i < numDays; i++) {
    currentDay = currentDay.add(1, "day");
    days.push(currentDay);
  }

  return (
    <TimetableProvider>
      <div className="w-[600px] flex overflow-y-auto">
        <DaysColumn days={days} />
        <div className="overflow-x-auto">
          <Axis />
          <TimeslotsSelector days={days} setTimeslots={setTimeslots} />
        </div>
      </div>
    </TimetableProvider>
  );
}

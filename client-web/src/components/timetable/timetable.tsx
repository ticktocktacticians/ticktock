import dayjs from "dayjs";
import Axis from "./axis";
import DaysColumn from "./days-column";
import { TimetableProvider } from "./timetable-context";
import TimeslotsSelector from "./timeslots-selector";

/** @TODO enhancement - pagination */

const DATE_FORMAT = "ddd, D MMM YY";
const INTERVALS_PER_HOUR = 2;
export const NUM_TIMESLOTS = INTERVALS_PER_HOUR * 24;

interface TimeTableProps {
  dateRange: DateRange;
}

export interface DateRange {
  start: Date;
  end: Date;
}

export default function Timetable({ dateRange }: TimeTableProps) {
  if (dateRange.start > dateRange.end) {
    return <div>Invalid dateRange</div>;
  }

  const startDate = dayjs(dateRange.start);
  const endDate = dayjs(dateRange.end);

  const numDays = endDate.diff(startDate, "day");

  let currentDay = startDate;
  let days: string[] = [currentDay.format(DATE_FORMAT)];
  for (let i = 0; i < numDays; i++) {
    currentDay = currentDay.add(1, "day");
    days.push(currentDay.format(DATE_FORMAT));
  }

  return (
    <TimetableProvider>
      <div className="w-[500px] flex overflow-y-auto">
        <DaysColumn days={days} />
        <div className="overflow-x-auto">
          <Axis />
          <TimeslotsSelector days={days} />
        </div>
      </div>
    </TimetableProvider>
  );
}

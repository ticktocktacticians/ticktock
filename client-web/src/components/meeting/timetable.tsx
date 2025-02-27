import { type Dayjs } from "dayjs";

const DATE_FORMAT = "ddd, D MMM YY";

interface TimeTableProps {
  dateRange: DateRange;
  timeRange: TimeRange;
}

export default async function TimeTable({dateRange, timeRange}: TimeTableProps) {
  return (
    <div>
      <TimeSlots
        dateRange={dateRange}
        timeRange={timeRange}
      />
    </div>
  );
}

interface TimeSlotsProps {
  dateRange: DateRange;
  timeRange: TimeRange;
}
interface DateRange {
  start: Dayjs;
  end: Dayjs;
}

interface TimeRange {
  start: number; // min 0
  end: number; // max 24
}

async function TimeSlots({ dateRange, timeRange }: TimeSlotsProps) {
  if (dateRange.start > dateRange.end) {
    return <div>Invalid dateRange</div>;
  }

  if (
    timeRange.start > timeRange.end ||
    timeRange.start < 0 ||
    timeRange.end > 24
  ) {
    return <div>Invalid timeRange</div>;
  }

  const numDays = dateRange.end.diff(dateRange.start, "day");

  let currentDay = dateRange.start;
  let days: string[] = [currentDay.format(DATE_FORMAT)];
  for (let i = 0; i < numDays; i++) {
    currentDay = currentDay.add(1, "day");
    days.push(currentDay.format(DATE_FORMAT));
  }

  return (
    <div>
      {days.map((day) => (
        <TimeSlotsRow key={day} day={day} timeRange={timeRange} />
      ))}
    </div>
  );
}

interface TimeSlotsRowProps {
  day: string;
  timeRange: TimeRange;
}

async function TimeSlotsRow({ day, timeRange }: TimeSlotsRowProps) {
  return <div>{day}</div>;
}

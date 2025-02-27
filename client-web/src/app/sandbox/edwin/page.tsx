import TimeTable from "@/components/meeting/timetable";
import dayjs from "dayjs";

const TEST_DATERANGE = {
  start: dayjs(new Date(2025, 1, 1)),
  end: dayjs(new Date(2025, 1, 3)),
};

const TEST_TIMERANGE = { start: 0, end: 24 };

export default async function Sandbox() {
  return (
    <div>
      <TimeTable dateRange={TEST_DATERANGE} timeRange={TEST_TIMERANGE} />
    </div>
  );
}

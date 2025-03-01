import TimeTable from "@/components/timetable/timetable";
import dayjs from "dayjs";

const TEST_DATERANGE = {
  start: dayjs(new Date(2025, 1, 1)),
  end: dayjs(new Date(2025, 1, 7)),
};

export default async function Sandbox() {
  return (
    <div>
      <TimeTable dateRange={TEST_DATERANGE} />
    </div>
  );
}

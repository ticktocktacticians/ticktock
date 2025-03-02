import TimeTable from "@/components/timetable/timetable";
import dayjs from "dayjs";
import Link from "next/link";

const TEST_DATERANGE = {
  start: dayjs(new Date(2025, 1, 1)),
  end: dayjs(new Date(2025, 1, 7)),
};

export default async function Sandbox() {
  return (
    <div>
      <TimeTable dateRange={TEST_DATERANGE} />
      <Link href="/meeting/create">Create Meeting Page</Link>
    </div>
  );
}

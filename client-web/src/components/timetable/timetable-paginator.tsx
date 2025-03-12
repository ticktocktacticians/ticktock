"use client";

import { ArrowLeft, ArrowRight } from "lucide-react";
import { useContext } from "react";
import { TimetableContext } from "./timetable-context";
import { cn } from "../../lib/utils";
import { CreateMeetingContext } from "../../app/meeting/create/context";

export const PAGE_SIZE = 5;

export default function TimetablePaginator({ max }: { max: number }) {
  const { page, setPage } = useContext(TimetableContext);
  const { errors } = useContext(CreateMeetingContext);

  const nextPage = () => {
    setPage(page + 1);
  }

  const prevPage = () => {
    setPage(page - 1);
  }

  return (
    <div className={cn(["flex px-6 justify-between items-center h-11 border-x border-b border-slate-900", errors.timeslots && "border-red-700"])}>
      <ArrowLeft className="cursor-pointer" onClick={prevPage} />
      <span className="text-xs text-slate-400">
        {`Showing days ${PAGE_SIZE * (page - 1) + 1}-${Math.min(PAGE_SIZE * page, max)}`}
      </span>
      <ArrowRight className="cursor-pointer" onClick={nextPage} />
    </div>
  );
}

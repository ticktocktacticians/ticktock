"use client";

import { CalendarCheck2 } from "lucide-react";
import { redirect } from "next/navigation";

export const HeaderLogo = () => (
  <span
    className="text-lg font-bold cursor-pointer"
    onClick={() => redirect("/")}
  >
    schedulr <CalendarCheck2 className="w-4 h-4 inline-block ml-1" />
  </span>
);

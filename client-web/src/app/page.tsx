"use client";

import CreateUserForm from "@/components/auth/create-user-form";
import { createUser } from "./actions";
import { User as AuthUser } from "@supabase/supabase-js";
import { invalidateUser, useGetUser } from "../lib/queries/user";
import { Button } from "../components/ui/button";
import { useGetEventsAndBookings } from "../lib/queries/events";
import { Card } from "../components/ui/card";
import { truncate } from "../utils/string";
import { redirect } from "next/navigation";
import { Badge } from "../components/ui/badge";
import { EVENT_STATUS } from "../lib/apis/getEventsAndBookings";
import { Calendar, Clock, Hourglass, MapPin, PlusCircle } from "lucide-react";
import { formatTime } from "../utils/date";
import { useSidebar } from "../components/ui/sidebar";
import { cn } from "../lib/utils";

const FORMAT_DISPLAY = {
  VIRTUAL: "Virtual",
  PHYSICAL: "In-Person",
} as Record<string, string>;

export interface LoggedInPage {
  authUser: AuthUser;
}

export default function Home() {
  const { data: user } = useGetUser();

  const { events, bookings } = useGetEventsAndBookings().data ?? {};
  const { isMobile } = useSidebar();

  if (!user) {
    return (
      <CreateUserForm
        createUser={async (formData) => {
          await createUser(formData);
          await invalidateUser();
        }}
      />
    );
  }

  return (
    <div className="flex flex-col place-self-center sm:w-[800px] w-[360px] overflow-y-hidden">
      <h1 className="text-2xl font-semibold mb-5">
        Hi, {user.email}!
      </h1>
      <Button
        className="bg-indigo-600 mb-6 w-[312px] h-10"
        onClick={() => redirect("/meeting/create")}
      >
        <PlusCircle /> Create new meeting
      </Button>
      <h1 className="text-xl font-semibold mb-5 text-indigo-600">Your meetings</h1>
      <div className="flex flex-col gap-2 h-[420px] overflow-y-scroll">
        {events?.length ? (
          events
            .sort((e1, e2) => e1.id - e2.id)
            .map((event) => {
              const bookingDatetime = bookings?.find(
                (b) => b.timeslot?.eventID === event.id
              )?.timeslot?.startDateTime;
              const parsedDatetime = bookingDatetime
                ? new Date(bookingDatetime)
                : null;
              const date = parsedDatetime?.toLocaleDateString("en-GB", {
                day: "2-digit",
                month: "long",
                year: "numeric",
              });
              const time = parsedDatetime && formatTime(parsedDatetime);
              return (
                <Card
                  className="flex h-18 items-center justify-between sm:px-6 px-3 py-4 rounded-none"
                  key={event.id}
                >
                  <h2 className="text-sm">{event.title ? truncate(event.title) : "-"}</h2>
                  <div className="flex items-center">
                    {!isMobile && (
                      <>
                        <Badge
                          variant="secondary"
                          className={cn([
                            "mr-8 h-6 rounded-sm text-xs ",
                            "bg-slate-500 text-white",
                            event.status === "SCHEDULED" && "bg-indigo-200 text-indigo-600"
                          ])}
                        >
                          {EVENT_STATUS[event.status]}
                        </Badge>
                        <div className="flex gap-4 mr-8 text-slate-400">
                          <div className="flex flex-col gap-2 w-28">
                            <span className="flex text-xs">
                              <Calendar height="16px" />
                              {date ? date : "-"}
                            </span>
                            <span className="flex text-xs">
                              <Clock height="16px" />
                              {time ? time : "-"}
                            </span>
                          </div>
                          <div className="flex flex-col gap-2 w-16">
                            <span className="flex text-xs">
                              <Hourglass height="16px" />
                              {event.duration} min
                            </span>
                            <span className="flex text-xs">
                              <MapPin height="16px" />
                              {FORMAT_DISPLAY[event.format]}
                            </span>
                          </div>
                        </div>
                      </>
                    )}
                    <Button
                      onClick={() => redirect(`/meeting/${event.id}`)}
                      className="dark border border-slate-200 bg-white text-xs sm:w-fit w-20"
                    >
                      View Details
                    </Button>
                  </div>
                </Card>
              );
            })
        ) : (
          <span>
            Wow, you have no meetings scheduled. Such great work-life balance!
          </span>
        )}
      </div>
    </div>
  );
}

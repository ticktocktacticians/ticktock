"use client";
import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import { getEvent } from "./actions";
import { MeetingAttendeeAvailabilityAccordion } from "./attendees";
import { EventDetailCard } from "./eventDetailCard";
import { Event } from "@/app/public/[meetingId]/page";
import { Button } from "@/components/ui/button";

// pass down props to children components
export default function CreateMeetingDetailsPage() {
  const params = useParams();
  const [event, setEvent] = useState<Event | null>(null);

  useEffect(() => {
    if (!params.meetingId) return;

    const fetchData = async () => {
      // Fetch event data
      try {
        const response = await getEvent(params.meetingId as string);
        if (response) {
          const data = await response.json();
          setEvent(data);
          console.log(">> event data = ", data);
        } else {
          console.error("no event returned");
        }
      } catch (error) {
        console.error("Failed to fetch event:", error);
      }
    };

    fetchData();
  }, [params.meetingId]);
  return (
    <div className="min-w-[900px] px-4 sm:px-6 lg:px-8">
      {event ? (
        <div className="mt-4 flex flex-col">
          <h1 className="text-3xl flex font-bold mb-6">
            Meeting Details - {event.title}
          </h1>

          <div className="grid grid-cols-2 gap-5 mb-4">
            <EventDetailCard event={event} />

            <div className="flex flex-col space-y-4">
              <Button variant="outline">Schedule meeting</Button>
              <Button variant="outline">Cancel meeting</Button>
            </div>
          </div>

          <MeetingAttendeeAvailabilityAccordion event={event} />
        </div>
      ) : (
        "Loading event details..."
      )}
    </div>
  );
}

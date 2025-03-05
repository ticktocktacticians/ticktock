"use client";

import {
  convertTimeslotsToSchedule,
  Event,
  Timeslot,
} from "@/app/public/[meetingId]/page";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Card, CardTitle } from "@/components/ui/card";
import { Separator } from "@radix-ui/react-separator";
import { useEffect, useState } from "react";
import {
  AttendeeAvailability,
  AttendeesTimeslotsForEventRequest,
  getAttendeesTimeslotsForEvent,
} from "./actions";
import { formatDate } from "@/app/utils/common";

interface MappedAttendeesAvailabilities {
  name: string;
  availabilitiesByDate: Record<string, string[]>;
}

function groupAvailabilitiesByAttendee(
  availabilities: AttendeeAvailability[]
): Record<string, string[]> {
  const grouped = availabilities.reduce(
    (acc: Record<string, string[]>, curr) => {
      if (!acc[curr.attendeeId]) {
        acc[curr.attendeeId] = [curr.startDateTime];
      } else {
        //  acc[curr.attendeeId] will always be defined
        acc[curr.attendeeId]!.push(curr.startDateTime);
      }
      return acc;
    },
    {}
  );

  // Sort each array chronologically
  Object.keys(grouped).forEach((attendeeId) => {
    grouped[attendeeId]!.sort((a, b) => a.localeCompare(b));
  });

  return grouped;
}

// groupedAvailabilites looks like this:
// {
//   "a865ed12-f9aa-4a59-a6e8-a296df3825bf": [
//     "2025-03-09T01:00:00Z",
//     "2025-03-10T01:00:00Z"
//   ]
// }
function mapAttendeeAvailability(
  groupedAvailabilities: Record<string, string[]>,
  event: Event
): MappedAttendeesAvailabilities[] {
  const mappedAttendeesAvailabilities: MappedAttendeesAvailabilities[] = [];

  for (const attendee of event.attendees) {
    // attendee does not have any availabilities set yet
    if (!groupedAvailabilities[attendee.id]) {
      console.log("Attendee not found with id: ", attendee.id);
      continue;
    }
    const attendeeIdentifier = attendee.email;
    // should already be sorted when grouping
    const availabilities = groupedAvailabilities[attendee.id];
    const mappedAvailabilitiesPerDay = availabilities!.reduce(
      (acc: Record<string, string[]>, utcDateTime: string) => {
        // confirm that event date time string is in utc form
        if (utcDateTime.includes("T") && new Date(utcDateTime)) {
          const [dateStr, timeStr] = utcDateTime.split("T");
          // empty string to fulfil typescript type check
          const date = dateStr || "";
          const time = timeStr || "";

          if (!acc[date]) {
            acc[date] = [time];
          } else {
            acc[date].push(time);
          }
        } else {
          console.error("Invalid date time format: ", utcDateTime);
        }
        return acc;
      },
      {} as Record<string, string[]>
    );

    mappedAttendeesAvailabilities.push({
      name: attendeeIdentifier,
      availabilitiesByDate: mappedAvailabilitiesPerDay,
    });
  }

  return mappedAttendeesAvailabilities;
}

export const MeetingAttendeeAvailabilityAccordion = ({
  event,
}: {
  event: Event;
}) => {
  const [mappedAttendeesAvailabilities, setAttendeesAvailabilities] = useState<
    MappedAttendeesAvailabilities[] | null
  >(null);
  const { attendees } = event;

  useEffect(() => {
    const fetchAttendeeEvent = async () => {
      try {
        const response = await getAttendeesTimeslotsForEvent({
          attendeeIds: event.attendees.map((attendee) => attendee.id),
          eventId: event.id.toString(),
        } as AttendeesTimeslotsForEventRequest);

        if (response) {
          const attendeesAvailabilities: AttendeeAvailability[] =
            await response.json();

          const groupedAvailabilitiesByAttendee = groupAvailabilitiesByAttendee(
            attendeesAvailabilities
          );

          setAttendeesAvailabilities(
            mapAttendeeAvailability(groupedAvailabilitiesByAttendee, event)
          );
        }
      } catch (error) {
        console.error("Failed to fetch attendee event:", error);
      }
    };

    fetchAttendeeEvent();
  }, [event]);

  const attendeeAvailability = (
    availabilitiesByDate: Record<string, string[]>
  ) => {
    return (
      <div className="pt-3">
        <p className="text-2xl font-semibold mt-3 mb-4">Slots selected</p>

        {Object.entries(availabilitiesByDate).map((dayAndTimeslots) => {
          return (
            <div>
              <p className="text-black">
                {formatDate(dayAndTimeslots[0])}
              </p>
              <div className="grid grid-cols-6 gap-6 pt-1 pb-4 overflow-x-auto">
                {dayAndTimeslots[1].map((timeslot) => (
                  <Card
                    key={timeslot}
                    className="flex justify-center max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow-sm hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700"
                  >
                    <CardTitle>{timeslot.slice(0, 5)}</CardTitle>
                  </Card>
                ))}
              </div>
            </div>
          );
        })}
        <p className="mb-2 text-black"></p>
        <div className="grid grid-cols-6 gap-6 py-4 overflow-x-auto"></div>
      </div>
    );
  };

  return mappedAttendeesAvailabilities ? (
    <div className="pt-5">
      <h2 className="text-2xl font-semibold mb-4">Your Attendees</h2>
      <Accordion type="single" collapsible className="w-full">
        {mappedAttendeesAvailabilities.map((attendee) => (
          <AccordionItem
            key={attendee.name}
            value={attendee.name}
            className="outline-no-bottom last:border-b-2 border-gray-200 pt-2"
          >
            {/* <AccordionTrigger className="w-full px-4 py-2 hover:bg-gray-100 cursor-pointer"> */}

            <div className="flex justify-between items-center w-full">
              <AccordionTrigger className="flex-grow text-left w-full px-4 py-4">
                <span className="text-lg font-semibold">{attendee.name}</span>
              </AccordionTrigger>
              <div className="flex space-x-4 pr-3">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    console.log("Completed clicked");
                  }}
                >
                  Completed
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    console.log("Resend email clicked");
                  }}
                >
                  Resend email
                </Button>
              </div>
            </div>
            {/* </AccordionTrigger> */}
            <AccordionContent className="px-4 py-2">
              <Separator className="border-b border-slate-400" />
              {attendeeAvailability(attendee.availabilitiesByDate)}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  ) : (
    <div> Loading attendees.... </div>
  );
};

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { MappedAttendeesAvailabilities } from "./page";
import _ from "lodash";
import { formatDate } from "../../utils/common";
import { Calendar, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { ConfirmationModal } from "./confirmation";
import { Event } from "@/app/public/[meetingId]/page";
import { createBooking } from "./actions";

export const ScheduleMeeting = ({
  attendeeAvailabilities,
  event,
}: {
  attendeeAvailabilities: MappedAttendeesAvailabilities[];
  event: Event;
}) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedTimeslot, setSelectedTimeslot] = useState<string | null>(null);

  //NOTE  temp function to duplicate attendee availabilities
  function duplicateTimeslots(
    attendeeAvailabilities: MappedAttendeesAvailabilities[]
  ): MappedAttendeesAvailabilities[] {
    const temp: MappedAttendeesAvailabilities[] = [];
    let store: Record<string, string[]> = {};
    for (const [key, value] of Object.entries(attendeeAvailabilities)) {
      if (value.name === "edwin.lim@gt.tech.gov.sg" && !_.isEmpty(store)) {
        temp.push({ name: value.name, availabilitiesByDate: store });
      } else {
        store = value.availabilitiesByDate;
        temp.push(value);
      }
    }
    return temp;
  }

  // For MVP we only use common date times across all attendees
  function findCommonDateTimes(attendees: MappedAttendeesAvailabilities[]): {
    [date: string]: string[];
  } {
    if (!attendees.length) return {};

    const commonDateTimes: { [date: string]: string[] } = {};

    // Extract all dates where at least one attendee is available
    const allDates = new Set<string>(
      attendees.flatMap((attendee) =>
        Object.keys(attendee.availabilitiesByDate)
      )
    );

    // For each date, find times when all attendees are available
    allDates.forEach((date) => {
      // Check if every attendee has the date in their availability
      const allAttendeesHaveDate = attendees.every(
        (attendee) => (attendee.availabilitiesByDate[date] ?? []).length > 0
      );

      // Skip dates where some attendees have no availability
      // all dates moving forward exist in all attendees, get common timeslots
      if (!allAttendeesHaveDate) return;

      // Create a map of time slots to count how many attendees are available at each time
      const timeSlotCounts = new Map<string, number>();

      // Count availability for each time slot
      attendees.forEach((attendee) => {
        const timesForDate = attendee.availabilitiesByDate[date] || [];
        timesForDate.forEach((time) => {
          timeSlotCounts.set(time, (timeSlotCounts.get(time) || 0) + 1);
        });
      });

      // Filter for time slots available for all attendees
      const commonTimes = Array.from(timeSlotCounts.entries())
        .filter(([_, count]) => count === attendees.length)
        .map(([time]) => time)
        .sort(); // Sort times chronologically

      // Only add dates that have common times
      if (commonTimes.length) {
        commonDateTimes[date] = commonTimes;
      }
    });

    return commonDateTimes;
  }

  function flattenCommonTimeslots(commonTimeslots: {
    [date: string]: string[];
  }): string[] {
    const flattenedTimeslots: string[] = [];

    Object.entries(commonTimeslots).forEach(([date, times]) => {
      times.forEach((time) => {
        flattenedTimeslots.push(`${date}T${time}`);
      });
    });

    // Sort by date and time
    return flattenedTimeslots.sort();
  }

  const toWorkWith = flattenCommonTimeslots(
    findCommonDateTimes(duplicateTimeslots(attendeeAvailabilities))
  );

  const extendedAttendees = [
    ...event.attendees,
    { email: "email 1", id: "1", alias: "demo alias 1" },
    { email: "email 2", id: "2", alias: "demo alias 2" },
    { email: "email 3", id: "3", alias: "demo alias 3" },
  ];

  const eventWithExtendedAttendee = {
    ...event,
    attendees: extendedAttendees,
  } as Event;

  const handleConfirmBooking = async (timeslot: string) => {
    try {
      setIsDialogOpen(false);
      await createBooking({
        startDateTime: timeslot,
        eventId: event.id.toString(),
      });
      alert("Booking created successfully!");
    } catch (e) {
      console.log("Error creating booking", e);
    }
  };

  return toWorkWith ? (
    <div>
      <h2 className="text-2xl font-semibold mb-4">
        Choose your preferred slot
      </h2>
      <Accordion type="single" collapsible className="w-full">
        {toWorkWith.map((commonDateTimeslot) => (
          <AccordionItem
            key={commonDateTimeslot}
            value={commonDateTimeslot}
            className="outline-no-bottom last:border-b-2 border-gray-200 pt-2"
          >
            <div className="flex justify-between items-center w-full">
              <AccordionTrigger className="flex-grow w-full px-4 py-4 [&>svg]:order-1 [&>svg]:mr-auto [&>svg]:ml-2">
                <div className="text-lg font-semibold flex items-center justify-between w-full">
                  <div className="flex items-center">
                    {/* Date section */}
                    <div className="flex items-center gap-2 min-w-[300px]">
                      <Calendar className="h-5 w-5 flex-shrink-0" />
                      <span>{formatDate(commonDateTimeslot)}</span>
                    </div>

                    {/* Time section */}
                    <div className="flex items-center gap-2 ml-4">
                      <Clock className="h-5 w-5 flex-shrink-0" />
                      <span>{commonDateTimeslot.slice(11, 16)}</span>
                    </div>
                  </div>
                </div>
              </AccordionTrigger>
              <Button
                variant="outline"
                size="sm"
                className="text-indigo-600 mr-5"
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedTimeslot(commonDateTimeslot);
                  setIsDialogOpen(true);
                  console.log("Book slot clicked");
                }}
              >
                Book this slot
              </Button>
            </div>
            <AccordionContent className="px-4 py-2">
              <div className="flex justify-between items-center">
                <span>
                  Future improvement: attendees available for this slot
                </span>
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
      {/* Using the separate dialog component */}
      <ConfirmationModal
        isOpen={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        selectedTimeslot={selectedTimeslot}
        onConfirm={handleConfirmBooking}
        event={eventWithExtendedAttendee}
      />
    </div>
  ) : (
    <p>No common timeslots</p>
  );
};

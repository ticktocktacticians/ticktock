"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Card, CardTitle } from "@/components/ui/card";
import { Separator } from "@radix-ui/react-separator";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const AttendeesInput = [
  {
    name: "Attendee 1",
    attendeeAvailability: {
      date: "Tue, 4 Mar 25",
      timeslots: [
        "10:00",
        "11:00",
        "12:00",
        "13:00",
        "14:00",
        "15:00",
        "16:00",
      ],
    },
  },
  {
    name: "Attendee 2",
    attendeeAvailability: {
      date: "Wed, 5 Mar 25",
      timeslots: ["12:00", "13:00"],
    },
  },
];

export const MeetingAttendeeAvailabilityAccordion = () => {
  const attendeeAvailability = (attendeeAvailability) => {
    return (
      <div className="pt-3">
        <p className="text-x font-bold mb-3">Slots selected</p>
        <p className="mb-2 text-black">{attendeeAvailability.date} </p>
        <div className="grid grid-cols-6 gap-6 py-4 overflow-x-auto">
          {attendeeAvailability.timeslots.map((timeslot) => (
            // <ScrollArea key = {timeslot} className="h-40">
            <Card
              key={timeslot}
              className="flex justify-center max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow-sm hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700"
            >
              <CardTitle>{timeslot}</CardTitle>
            </Card>
            // </ScrollArea>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="pt-5">
      <h2 className="text-2xl font-semibold mb-4">Your Attendees</h2>

      <Accordion type="single" collapsible className="w-full">
        {AttendeesInput.map((attendee) => (
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

              {attendeeAvailability(attendee.attendeeAvailability)}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
};

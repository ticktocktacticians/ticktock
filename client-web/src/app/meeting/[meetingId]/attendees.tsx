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
import { formatDate } from "@/app/utils/common";
import * as _ from "lodash";
import { MappedAttendeesAvailabilities } from "./page";

export const MeetingAttendeeAvailabilityAccordion = ({
  mappedAttendeesAvailabilities,
}: {
  mappedAttendeesAvailabilities: MappedAttendeesAvailabilities[];
}) => {
  const attendeeAvailability = (
    availabilitiesByDate: Record<string, string[]>
  ) => {
    return (
      <div className="pt-3">
        <p className="text-2xl font-semibold mt-3 mb-4">Slots selected</p>

        {Object.entries(availabilitiesByDate).map((dayAndTimeslots) => {
          return (
            <div key={dayAndTimeslots[0]}>
              <p className="text-black">{formatDate(dayAndTimeslots[0])}</p>
              <div className="grid grid-cols-6 gap-6 pt-1 pb-4 overflow-x-auto">
                {dayAndTimeslots[1].map((timeslot) => (
                  <Card
                    key={timeslot}
                    className="flex justify-center max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow-sm hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700"
                  >
                    <CardTitle key={timeslot}>{timeslot.slice(0, 5)}</CardTitle>
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
                  {_.isEmpty(attendee.availabilitiesByDate)
                    ? "Not Completed"
                    : "Completed"}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    console.log("Resend email clicked");
                  }}
                >
                  {/*May not be useful to render resend email for completed submissions cos they cant submit again */}
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

"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Required from "@/components/common/required";
import { useState } from "react";
import { Button } from "../ui/button";

export default function AttendeesInput() {
  const [attendee, setAttendee] = useState<string>("");
  const [attendees, setAttendees] = useState<string[]>([]);

  /**
   * @TODO attendees stringified into formdata to be sent to server
   * check if this works
   */
  return (
    <>
      <Label htmlFor="mandatoryAttendees">
        Mandatory attendees
        <Required />
      </Label>
      <Input
        value={attendee}
        onChange={(e) => setAttendee(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            const attendeesSet = new Set(attendees);
            attendeesSet.add(attendee);
            setAttendees([...attendeesSet]);
            setAttendee("");
          }
        }}
      />
      <input type="hidden" name="attendees" value={JSON.stringify(attendees)} />
      <div>
        {attendees.map((attendee, index) => (
          <Button key={index} variant="outline" className="pointer-events-none">
            {attendee}
            <span
              className="flex justify-center items-center pointer-events-auto"
              onClick={() => {
                setAttendees(attendees.filter((a) => a !== attendee));
              }}
            >
              x
            </span>
          </Button>
        ))}
      </div>
    </>
  );
}

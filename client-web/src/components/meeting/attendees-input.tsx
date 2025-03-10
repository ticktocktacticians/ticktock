"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Required from "@/components/common/required";
import { useContext, useState } from "react";
import { Button } from "../ui/button";
import { X } from "lucide-react";
import { CreateMeetingContext } from "../../app/meeting/create/context";

export default function AttendeesInput({ name }: { name: string; }) {
  const [attendee, setAttendee] = useState<string>("");
  const [attendees, setAttendees] = useState<string[]>([]);
  const { reviewing } = useContext(CreateMeetingContext);

  /**
   * @TODO attendees stringified into formdata to be sent to server
   * check if this works
   */
  return (
    <div className="mb-12">
      <Label htmlFor="mandatoryAttendees">
        Mandatory attendees
        <Required />
      </Label>
      <Input
        className="mt-2"
        value={attendee}
        onChange={(e) => setAttendee(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            const attendeesSet = new Set(attendees);
            attendeesSet.add(attendee);
            setAttendees([...attendeesSet]);
            setAttendee("");
          }
        }}
        disabled={reviewing}
      />
      <div>
        {attendees.map((attendee, index) => (
          <Button
            key={index}
            variant="outline"
            className="pointer-events-none mr-2 mt-3"
            disabled={reviewing}
          >
            {attendee}
            <span
              className="flex justify-center items-center pointer-events-auto"
              onClick={() => {
                setAttendees(attendees.filter((a) => a !== attendee));
              }}
            >
              <X />
            </span>
          </Button>
        ))}
      </div>
      <input type="hidden" name={name} value={JSON.stringify(attendees)} />
    </div>
  );
}

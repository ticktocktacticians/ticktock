"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createMeeting } from "./actions";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import AttendeesInput from "@/components/meeting/attendees-input";
import Required from "@/components/common/required";
import DateTimeSelector from "@/components/meeting/date-time-selector";
import { Button } from "@/components/ui/button";
import { useContext, type KeyboardEvent } from "react";
import EmailPreview from "@/components/meeting/email-preview";
import { CreateMeetingContext } from "./context";

const MEETING_DURATION_OPTS = [60, 120, 180, 240];

export default function CreateMeetingPage() {
  const { reviewing, setReviewing } = useContext(CreateMeetingContext);

  return (
    <div className="flex flex-col justify-center items-center">
      <form
        onKeyDown={(e: KeyboardEvent) =>
          e.key === "Enter" && e.preventDefault()
        }
        action={createMeeting}
        className="flex flex-col max-w-[540px]"
      >
        <h2 className="text-3xl text-indigo-600 w-full text-left font-semibold mb-8">
          {reviewing ? "Review new meeting details" : "Create New Meeting"}
        </h2>

        <div className="mb-4">
          <Label htmlFor="meetingTitle">
            Meeting Title
            <Required />
          </Label>
          <Input id="meetingTitle" name="meetingTitle" className="mt-2" />
        </div>

        <div className="mb-4">
          <Label htmlFor="meetingDesc">Meeting Description (if any)</Label>
          <Textarea id="meetingDesc" name="meetingDesc" className="mt-2" />
        </div>

        <div className="mb-4">
          <Label htmlFor="meetingDuration">
            Meeting Duration (in minutes)
            <Required />
          </Label>
          <Select
            name="meetingDuration"
            defaultValue={`${MEETING_DURATION_OPTS[0]}`}
          >
            <SelectTrigger className="w-[80px] mt-2" id="meetingDuration">
              <SelectValue placeholder={MEETING_DURATION_OPTS[0]} />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {MEETING_DURATION_OPTS.map((duration) => (
                  <SelectItem key={duration} value={`${duration}`}>
                    {duration}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        <div className="mb-12">
          <Label htmlFor="meetingFormat">
            Meeting Format
            <Required />
          </Label>
          <RadioGroup
            name="meetingFormat"
            defaultValue="VIRTUAL"
            className="mt-2"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="VIRTUAL" id="format-1" />
              <Label htmlFor="format-1">Virtual</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="PHYSICAL" id="format-2" />
              <Label htmlFor="format-2">In-Person</Label>
            </div>
          </RadioGroup>
        </div>

        <h2 className="text-xl text-indigo-600 font-semibold mb-4">
          {reviewing ? "Your attendees" : "Who else should be in this meeting?"}
        </h2>

        <AttendeesInput name="attendees" />
        <DateTimeSelector name="timeslots" />
        {!reviewing && (
          <div className="flex justify-end items-center mt-20">
            <Button
              className="w-[139px] bg-indigo-600"
              onClick={() => setReviewing(true)}
            >
              Next
            </Button>
          </div>
        )}
        {reviewing && (
          <>
            <EmailPreview />
            <div className="flex justify-between items-center mt-[72px]">
              <Button variant="outline" className="w-[139px]" onClick={() => setReviewing(false)}>Back</Button>
              <Button type="submit" className="w-[139px] bg-indigo-600">
                Send requests
              </Button>
            </div>
          </>
        )}
      </form>
    </div>
  );
}

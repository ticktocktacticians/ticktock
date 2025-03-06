"use client"

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
import { type KeyboardEvent } from "react";

const MEETING_DURATION_OPTS = [60, 120, 180, 240];

export default function CreateMeetingPage() {
  return (
    <div className="flex flex-col justify-center items-center">
      <form
        onKeyDown={(e: KeyboardEvent) =>
          e.key === "Enter" && e.preventDefault()
        }
        action={createMeeting}
        className="flex flex-col gap-6 w-[600px]"
      >
        <h1 className="text-3xl w-full text-left font-bold mb-5">
          Create New Meeting
        </h1>

        <div>
          <Label htmlFor="meetingTitle">
            Meeting Title
            <Required />
          </Label>
          <Input id="meetingTitle" name="meetingTitle" />
        </div>

        <div>
          <Label htmlFor="meetingDesc">Meeting Description (if any)</Label>
          <Textarea id="meetingDesc" name="meetingDesc" />
        </div>

        <div>
        <Label htmlFor="meetingDuration">
          Meeting Duration (in minutes)
          <Required />
        </Label>
        <Select
          name="meetingDuration"
          defaultValue={`${MEETING_DURATION_OPTS[0]}`}
        >
          <SelectTrigger className="w-[80px]" id="meetingDuration">
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
        </Select></div>
        <div>
        <Label htmlFor="meetingFormat">
          Meeting Format
          <Required />
        </Label>
        <RadioGroup name="meetingFormat" defaultValue="virtual">
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="virtual" id="format-1" />
            <Label htmlFor="format-1">Virtual</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="in-person" id="format-2" />
            <Label htmlFor="format-2">In-Person</Label>
          </div>
        </RadioGroup></div>

        <h2 className="text-xl font-bold">
          Who else should be in this meeting?
        </h2>

        <AttendeesInput name="attendees" />
        <DateTimeSelector name="timeslots" />
        <div className="flex justify-center items-center">
          <Button type="submit" className="w-[300px]">
            Next
          </Button>
        </div>
      </form>
    </div>
  );
}

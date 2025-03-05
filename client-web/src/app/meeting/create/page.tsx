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

/** @TODO bind additional timeslot args to createMeeting */

const MEETING_DURATION_OPTS = [60, 120, 180, 240];

export default async function CreateMeetingPage() {
  return (
    <div>
      <h1>Create New Meeting</h1>

      <form action={createMeeting}>
        <Label htmlFor="meetingTitle">
          Meeting Title
          <Required />
        </Label>
        <Input id="meetingTitle" name="meetingTitle" />

        <Label htmlFor="meetingDesc">Meeting Description (if any)</Label>
        <Textarea id="meetingDesc" name="meetingDesc" />

        <Label htmlFor="meetingDuration">
          Meeting Duration (in minutes)
          <Required />
        </Label>
        <Select>
          <SelectTrigger
            className="w-[80px]"
            id="meetingDuration"
            name="meetingDuration"
          >
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
        </RadioGroup>

        <h2>Who else should be in this meeting?</h2>

        <AttendeesInput />

        <DateTimeSelector />
      </form>
    </div>
  );
}

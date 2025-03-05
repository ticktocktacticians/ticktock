import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Event } from "@/app/public/[meetingId]/page";
import { Calendar, Clock, Hourglass, Link2, MapPin, Users } from "lucide-react";

// to obtain the event start date i will need to query whether the booking is confirmed as well
export const EventDetailCard = ({ event }: { event: Event }) => {
  return (
    <Card>
      <CardHeader>
        <CardContent>
          <div className="items-start">
            <div className="space-y-5">
              <div className="flex justify-between">
                <Calendar />
                <p> -- </p>
              </div>
              <div className="flex justify-between">
                <Hourglass />
                <p> -- </p>
              </div>
              <div className="flex justify-between">
                <Clock />
                <p> {event.duration} </p>
              </div>

              <div className="flex justify-between">
                <MapPin />
                <p> {event.format?.charAt(0) + event.format?.slice(1)?.toLowerCase()} </p>
              </div>
              <div className="flex justify-between">
                <Users />
                <p> {event.attendees.length} attendees </p>
              </div>
              <div className="flex justify-between">
                <Link2 />
                <p> -- </p>
              </div>
            </div>
          </div>
        </CardContent>
      </CardHeader>
    </Card>
  );
};

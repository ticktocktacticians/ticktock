import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Booking, Event } from "@/app/public/[meetingId]/page";
import { Calendar, Clock, Hourglass, Link2, MapPin, Users } from "lucide-react";
import { addMinutesToTime, formatDate } from "@/app/utils/common";

// to obtain the event start date i will need to query whether the booking is confirmed as well
export const EventDetailCard = ({
  event,
  booking,
}: {
  event: Event;
  booking?: Booking;
}) => {
  return (
    <Card>
      <CardHeader>
        <CardContent>
          <div className="items-start">
            <div className="space-y-5">
              <div className="flex justify-between">
                <Calendar className="text-slate-400" />
                {booking ? (
                  formatDate(booking.timeslot.startDateTime)
                ) : (
                  <p> -- </p>
                )}
              </div>
              <div className="flex justify-between">
                <Hourglass className="text-slate-400" />
                {booking ? (
                  <span>
                    {booking.timeslot.startDateTime.slice(11, 16) +
                      " - " +
                      addMinutesToTime(
                        booking.timeslot.startDateTime.slice(11, 16),
                        event.duration
                      ).formattedTime}
                  </span>
                ) : (
                  <p> -- </p>
                )}
              </div>
              <div className="flex justify-between">
                <Clock className="text-slate-400" />
                <p> {event.duration} </p>
              </div>

              <div className="flex justify-between">
                <MapPin className="text-slate-400" />
                <p>
                  {" "}
                  {event.format?.charAt(0) +
                    event.format?.slice(1)?.toLowerCase()}{" "}
                </p>
              </div>
              <div className="flex justify-between">
                <Users className="text-slate-400" />
                <p> {event.attendees.length} attendees </p>
              </div>
              <div className="flex justify-between">
                <Link2 className="text-slate-400" />
                <p> -- </p>
              </div>
            </div>
          </div>
        </CardContent>
      </CardHeader>
    </Card>
  );
};

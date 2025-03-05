import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Event } from "@/app/public/[meetingId]/page";
import { Calendar, Clock } from "lucide-react";

// to obtain the event start date i will need to query whether the booking is confirmed as well
export const EventDetailCard = ({ event }: { event: Event }) => {
  return (
    <Card>
      <CardHeader>
        <CardContent>
          <div>
            {event ? (
              <div className="mb-4 grid grid-cols-[25px_1fr] items-start pb-4 last:mb-0 last:pb-0">
                <span className="flex h-2 w-2" /> 
                <div className="space-y-1">
                  <div className="flex justify-between">
                    <Calendar />
                    <p> -- </p>
                  </div>
                  <div className="flex justify-between">
                    <Clock />
                    <p> {event.duration} </p>
                  </div>

                  <p className="text-sm text-muted-foreground">
                    format {event.format}
                  </p>
                </div>
              </div>
            ) : (
              "loading meeting details..."
            )}
          </div>
        </CardContent>
      </CardHeader>
    </Card>
  );
};

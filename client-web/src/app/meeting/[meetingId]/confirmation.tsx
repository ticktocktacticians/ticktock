"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Calendar, Clock, MapPin } from "lucide-react";
import { addMinutesToTime, formatDate } from "@/app/utils/common";
import { Separator } from "@/components/ui/separator";
import { Event } from "@/app/public/[meetingId]/page";
import EmailPreview, { EmailPreviewProps } from "@/components/meeting/email-preview";
import { Suspense } from "react";

interface BookingDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  selectedTimeslot: string;
  onConfirm: (event: Event, timeslot: string) => void;
  event: Event;
}

export function ConfirmationModal({
  isOpen,
  onOpenChange,
  selectedTimeslot,
  event,
  onConfirm,
}: BookingDialogProps) {

  const emailPreviewProps: EmailPreviewProps = {
    meetingDuration: event.duration.toString(),
    meetingTitle: event.title,
    meetingDesc: event.description ?? "desc",
    confirmationPage: true,
    meetingOwnerEmail: event.creator.email ?? "email",
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="text-indigo-600 text-2xl">
            Confirm Booking
          </DialogTitle>
          <Separator className="border-slate-400 pb-1" />
        </DialogHeader>
        {selectedTimeslot && (
          <div className="space-y-4 overflow-y-auto max-h-[80vh]">
            <h1 className="text-xl text-indigo-600 font-semibold mb-4">
              {event.title}
            </h1>
            <div className="py-2">
              <div className="flex items-center gap-2 mb-2">
                <Calendar className="h-4 w-4 text-slate-400" />
                <span>{formatDate(selectedTimeslot)}</span>
              </div>
              <div className="flex items-center gap-2 mb-2">
                <Clock className="h-4 w-4 text-slate-400" />
                <span>
                  {selectedTimeslot.slice(11, 16) +
                    " - " +
                    addMinutesToTime(
                      selectedTimeslot.slice(11, 16),
                      event.duration
                    ).formattedTime}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-slate-400" />
                <span>
                  {event.format?.charAt(0) +
                    event.format?.slice(1)?.toLowerCase()}
                </span>
              </div>
            </div>
            <h1 className="text-indigo-600 text-xl font-semibold pt-5 mb-4">
              Attendees
            </h1>
            <div className="border rounded-md">
              <div className="overflow-y-auto pr-1">
                <div className="p-4">
                  {event.attendees.map((attendee, index) => (
                    <div
                      key={attendee.id}
                      className="flex items-center py-2 border-b last:border-b-0"
                    >
                      <div className="w-8 h-8 flex items-center justify-center bg-gray-100 rounded-full mr-3 flex-shrink-0">
                        {index + 1}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium truncate">
                          {attendee.alias || attendee.email.split("@")[0]}
                        </p>
                        <p className="text-xs text-gray-500 truncate">
                          {attendee.email}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <Suspense fallback={<div>Loading Email preview...</div>}>
                  <EmailPreview {...emailPreviewProps} />
            </Suspense>
          </div>
        )}

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            className="bg-indigo-600 text-white"
            onClick={() =>
              selectedTimeslot && onConfirm(event, selectedTimeslot)
            }
          >
            Confirm
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

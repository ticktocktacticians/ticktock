import { House } from "lucide-react";
import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogTitle } from "../ui/dialog";
import { Event } from "@/app/public/[meetingId]/page";
import router from "next/router";

export default function SentDialog({
  open,
  setOpen,
  event,
}: {
  open: boolean;
  setOpen: (v: boolean) => void;
  event?: Event;
}) {
  return (
    <Dialog open={open}>
      {event ? (
        <DialogContent
          className="w-[562px] h-[318px] p-6 gap-10 flex flex-col justify-center items-center"
          hideClose
          aria-describedby={undefined}
        >
          <DialogTitle className="text-xl text-indigo-600 font-semibold w-full flex justify-center items-center">
            Availability requests sent!
          </DialogTitle>
          <span className="text-base flex justify-center items-center text-center">
            Your meeting has been created and email requests have been sent to
            your attendees’ inboxes — now we wait.
          </span>
          <Button
            onClick={() => {
              setOpen(false);
              // redirect to meeting page
              if (event?.id) {
                router.push(`/meeting/${event.id}`);
              }
            }}
            className="flex justify-center items-center bg-indigo-600 w-full"
          >
            <House className="mr-4" />
            Go to meeting
          </Button>
        </DialogContent>
      ) : (
        <div> Loading </div>
      )}
    </Dialog>
  );
}

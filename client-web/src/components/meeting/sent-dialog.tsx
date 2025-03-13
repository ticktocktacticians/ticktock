import { House, Loader2 } from "lucide-react";
import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogTitle } from "../ui/dialog";
import { Event } from "@/app/public/[meetingId]/page";
import { redirect } from "next/navigation";

export default function SentDialog({
  open,
  setOpen,
  event,
}: {
  open: boolean;
  setOpen: (v: boolean) => void;
  event?: Event;
}) {

  const handleRedirectToCreatedMeeting = () => {
    if (event?.id) {
      setOpen(false);
      redirect(`/meeting/${event.id}`);
    }
  };

  return (
    <Dialog open={open}>
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
          your attendees&apos; inboxes — now we wait.
        </span>
        {!event ? (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <Button
            onClick={handleRedirectToCreatedMeeting}
            className="flex justify-center items-center bg-indigo-600 w-full"
          >
            <House className="mr-4"/>
             Go to meeting
          </Button>
        )}
      </DialogContent>
    </Dialog>
  );
}

import { House } from "lucide-react";
import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogTitle } from "../ui/dialog";

export default function SentDialog({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: (v: boolean) => void;
}) {
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
          your attendees’ inboxes — now we wait.
        </span>
        <Button
          onClick={() => setOpen(false)}
          className="flex justify-center items-center bg-indigo-600 w-full"
        >
          <House className="mr-4" />
          Return to dashboard
        </Button>
      </DialogContent>
    </Dialog>
  );
}

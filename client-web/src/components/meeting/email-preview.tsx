"use client";

import { useContext } from "react";
import { CreateMeetingContext } from "../../app/meeting/create/context";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { useGetUser } from "../../lib/queries/user";

/** @todo */
export default function EmailPreview() {
  const { meetingTitle, meetingDuration, meetingDesc } =
    useContext(CreateMeetingContext);

  const { data: user } = useGetUser();

  return (
    <div className="mt-12 text-gray-900">
      <h4 className="text-xl text-indigo-600 font-semibold">
        Preview of request email
      </h4>
      <div className="mt-4 px-4 py-6 border border-slate-300 w-[541px] h-[436px] text-xs leading-5">
        <span className="text-sm">{`Input your availabilities for ‘${meetingTitle}’`}</span>
        <hr className="my-3" />
        <div className="mb-6 flex gap-3">
          <Avatar>
            <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
            <AvatarFallback>You</AvatarFallback>
          </Avatar>
          <div>
            <p>
              <span>{`${user?.alias ?? "<Your Name>"}`}</span>
              <span className="ml-2 text-slate-400">{`<${
                user?.email ?? "<Your Email>"
              }>`}</span>
            </p>
            <p className="text-slate-400">
              <span>to</span>
              <span className="ml-2">{`<attendee_email@tech.gov.sg>, ...`}</span>
            </p>
          </div>
        </div>
        {"Dear <Name>,"}
        <br />
        <br />
        You are invited to provide your availability for the following:
        <br />
        <br />
        <span className="text-slate-400">Meeting Title: </span>
        <span className="font-bold">{meetingTitle}</span>
        <br />
        <span className="text-slate-400">Meeting duration: </span>
        <span>{meetingDuration} min</span>
        <br />
        <span className="text-slate-400">
          Meeting description (if applicable):{" "}
        </span>
        <span>{meetingDesc}</span>
        <br />
        <br />
        Please kindly click on this link to select/ provide your available
        timeslots:
        <br />
        <span className="underline text-blue-500">
          https://go.gov.sg/Un1queL!nk4everyAttendee
        </span>
        <br />
        <br />
        For queries, please contact{" "}
        <span className="font-bold italic">Christy Yeo</span> at{" "}
        <span className="font-bold italic">+65 8123 4567</span>.
        <br />
        <br />
        Thank you!
      </div>
    </div>
  );
}

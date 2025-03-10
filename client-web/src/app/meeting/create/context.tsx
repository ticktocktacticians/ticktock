"use client";

import { createContext, PropsWithChildren, useState } from "react";

interface CreateMeetingContext {
  reviewing: boolean;
  setReviewing: (reviewing: boolean) => void;
  meetingTitle: string;
  setMeetingTitle: (v: string) => void;
  meetingDesc: string;
  setMeetingDesc: (v: string) => void;
  meetingDuration: string;
  setMeetingDuration: (v: string) => void;
}

export const CreateMeetingContext = createContext<CreateMeetingContext>({
  reviewing: false,
  setReviewing: () => {},
  meetingTitle: "",
  setMeetingTitle: () => {},
  meetingDesc: "",
  setMeetingDesc: () => {},
  meetingDuration: "60",
  setMeetingDuration: () => {},
});

export const CreateMeetingProvider = ({ children }: PropsWithChildren) => {
  const [reviewing, setReviewing] = useState(false);
  const [meetingTitle, setMeetingTitle] = useState("");
  const [meetingDesc, setMeetingDesc] = useState("");
  const [meetingDuration, setMeetingDuration] = useState("60");

  return (
    <CreateMeetingContext.Provider
      value={{
        reviewing,
        setReviewing,
        meetingTitle,
        setMeetingTitle,
        meetingDesc,
        setMeetingDesc,
        meetingDuration,
        setMeetingDuration,
      }}
    >
      {children}
    </CreateMeetingContext.Provider>
  );
};

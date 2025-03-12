"use client";

import dayjs from "dayjs";
import { createContext, PropsWithChildren, useState } from "react";

interface CreateMeetingContext {
  reviewing: boolean;
  setReviewing: (reviewing: boolean) => void;
  formData: CreateMeetingFormData;
  setFormData: (v: CreateMeetingFormData) => void;
  errors: Record<string, string[]|undefined>;
  setErrors: (v: Record<string, string[]|undefined>) => void;
}

export interface CreateMeetingFormData {
  meetingTitle: string;
  meetingDesc: string;
  meetingDuration: string;
  meetingLocation: string;
  attendees: string[];
  startDate: Date;
  endDate: Date;
  timeslots: string[];
}

const defaultFormData = {
  meetingTitle: "",
  meetingDesc: "",
  meetingDuration: "60",
  meetingLocation: "",
  attendees: [],
  startDate: new Date(),
  endDate: dayjs(new Date()).add(7, "day").toDate(),
  timeslots: [],
};

export const CreateMeetingContext = createContext<CreateMeetingContext>({
  reviewing: false,
  setReviewing: () => {},
  formData: defaultFormData,
  setFormData: () => {},
  errors: {},
  setErrors: () => {},
});

export const CreateMeetingProvider = ({ children }: PropsWithChildren) => {
  const [reviewing, setReviewing] = useState(false);
  const [formData, setFormData] = useState<CreateMeetingFormData>(defaultFormData)
  const [errors, setErrors] = useState({});

  return (
    <CreateMeetingContext.Provider
      value={{
        reviewing,
        setReviewing,
        formData,
        setFormData,
        errors,
        setErrors,
      }}
    >
      {children}
    </CreateMeetingContext.Provider>
  );
};

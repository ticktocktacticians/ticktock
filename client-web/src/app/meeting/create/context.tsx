"use client";

import { createContext, PropsWithChildren, useState } from "react";

interface CreateMeetingContext {
  reviewing: boolean;
  setReviewing: (reviewing: boolean) => void;
}

export const CreateMeetingContext = createContext<CreateMeetingContext>({
  reviewing: false,
  setReviewing: () => {},
});

export const CreateMeetingProvider = ({ children }: PropsWithChildren) => {
  const [reviewing, setReviewing] = useState(false);

  return (
    <CreateMeetingContext.Provider
      value={{
        reviewing,
        setReviewing,
      }}
    >
      {children}
    </CreateMeetingContext.Provider>
  );
};

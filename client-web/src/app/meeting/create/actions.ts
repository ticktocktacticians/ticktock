"use server";

import { getServerUserSession } from "../../../utils/supabase/server";

export const createMeeting = async (formData: FormData) => {
  const accessToken = (await getServerUserSession())?.access_token;
  const duration = formData.get("meetingDuration");
  const attendees = formData.get("attendees");
  const timeslots = formData.get("timeslots");
  const body = {
    meetingTitle: formData.get("meetingTitle"),
    meetingDesc: formData.get("meetingDesc"),
    meetingDuration:
      typeof duration === "string" ? Number.parseInt(duration) : duration,
    meetingFormat: formData.get("meetingFormat"),
    attendees:
      typeof attendees === "string" ? JSON.parse(attendees) : attendees,
    timeslots:
      typeof timeslots === "string" ? JSON.parse(timeslots) : timeslots,
    startDateRange: formData.get("startDateRange"),
    endDateRange: formData.get("endDateRange"),
  };

  accessToken &&
    (await fetch("http://localhost:8080/auth/event", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      method: "POST",
      body: JSON.stringify(body),
    }));
};

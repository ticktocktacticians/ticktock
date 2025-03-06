import { getBrowserUserSession } from "@/utils/supabase/client";

export type AttendeesTimeslotsForEventRequest = {
    attendeeIds: string[];
    eventId: string;
}

export type AttendeeAvailability = {
	attendeeId:    string;
	startDateTime: string;
}

export const getEvent = async (eventId: string) => {
      const accessToken = (await getBrowserUserSession())?.access_token;
    
      if (!accessToken) return null;

    return await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/auth/event/${eventId}`, {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
            method: "GET",
          }
    );
}

// POST request due to undeterministic length of attendeeIds 
export const getAttendeesTimeslotsForEvent = async (request: AttendeesTimeslotsForEventRequest) => {
    const accessToken = (await getBrowserUserSession())?.access_token;
    
    if (!accessToken) return null;

  return await fetch(
      `${process.env.NEXT_PUBLIC_SERVER_URL}/auth/event/attendees-timeslots`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
          method: "POST",
          body: JSON.stringify(request),
        }
  );
}
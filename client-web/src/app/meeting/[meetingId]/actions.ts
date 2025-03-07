import { getBrowserUserSession } from "@/utils/supabase/client";
import { SERVER_URL } from "../../../lib/apis/common";

export interface AttendeesTimeslotsForEventRequest {
  attendeeIds: string[];
  eventId: string;
}

export interface AttendeeAvailability {
  attendeeId: string;
  startDateTime: string;
}

export interface CreateBookingRequest {
  startDateTime: string;
  eventId: string;
}

export const getEvent = async (eventId: string) => {
  const accessToken = (await getBrowserUserSession())?.access_token;

  if (!accessToken) return null;

  return await fetch(
    `${process.env.NEXT_PUBLIC_SERVER_URL}/auth/event/${eventId}`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      method: "GET",
    }
  );
};

// POST request due to undeterministic length of attendeeIds
export const getAttendeesTimeslotsForEvent = async (
  request: AttendeesTimeslotsForEventRequest
) => {
  const accessToken = (await getBrowserUserSession())?.access_token;

  if (!accessToken) return null;

  return await fetch(
    `${process.env.NEXT_PUBLIC_SERVER_URL}/auth/event/attendees-timeslots`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      method: "POST",
      body: JSON.stringify(request),
    }
  );
};

export const createBooking = async (request: CreateBookingRequest) => {
  const accessToken = (await getBrowserUserSession())?.access_token;

  if (!accessToken) return null;

  return await fetch(
    `${process.env.NEXT_PUBLIC_SERVER_URL}/auth/event/booking`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      method: "POST",
      body: JSON.stringify(request),
    }
  );
};

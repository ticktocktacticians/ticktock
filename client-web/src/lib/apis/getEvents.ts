import { getBrowserUserSession } from "@/utils/supabase/client";
import { SERVER_URL } from "./common";

export const EVENT_STATUS = {
  PENDING_INPUT: "Pending input",
  SCHEDULED: "Scheduled",
  COMPLETED: "Completed",
  CANCELLED: "Cancelled",
} as const;

export type EVENT_STATUS = typeof EVENT_STATUS[keyof typeof EVENT_STATUS];

interface Event {
  id: number;
  title: string;
  duration: number;
  status: keyof typeof EVENT_STATUS;
  format: string;
}

export const getEvents = async (): Promise<Event[]|null> => {
  const accessToken = (await getBrowserUserSession())?.access_token;

  if (!accessToken) return null;

  return (
    await fetch(`${SERVER_URL}/auth/event`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      method: "GET",
    })
  )
    .json()
    .catch((err) => console.error(err));
};

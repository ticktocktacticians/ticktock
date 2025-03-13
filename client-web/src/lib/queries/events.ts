import { useQuery } from "@tanstack/react-query";
import { getQueryClient } from "../../app/providers";
import { getEventsAndBookings } from "../apis/getEventsAndBookings";

export const useGetEventsAndBookings = () =>
  useQuery({
    queryKey: ["event", "booking"],
    queryFn: getEventsAndBookings,
  });

export const invalidateEvents = () =>
  getQueryClient().invalidateQueries({
    queryKey: ["event", "booking"],
  });

import { useQuery } from "@tanstack/react-query";
import { getQueryClient } from "../../app/providers";
import { getEvents } from "../apis/getEvents";

export const useGetEvents = () =>
  useQuery({
    queryKey: ["event"],
    queryFn: getEvents,
  });

export const invalidateEvents = () =>
  getQueryClient().invalidateQueries({
    queryKey: ["event"],
  });

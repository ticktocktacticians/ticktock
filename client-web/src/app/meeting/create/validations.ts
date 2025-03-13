import { z } from "zod";

const MANDATORY_ERROR_MESSAGE = "This field is mandatory.";

const schema = z.object({
  meetingTitle: z.string().nonempty(MANDATORY_ERROR_MESSAGE),
  attendees: z.array(z.string().email().nonempty()).nonempty(),
  timeslots: z.array(z.string().nonempty()).nonempty(),
});

export const validate = <T>(values: T) =>
  schema.safeParse(values);

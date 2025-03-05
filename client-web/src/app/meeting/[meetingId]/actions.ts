import { getBrowserUserSession } from "@/utils/supabase/client";

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

// not correct cos its using the availability endpoint
// export const getAttendeeAvailableTimeslotsForEvent = async (eventId: string) => {
//     const accessToken = (await getBrowserUserSession())?.access_token;
    
//     if (!accessToken) return null;

//   return await fetch(
//       `${process.env.NEXT_PUBLIC_SERVER_URL}/auth/event/${eventId}`, {
//           headers: {
//             Authorization: `Bearer ${accessToken}`,
//           },
//           method: "GET",
//         }
//   );
// }
// helper function to convert 2025-03-09 or 2025-03-09T01:00:00Z into Tue, Sun, 9 Mar 2025
export function formatDate(inputDate: string, timezone?: string): string {
  const date = new Date(inputDate);
  const formattedDate = date.toLocaleDateString("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: timezone ?? "Asia/Singapore",
  });

  // Insert comma after weekday
  const weekdayEnd = formattedDate.indexOf(" ");
  if (weekdayEnd !== -1) {
    return (
      formattedDate.slice(0, weekdayEnd) + "," + formattedDate.slice(weekdayEnd)
    );
  }

  return formattedDate;
}

/**
 * Adds minutes to a time string and returns time information
 * @param timeStr Time string in format "HH:MM" (e.g. "02:00")
 * @param minutes Minutes to add 
 * @returns Object containing hours, formatted time and days advanced
 */
export function addMinutesToTime(
  timeStr: string, 
  minutes: number
): { hours: number; formattedTime: string; daysAdvanced: number } {
  // Parse the time string
  const [hours = 0, mins = 0] = timeStr.split(":").map(Number);
  
  // Convert to total minutes
  const totalMinutes = hours * 60 + mins + minutes;
  
  // Calculate new values, minutes added could cause increase in days
  const totalHours = totalMinutes / 60;
  const daysAdvanced = Math.floor(totalHours / 24);
  
  // Get hours and minutes within a day (0-23:59)
  const wrappedHours = Math.floor(totalHours) % 24;
  const wrappedMins = Math.round((totalHours - Math.floor(totalHours)) * 60);
  
  // Format time with leading zeros
  const formattedTime = `${wrappedHours.toString().padStart(2, '0')}:${wrappedMins.toString().padStart(2, '0')}`;
  
  return {
    hours: totalHours,
    formattedTime,
    daysAdvanced
  };
}

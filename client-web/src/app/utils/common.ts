// helper function to convert 2025-03-09 or 2025-03-09T01:00:00Z into Tue, Sun, 9 Mar 2025
export function formatDate(inputDate: string, timezone?: string): string {
    const date = new Date(inputDate);
    const formattedDate = date.toLocaleDateString('en-GB', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        timeZone: timezone ?? 'Asia/Singapore'
    });
    
   // Insert comma after weekday
   const weekdayEnd = formattedDate.indexOf(' ');
   if (weekdayEnd !== -1) {
     return formattedDate.slice(0, weekdayEnd) + ',' + formattedDate.slice(weekdayEnd);
   }
   
   return formattedDate;
}

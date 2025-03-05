// helper function to convert 2025-03-09 or 2025-03-09T01:00:00Z into Tue, Sun, 9 Mar 2025
export function formatDate(inputDate: string, timezone?: string): string {
    const date = new Date(inputDate);
    return date.toLocaleDateString('en-GB', {
        weekday: 'short',
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        timeZone: timezone ?? 'Asia/Singapore'
    });
}
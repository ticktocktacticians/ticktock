export interface Availability {
	userId: string;
	timeslots: { id: number }[];
}

export const getAttendeeEvent = async (attendeeEventId: string) => {
	return await fetch(
		`${process.env.NEXT_PUBLIC_SERVER_URL}/attendee/event/${attendeeEventId}`
	);
};

export const createAvailability = async (availability: Availability) => {
	return await fetch(
		`${process.env.NEXT_PUBLIC_SERVER_URL}/attendee/availability`,
		{
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(availability),
		}
	);
};

export const getAttendeeAvailability = async (attendeeEventId: string) => {
	return await fetch(
		`${process.env.NEXT_PUBLIC_SERVER_URL}/attendee/availability/${attendeeEventId}`
	);
};

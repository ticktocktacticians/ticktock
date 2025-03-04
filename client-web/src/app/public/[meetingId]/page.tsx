"use client";

import { Button } from "@/components/ui/button";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import {
	Availability,
	createAvailability,
	getAttendeeAvailability,
	getAttendeeEvent,
} from "./actions";
import dayjs from "dayjs";

interface Event {
	id: number;
	title: string;
	description: string;
	duration: number;
	status: string;
	format: string;
	creatorId: string;
	startDateRange: string;
	endDateRange: string;
	createor: {
		id: string;
		email: string;
		alias: string;
	};
	attendees: [
		{
			id: string;
			email: string;
			alias: string;
		}
	];
	timeslots: Timeslot[];
}

interface Timeslot {
	id: number;
	eventID: number;
	startDateTime: string;
	endDateTime: string;
}

interface Schedule {
	[date: string]: {
		title: string;
		timeslot: { time: string; id: number }[];
	};
}

function convertTimeslotsToSchedule(timeslots: Timeslot[]): Schedule {
	const schedule: Schedule = {};

	// Sort timeslots by startDateTime in ascending order
	timeslots.sort((a, b) =>
		dayjs(a.startDateTime).isBefore(b.startDateTime) ? -1 : 1
	);

	timeslots.forEach(({ id, startDateTime }) => {
		const dateObj = dayjs(startDateTime);
		const dateKey = dateObj.format("YYYY-MM-DD"); // "2025-03-03"
		const time = dateObj.format("hh:mma"); // "09:30AM"
		const title = dateObj.format("ddd, D MMM YY"); // "Mon, 3 Mar 25"

		if (!schedule[dateKey]) {
			schedule[dateKey] = {
				title,
				timeslot: [],
			};
		}

		schedule[dateKey].timeslot.push({ time, id });
	});

	return schedule;
}

const Review = ({
	goBack,
	event,
	schedule,
	selectedSlots,
}: {
	goBack: () => void;
	event: Event;
	schedule: Schedule;
	selectedSlots: number[];
}) => {
	const [submitted, setSubmitted] = useState(false);
	const [error, setError] = useState(false);

	const handleSubmit = async () => {
		// call the createAvailability function
		const request: Availability = {
			userId: event.attendees[0].id,
			timeslots: selectedSlots.map((id) => ({ id })),
		};

		try {
			const response = await createAvailability(request);
			if (response.status === 201) {
				setSubmitted(true);
			} else {
				setError(true);
				console.error("Failed to submit availability:", response.statusText);
			}
		} catch (error) {
			setError(true);
			console.error("Failed to submit availability:", error);
		}
	};

	// Filter schedules based on selected timeslot IDs
	const filteredSchedule = Object.entries(schedule).reduce(
		(acc, [date, { title, timeslot }]) => {
			const filteredTimeslots = timeslot.filter((ts) =>
				selectedSlots.includes(ts.id)
			);

			// Only include dates that have selected timeslots
			if (filteredTimeslots.length > 0) {
				acc[date] = { title, timeslot: filteredTimeslots };
			}

			return acc;
		},
		{} as Schedule
	);

	if (error) {
		return (
			<div>
				<p className="text-center">{`Error: There's an issue submitting your availabilities. Please try again.`}</p>
			</div>
		);
	}

	if (submitted) {
		return (
			<div className="p-4 max-w-md mx-auto font-sans text-center">
				<h1 className="text-2xl font-bold mb-4 text-gray-900">Scheduler</h1>
				<p className="text-gray-700 mb-4">
					Thank you for providing your availabilities. The meeting host will
					soon send the finalized meeting details to you.
				</p>
				<p className="text-gray-700">
					If you would like to make any changes to your inputs, please kindly
					contact the meeting host.
				</p>
			</div>
		);
	}

	return (
		<div className="p-4 max-w-md mx-auto font-sans">
			<h1 className="mb-4 text-4xl font-bold text-center text-indigo-500">
				Scheduler
			</h1>
			<hr className="border-t-2 border-indigo-500 mb-6" />
			<p className="text-2xl font-semibold">Review</p>
			<p className="mb-2">These are the timeslots that you have selected:</p>
			<p className="mb-8">
				{`Between ${dayjs(event.startDateRange).format("DD-MM-YY")} and ${dayjs(
					event.endDateRange
				).format("DD-MM-YY")}`}
			</p>

			<div className="rounded-md">
				{Object.entries(filteredSchedule).map(([date, { title, timeslot }]) => (
					<div key={date} className="mb-4">
						<h2 className="font-semibold mb-2">{title}</h2>{" "}
						{/* Display the date title */}
						<div className="grid gap-2">
							{timeslot.map(({ time, id }: { time: string; id: number }) => {
								return (
									<button
										key={id}
										className={`px-4 py-2 rounded-md border text-center w-full bg-gray-200`}
										disabled={true}
									>
										{time}
									</button>
								);
							})}
						</div>
					</div>
				))}
			</div>
			<div className="flex justify-between mt-8">
				<Button onClick={goBack} className="bg-indigo-500 text-white">
					Back
				</Button>
				{/** change to submit onclick */}
				<Button onClick={handleSubmit} className="bg-indigo-500 text-white">
					Submit
				</Button>
			</div>
		</div>
	);
};

const Scheduler = ({ goBack, event }: { goBack: () => void; event: Event }) => {
	const [selectedSlots, setSelectedSlots] = useState<number[]>([]);
	const [showReview, setShowReview] = useState(false);

	const schedule = convertTimeslotsToSchedule(event.timeslots);

	const toggleSlot = (id: number) => {
		setSelectedSlots((prevSelectedSlots) => {
			if (prevSelectedSlots.includes(id)) {
				return prevSelectedSlots.filter((slotId) => slotId !== id);
			} else {
				return [...prevSelectedSlots, id];
			}
		});
	};

	return (
		<div className="p-4 max-w-md mx-auto font-sans">
			{showReview ? (
				<Review
					goBack={() => setShowReview(false)}
					event={event}
					schedule={schedule}
					selectedSlots={selectedSlots}
				/>
			) : (
				<>
					<h1 className="mb-4 text-4xl font-bold text-center text-indigo-500">
						Scheduler
					</h1>
					<hr className="border-t-2 border-indigo-500 mb-6" />
					<p className="text-gray-600 mb-2">
						Please provide your availabilities:
					</p>
					<p className="text-2xl">My availabilities</p>
					<p className="mb-8">
						{`Between ${dayjs(event.startDateRange).format(
							"DD-MM-YY"
						)} and ${dayjs(event.endDateRange).format("DD-MM-YY")}`}
					</p>
					<p className="mb-2">
						Select all the timeslots which you are available
					</p>
					<div className="rounded-md">
						{Object.entries(schedule).map(([date, { title, timeslot }]) => (
							<div key={date} className="mb-4">
								<h2 className="font-semibold mb-2">{title}</h2>{" "}
								{/* Display the date title */}
								<div className="grid gap-2">
									{timeslot.map(
										({ time, id }: { time: string; id: number }) => {
											const isSelected = selectedSlots.includes(id); // Check if the slot is selected based on ID
											return (
												<button
													key={id}
													onClick={() => toggleSlot(id)} // Toggle the selected slot by ID
													className={`px-4 py-2 rounded-md border text-center w-full ${
														isSelected
															? "bg-indigo-500 text-white"
															: "bg-gray-200"
													}`}
												>
													{time}
												</button>
											);
										}
									)}
								</div>
							</div>
						))}
					</div>
					<div className="flex justify-between mt-8">
						<Button onClick={goBack} className="bg-indigo-500 text-white">
							Back
						</Button>
						<Button
							onClick={() => setShowReview(true)}
							className="bg-indigo-500 text-white"
						>
							Next
						</Button>
					</div>
				</>
			)}
		</div>
	);
};

export default function MultiStepScheduler() {
	const [showScheduler, setShowScheduler] = useState(false);
	const [timeoutError, setTimeoutError] = useState(false);
	const [event, setEvent] = useState<Event | null>(null);
	const [availabilityExist, setAvailabilityExist] = useState(false);
	const params = useParams();

	useEffect(() => {
		if (!params.meetingId) return;

		const fetchData = async () => {
			// Fetch availability data. If there's previous availability data, we shall not allow attendee to submit again.
			try {
				const response = await getAttendeeAvailability(
					params.meetingId as string
				);
				await response.json();
				setAvailabilityExist(true);

				return;
			} catch (error) {
				// This is not an error
				console.log("Failed to fetch availability:", error);
			}

			// Fetch event data
			try {
				const response = await getAttendeeEvent(params.meetingId as string);
				const data = await response.json();
				setEvent(data);
			} catch (error) {
				console.error("Failed to fetch event:", error);
			}
		};

		fetchData();
	}, [params.meetingId]); // Use specific dependencies to avoid unnecessary re-renders

	useEffect(() => {
		const timer = setTimeout(() => {
			if (!event) {
				setTimeoutError(true); // Set error if event is not defined after timeout
			}
		}, 5000); // Set timeout to 5 seconds (5000ms)

		return () => {
			clearTimeout(timer); // Clear the timeout if the component unmounts or the event changes
		};
	}, [event]);

	if (availabilityExist) {
		return (
			<div>
				<p className="text-center">
					You have already submitted your availabilities for this meeting.
				</p>
			</div>
		);
	}

	if (timeoutError) {
		return (
			<div>
				<p className="text-center">{`Error: Event data is taking too long to load! There might be an error with your URL.`}</p>
			</div>
		);
	}

	if (!event) {
		return (
			<div>
				<p className="text-center">Loading...</p>
			</div>
		);
	}

	if (!event) return <div>Loading...</div>;

	return (
		<div className="max-w-lg mx-auto mt-10 space-y-6 font-sans">
			{showScheduler ? (
				<Scheduler goBack={() => setShowScheduler(false)} event={event} />
			) : (
				<>
					<h1 className="text-4xl font-bold text-center text-indigo-500">
						Scheduler
					</h1>
					<hr className="border-t-2 border-indigo-500 mb-6" />
					<p>
						You're invited to provide your availabilities for the following:
					</p>

					<div className="space-y-4">
						<h2 className="text-2xl font-semibold text-indigo-500">
							Meeting details
						</h2>
						<p>
							<strong>Meeting title:</strong>
							<span className="block">{event.title}</span>
						</p>
						<p>
							<strong>Meeting duration:</strong>
							<span className="block">{event.duration}</span>
						</p>
						<p>
							<strong>Meeting format:</strong>
							<span className="block">{event.format}</span>
						</p>
					</div>

					<div className="space-y-4">
						<h2 className="text-2xl font-semibold text-indigo-500">
							Your details
						</h2>
						<p>
							<strong>Name:</strong>
							<span className="block">{event.attendees[0].alias}</span>
						</p>
						<p>
							<strong>Email address:</strong>
							<span className="block">{event.attendees[0].email}</span>
						</p>
					</div>

					<div className="flex justify-end">
						<Button
							onClick={() => setShowScheduler(true)}
							className="bg-indigo-500 text-white"
						>
							Next
						</Button>
					</div>
				</>
			)}
		</div>
	);
}

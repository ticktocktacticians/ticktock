"use client";
import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import {
	AttendeeAvailability,
	AttendeesTimeslotsForEventRequest,
	getAttendeesTimeslotsForEvent,
	getEvent,
} from "./actions";
import { MeetingAttendeeAvailabilityAccordion } from "./attendees";
import { EventDetailCard } from "./eventDetailCard";
import { Event } from "@/app/public/[meetingId]/page";
import { Button } from "@/components/ui/button";
import { ScheduleMeeting } from "./scheduleMeeting";
import _ from "lodash";
import { ChevronLeft } from "lucide-react";

/* looks like this: {
  "name": joel_tan@hive.gov.sg,
  availabilitiesByDate: {
    "2025-03-09": [
        "01:00:00Z",
        "02:00:00Z",
        "06:00:00Z"
    ],
    "2025-03-11": [
        "01:00:00Z",
        "04:00:00Z"
    ],
    "2025-03-12": [
        "02:00:00Z",
        "06:00:00Z",
        "07:00:00Z"
    ]
  }      
}
*/
export interface MappedAttendeesAvailabilities {
	name: string;
	availabilitiesByDate: Record<string, string[]>;
}

function groupAvailabilitiesByAttendee(
	availabilities: AttendeeAvailability[]
): Record<string, string[]> {
	const grouped = availabilities.reduce(
		(acc: Record<string, string[]>, curr) => {
			if (!acc[curr.attendeeId]) {
				acc[curr.attendeeId] = [curr.startDateTime];
			} else {
				//  acc[curr.attendeeId] will always be defined
				acc[curr.attendeeId]!.push(curr.startDateTime);
			}
			return acc;
		},
		{}
	);

	// Sort each array chronologically
	Object.keys(grouped).forEach((attendeeId) => {
		grouped[attendeeId]!.sort((a, b) => a.localeCompare(b));
	});

	return grouped;
}

// groupedAvailabilites looks like this:
// {
//   "a865ed12-f9aa-4a59-a6e8-a296df3825bf": [
//     "2025-03-09T01:00:00Z",
//     "2025-03-10T01:00:00Z"
//   ]
// }
function mapAttendeeAvailability(
	groupedAvailabilities: Record<string, string[]>,
	event: Event
): MappedAttendeesAvailabilities[] {
	const mappedAttendeesAvailabilities: MappedAttendeesAvailabilities[] = [];

	for (const attendee of event.attendees) {
		// attendee does not have any availabilities set yet
		if (!groupedAvailabilities[attendee.id]) {
			console.log("Attendee not found with id: ", attendee.id);
			continue;
		}
		const attendeeIdentifier = attendee.email;
		// should already be sorted when grouping
		const availabilities = groupedAvailabilities[attendee.id];
		const mappedAvailabilitiesPerDay = availabilities!.reduce(
			(acc: Record<string, string[]>, utcDateTime: string) => {
				// confirm that event date time string is in utc form
				if (utcDateTime.includes("T") && new Date(utcDateTime)) {
					const [dateStr, timeStr] = utcDateTime.split("T");
					// empty string to fulfil typescript type check
					const date = dateStr || "";
					const time = timeStr || "";

					if (!acc[date]) {
						acc[date] = [time];
					} else {
						acc[date].push(time);
					}
				} else {
					console.error("Invalid date time format: ", utcDateTime);
				}
				return acc;
			},
			{} as Record<string, string[]>
		);

		mappedAttendeesAvailabilities.push({
			name: attendeeIdentifier,
			availabilitiesByDate: mappedAvailabilitiesPerDay,
		});
	}

	return mappedAttendeesAvailabilities;
}

export default function CreateMeetingDetailsPage() {
	const params = useParams();
	const [event, setEvent] = useState<Event | null>(null);
	const [attendeeAvailabilities, setAttendeesAvailabilities] = useState<
		MappedAttendeesAvailabilities[]
	>([]);
	const [onClickScheduleMeeting, setOnClickScheduleMeeting] = useState(false);

	useEffect(() => {
		if (!params.meetingId) return;

		const fetchData = async () => {
			// Fetch event data
			try {
				const response = await getEvent(params.meetingId as string);
				if (response) {
					const data = await response.json();
					setEvent(data);
					console.log(">> event data = ", data);
				} else {
					console.error("no event returned");
				}
			} catch (error) {
				console.error("Failed to fetch event:", error);
			}
		};

		fetchData();
	}, [params.meetingId]);

	useEffect(() => {
		if (!event) return;
		const fetchAttendeeEvent = async () => {
			try {
				// get the availabilities of all attendees for the event. attendees with no availabilities will not be included
				const response = await getAttendeesTimeslotsForEvent({
					attendeeIds: event.attendees.map((attendee) => attendee.id),
					eventId: event.id.toString(),
				} as AttendeesTimeslotsForEventRequest);

				if (response) {
					const attendeesAvailabilities: AttendeeAvailability[] =
						await response.json();

					// availabilities grouped by attendee eg { "attendeeId": ["2025-03-09T01:00:00Z", "2025-03-10T01:00:00Z"] }
					const groupedAvailabilitiesByAttendee = groupAvailabilitiesByAttendee(
						attendeesAvailabilities
					);

					// insert attendees with no availabilities if there are any
					if (
						event.attendees.length !=
						Object.keys(groupedAvailabilitiesByAttendee).length
					) {
						for (const attendee of event.attendees) {
							if (!groupedAvailabilitiesByAttendee[attendee.id]) {
								groupedAvailabilitiesByAttendee[attendee.id] = [];
							}
						}
					}
					const mappedAttendeesAvailabilities = mapAttendeeAvailability(
						groupedAvailabilitiesByAttendee,
						event
					);

					setAttendeesAvailabilities(mappedAttendeesAvailabilities);
				}
			} catch (error) {
				console.error("Failed to fetch attendee event:", error);
			}
		};

		fetchAttendeeEvent();
	}, [event]);

	if (!event) {
		return (
			<div>
				<p className="text-center">Loading event details...</p>
			</div>
		);
	}

	return (
		<div className="min-w-[900px] px-4 sm:px-6 lg:px-8">
			{!onClickScheduleMeeting ? (
				<div className="mt-4 flex flex-col">
					<h1 className="text-3xl flex font-bold mb-6 text-indigo-600">
						Meeting Details - {event.title}
					</h1>

					<div className="grid grid-cols-2 gap-5 mb-4">
						<EventDetailCard event={event} />

						<div className="flex flex-col space-y-4">
							<Button
								className="text-slate-100 bg-indigo-600"
								variant="outline"
								onClick={(e) => {
									//FIXME  to update function
									attendeeAvailabilities.map((attendee) => {
										if (_.isEmpty(attendee.availabilitiesByDate)) {
											alert(
												`attendee: ${attendee.name} has not submitted their availabilities`
											);
											e.stopPropagation();
										}
									});
									setOnClickScheduleMeeting(true);
								}}
							>
								Schedule meeting
							</Button>
							<Button variant="outline">Cancel meeting</Button>
						</div>
					</div>

					<MeetingAttendeeAvailabilityAccordion
						mappedAttendeesAvailabilities={attendeeAvailabilities}
					/>
				</div>
			) : (
				<div>
					<div className="flex items-center mt-4 mb-6">
						<Button
							variant="ghost"
							size="default"
							onClick={() => setOnClickScheduleMeeting(false)}
							className="flex items-center text-gray-600"
						>
							<ChevronLeft className="h-4 w-4 mr-1" />
							Back
						</Button>
					</div>

					<h1 className="text-3xl flex font-bold mb-6">Schedule meeting</h1>
					<ScheduleMeeting
						attendeeAvailabilities={attendeeAvailabilities}
						event={event}
					/>
				</div>
			)}
		</div>
	);
}

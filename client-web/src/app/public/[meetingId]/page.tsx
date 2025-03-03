"use client";

import { Button } from "@/components/ui/button";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

const meetingData = {
	title: "Discussion for Next Quarter",
	duration: "30 mins",
	format: "In-Person",
	venue: "Hive",
	attendee: {
		name: "John Ang",
		email: "john_ang@gmail.com",
	},
};

const Scheduler = ({ goBack }) => {
	const [selectedSlots, setSelectedSlots] = useState<string[]>([]);
	const [submitted, setSubmitted] = useState(false);

	const schedule = {
		"Mon, 3 Mar 25": ["09:30AM", "10:00AM", "10:30AM", "11:00AM", "01:30PM"],
		"Tue, 4 Mar 25": ["09:30AM", "10:00AM", "10:30AM", "11:00AM"],
		"Wed, 5 Mar 25": ["09:30AM", "10:00AM", "10:30AM", "11:00AM"],
	};

	const toggleSlot = (date, time) => {
		const slot = `${date} - ${time}`;
		setSelectedSlots((prev) =>
			prev.includes(slot) ? prev.filter((s) => s !== slot) : [...prev, slot]
		);
	};

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
			<h1 className="text-2xl font-bold mb-4 text-indigo-500 text-center">
				Scheduler
			</h1>
			<p className="text-gray-600 mb-2">Please provide your availabilities:</p>
			<p className="text-2xl">My availabilities</p>
			<p className="mb-8">Between x and y</p>
			<p className="mb-2">Select all the timeslots which you are available</p>
			<div className="rounded-md">
				{Object.entries(schedule).map(([date, times]) => (
					<div key={date} className="mb-4">
						<h2 className="font-semibold mb-2">{date}</h2>
						<div className="grid gap-2">
							{times.map((time) => {
								const isSelected = selectedSlots.includes(`${date} - ${time}`);
								return (
									<button
										key={time}
										onClick={() => toggleSlot(date, time)}
										className={`px-4 py-2 rounded-md border text-center w-full ${
											isSelected ? "bg-indigo-500 text-white" : "bg-gray-200"
										}`}
									>
										{time}
									</button>
								);
							})}
						</div>
					</div>
				))}
			</div>
			<div className="mt-4">
				<h3 className="font-semibold">Selected Slots:</h3>
				<ul className="text-sm text-gray-700">
					{selectedSlots.length > 0 ? (
						selectedSlots.map((slot) => <li key={slot}>{slot}</li>)
					) : (
						<li>No slots selected</li>
					)}
				</ul>
			</div>
			<div className="flex justify-between mt-4">
				<Button onClick={goBack} className="bg-indigo-500 text-white">
					Back
				</Button>
				{/** change to submit onclick */}
				<Button
					onClick={() => setSubmitted(true)}
					className="bg-indigo-500 text-white"
				>
					Submit
				</Button>
			</div>
		</div>
	);
};

export default function MultiStepScheduler() {
	const [showScheduler, setShowScheduler] = useState(false);
	const params = useParams();

	useEffect(() => {
		console.log(params.meetingId);
	}, [params]);

	return (
		<div className="max-w-lg mx-auto mt-10 space-y-6 font-sans">
			{showScheduler ? (
				<Scheduler goBack={() => setShowScheduler(false)} />
			) : (
				<>
					<h1 className="text-4xl font-bold text-center text-indigo-500">
						Scheduler
					</h1>
					<p>
						You're invited to provide your availabilities for the following:
					</p>

					<div className="space-y-4">
						<h2 className="text-2xl font-semibold text-indigo-500">
							Meeting details
						</h2>
						<p>
							<strong>Meeting title:</strong>
							<span className="block">{meetingData.title}</span>
						</p>
						<p>
							<strong>Meeting duration:</strong>
							<span className="block">{meetingData.duration}</span>
						</p>
						<p>
							<strong>Meeting format:</strong>
							<span className="block">{meetingData.format}</span>
						</p>
						<p>
							<strong>Venue:</strong>
							<span className="block">{meetingData.venue}</span>
						</p>
					</div>

					<div className="space-y-4">
						<h2 className="text-2xl font-semibold text-indigo-500">
							Your details
						</h2>
						<p>
							<strong>Name:</strong>
							<span className="block">{meetingData.attendee.name}</span>
						</p>
						<p>
							<strong>Email address:</strong>
							<span className="block">{meetingData.attendee.email}</span>
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

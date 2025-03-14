"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createMeeting } from "./actions";
import { Textarea } from "@/components/ui/textarea";
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import AttendeesInput from "@/components/meeting/attendees-input";
import Required from "@/components/common/required";
import DateTimeSelector from "@/components/meeting/date-time-selector";
import { Button } from "@/components/ui/button";
import { useContext, useState, type KeyboardEvent } from "react";
import EmailPreview, {
	EmailPreviewProps,
} from "@/components/meeting/email-preview";
import { CreateMeetingContext } from "./context";
import { cn } from "@/lib/utils";
import SentDialog from "@/components/meeting/sent-dialog";
import { useGetUser } from "@/lib/queries/user";
import { validate } from "./validations";
import FormErrorMsg from "@/components/common/form-error-msg";
import { Event } from "@/app/public/[meetingId]/page";

const MEETING_DURATION_OPTS = [60, 120, 180, 240];

export default function CreateMeetingPage() {
	const { reviewing, setReviewing, formData, setFormData, errors, setErrors } =
		useContext(CreateMeetingContext);
	const { data: user } = useGetUser();
	const [sentDialogOpen, setSentDialogOpen] = useState(false);
	const [meetingFormat, setMeetingFormat] = useState("VIRTUAL");
	const [createdEvent, setCreatedEvent] = useState<Event | undefined>(
		undefined
	);

	const emailPreviewProps: EmailPreviewProps = {
		confirmationPage: false,
		meetingOwnerEmail: user?.email ?? "",
		meetingTitle: formData.meetingTitle,
		meetingDuration: formData.meetingDuration,
		meetingDesc: formData.meetingDesc,
	};

	const handleSubmit = async (formData: FormData) => {
		try {
			setSentDialogOpen(true);
			const createdEvent: Event = await createMeeting(formData);
			if (createdEvent) {
				setCreatedEvent(createdEvent);
			}
		} catch (e) {
			console.warn(">> error creating meeting: ", e);
		}
	};

	return (
		<div className="flex flex-col justify-center items-center">
			<form
				onKeyDown={(e: KeyboardEvent) =>
					e.key === "Enter" && e.preventDefault()
				}
				action={handleSubmit}
				className={cn([
					"flex flex-col sm:max-w-[540px] max-w-[360px]",
					reviewing && "text-slate-400",
				])}
			>
				<h2 className="text-3xl text-indigo-600 w-full text-left font-semibold mb-8">
					{reviewing ? "Review new meeting details" : "Create New Meeting"}
				</h2>

				<div className="mb-4">
					<Label htmlFor="meetingTitle">
						Meeting Title
						<Required />
					</Label>
					<Input
						id="meetingTitle"
						name="meetingTitle"
						onChange={(e) =>
							setFormData({ ...formData, meetingTitle: e.target.value })
						}
						className={cn(["mt-2", errors.meetingTitle && "border-red-700"])}
						disabled={reviewing}
					/>
					{errors.meetingTitle?.length && (
						<FormErrorMsg msg={errors.meetingTitle[0]} />
					)}
					<input
						type="hidden"
						name="meetingTitle"
						value={formData.meetingTitle}
					/>
				</div>

				<div className="mb-4">
					<Label htmlFor="meetingDesc">Meeting Description (if any)</Label>
					<Textarea
						id="meetingDesc"
						name="meetingDesc"
						onChange={(e) =>
							setFormData({ ...formData, meetingDesc: e.target.value })
						}
						className={cn(["mt-2", errors.meetingDesc && "border-red-700"])}
						disabled={reviewing}
					/>
					{errors.meetingDesc?.length && (
						<FormErrorMsg msg={errors.meetingDesc[0]} />
					)}
					<input
						type="hidden"
						name="meetingDesc"
						value={formData.meetingDesc}
					/>
				</div>

				<div className="mb-4">
					<Label htmlFor="meetingDuration">
						Meeting Duration (in minutes)
						<Required />
					</Label>
					<Select
						name="meetingDuration"
						defaultValue={`${MEETING_DURATION_OPTS[0]}`}
						onValueChange={(v) =>
							setFormData({ ...formData, meetingDuration: v })
						}
					>
						<SelectTrigger
							className="w-[80px] mt-2"
							id="meetingDuration"
							disabled={reviewing}
						>
							<SelectValue placeholder={MEETING_DURATION_OPTS[0]} />
						</SelectTrigger>
						<SelectContent>
							<SelectGroup>
								{MEETING_DURATION_OPTS.map((duration) => (
									<SelectItem key={duration} value={`${duration}`}>
										{duration}
									</SelectItem>
								))}
							</SelectGroup>
						</SelectContent>
					</Select>
				</div>

				<div className="mb-4">
					<Label htmlFor="meetingFormat">
						Meeting Format
						<Required />
					</Label>
					<RadioGroup
						defaultValue="VIRTUAL"
						className="mt-2"
						disabled={reviewing}
						onValueChange={(v) => setMeetingFormat(v)}
					>
						<input type="hidden" name="meetingFormat" value={meetingFormat} />
						<div className="flex items-center space-x-2">
							<RadioGroupItem value="VIRTUAL" id="format-1" />
							<Label htmlFor="format-1">Virtual</Label>
						</div>
						<div className="flex items-center space-x-2">
							<RadioGroupItem value="PHYSICAL" id="format-2" />
							<Label htmlFor="format-2">In-Person</Label>
						</div>
					</RadioGroup>
				</div>

				<div className="mb-12">
					<Label
						htmlFor="meetingLocation"
						className={meetingFormat === "VIRTUAL" ? "text-slate-400" : ""}
					>
						Meeting Location
						<Required />
					</Label>
					<Input
						id="meetingLocation"
						name="meetingLocation"
						className="mt-2"
						disabled={reviewing || meetingFormat === "VIRTUAL"}
					/>
				</div>

				<h2 className="text-xl text-indigo-600 font-semibold mb-4">
					{reviewing ? "Your attendees" : "Who else should be in this meeting?"}
				</h2>

				<AttendeesInput name="attendees" />
				<DateTimeSelector name="timeslots" />
				{!reviewing && (
					<div className="flex justify-end items-center mt-20">
						<Button
							className="w-[139px] bg-indigo-600"
							onClick={() => {
								const results = validate(formData);
								if (results.success) {
									setErrors({});
									window.scrollTo({ top: 0, behavior: "smooth" });
									return setReviewing(true);
								}
								const errors = results.error.flatten().fieldErrors;
								setErrors(errors);
							}}
						>
							Next
						</Button>
					</div>
				)}
				{reviewing && (
					<>
						<EmailPreview {...emailPreviewProps} />
						<div className="flex justify-between items-center mt-[72px]">
							<Button
								variant="outline"
								className="w-[139px]"
								onClick={() => setReviewing(false)}
							>
								Back
							</Button>
							<Button
								type="submit"
								onClick={() => setSentDialogOpen(true)}
								className="w-[139px] bg-indigo-600"
							>
								Send requests
							</Button>
						</div>
					</>
				)}
				<SentDialog
					open={sentDialogOpen}
					setOpen={setSentDialogOpen}
					event={createdEvent}
				/>
			</form>
		</div>
	);
}

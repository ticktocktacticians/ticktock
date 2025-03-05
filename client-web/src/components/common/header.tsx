import { Card, CardHeader } from "@/components/ui/card";
import { CalendarCheck2 } from "lucide-react";

export default function Header() {
	return (
		<Card className="w-full bg-indigo-600 text-white rounded-none shadow-md sticky top-0">
			<CardHeader className="flex justify-between items-center p-6">
				<span className="text-lg font-bold">
					schedulr <CalendarCheck2 className="w-4 h-4 inline-block ml-1" />
				</span>
			</CardHeader>
		</Card>
	);
}

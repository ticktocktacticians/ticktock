"use client"

export default function DaysColumn({ days }: { days: string[] }) {
  return (
    <div className="flex flex-col">
      <div className="box-border w-36 h-10 p-2 text-right">{}</div>
      <div className="box-border">
      {days.map((day, index) => {
        const border = index === 0 ? 'border-t' : index === days.length - 1 ? 'border-b' : '';
        return (
          <div
            key={`day-${day}`}
            className={`w-36 h-10 p-2 text-right border-r border-l border-gray-700 ${border} border-gray-700`}
          >
            {day}
          </div>
        );})}
      </div>
    </div>
  );
}

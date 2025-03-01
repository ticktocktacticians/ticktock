export default async function Axis() {
  const labels = [];
  for (let hour = 0; hour < 24; hour++) {
    labels.push(hour);
  }
  return (
    <div className="flex h-10 w-fit justify-between">
      {labels.map((label, i) => {
        const displayLabel = label > 12 ? label - 12 : label;
        return (
          <div
            key={`axis-${label}`}
            className={`w-8 h-10 flex items-end transform ${
              displayLabel >= 10 ? "translate-x-[-8px]" : "translate-x-[-5px]"
            }`}
          >
            {i === 0 ? '' : displayLabel}
          </div>
        );
      })}
    </div>
  );
}

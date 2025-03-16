export function formatTime(date: Date): string {
  const istDate = new Date(date);

  // Format the date and time
  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
    timeZone: "UTC",
  };

  return new Intl.DateTimeFormat("en-IN", options).format(istDate) + " UTC";
}

import { Button } from "@/components/ui/button";
export default function EventCard({ event }) {
  function formatDate(date) {
    return new Date(date).toLocaleDateString();
  }
  return (
    <>
      <h2>{event?.title}</h2>
      <p>Starts: {formatDate(event.startdate)}</p>
      <p>Ends: {formatDate(event.enddate)}</p>
      <p>About: {event?.description}</p>
      <Button variant="outline">status:{event.status}</Button>
    </>
  );
}

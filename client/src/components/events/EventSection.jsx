import EventCard from "@/components/events/EventCard";
export default function EventSection({
  title,
  emptyMessage,
  events,
  onEventChange,
  isOwner,
}) {
  return (
    <section className="mt-8">
      <h2 className="mb-4 text-2xl font-semibold">{title}</h2>

      {events.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2">
          {events.map((event) => (
            <EventCard
              key={event.id}
              event={event}
              onEventChange={onEventChange}
              isOwner={isOwner}
            />
          ))}
        </div>
      ) : (
        <p className="text-muted-foreground">{emptyMessage}</p>
      )}
    </section>
  );
}

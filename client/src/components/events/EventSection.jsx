import EventCard from "@/components/events/EventCard";
export default function EventSection({
  events,
  emptyMessage,
  onEventChange,
  isOwner,
}) {
  if (events.length === 0) {
    return (
      <div className="rounded-xl border border-dashed px-6 py-12 text-center">
        <p className="text-sm text-muted-foreground">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {events.map((event) => (
        <EventCard
          key={event.id}
          event={event}
          onEventChange={onEventChange}
          isOwner={isOwner}
        />
      ))}
    </div>
  );
}

import { useEffect, useState } from "react";
import { CalendarDays, Check, MapPin, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { createEvent } from "@/api/eventApi";

function formatDate(date) {
  if (!date) {
    return "Date unavailable";
  }

  return new Date(date).toLocaleString([], {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

function createDefaultVotingDeadline(startDate) {
  const now = new Date();
  const proposedDeadline = new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000);

  if (!startDate) {
    return proposedDeadline.toISOString();
  }

  const eventDate = new Date(startDate);

  if (Number.isNaN(eventDate.getTime())) {
    return proposedDeadline.toISOString();
  }

  const oneDayBeforeEvent = new Date(eventDate.getTime() - 24 * 60 * 60 * 1000);

  return new Date(
    Math.min(proposedDeadline.getTime(), oneDayBeforeEvent.getTime()),
  ).toISOString();
}

export default function TicketmasterResultCard({
  event,
  groupId,
  initiallyAdded,
  onEventAdded,
}) {
  const [added, setAdded] = useState(initiallyAdded);
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    setAdded(initiallyAdded);
  }, [initiallyAdded]);

  async function handleAddEvent() {
    if (added || adding) return;

    try {
      setAdding(true);

      const eventPayload = {
        title: event.title,
        startDate: event.startDate,
        endDate: event.endDate ?? null,
        location: event.location,
        description: event.description,
        votingEnds: createDefaultVotingDeadline(event.startDate),
        ticketmasterId: event.ticketmasterId,
        eventImageUrl: event.eventImageUrl,
        latitude: event.latitude,
        longitude: event.longitude,
      };

      const data = await createEvent(groupId, eventPayload);

      setAdded(true);
      toast.success("Event added to the group");

      await onEventAdded?.(data.event);
    } catch (err) {
      console.error(err);
      toast.error(err.message);
    } finally {
      setAdding(false);
    }
  }

  return (
    <Card className="overflow-hidden">
      <div className="aspect-video overflow-hidden bg-muted">
        {event.eventImageUrl ? (
          <img
            src={event.eventImageUrl}
            alt={event.title}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="text-muted-foreground flex h-full items-center justify-center text-sm">
            No image available
          </div>
        )}
      </div>

      <CardHeader>
        <div className="flex items-start justify-between gap-3">
          <CardTitle className="line-clamp-2">{event.title}</CardTitle>

          {added && <Badge variant="secondary">Added</Badge>}
        </div>
      </CardHeader>

      <CardContent className="space-y-3">
        <div className="flex items-start gap-2 text-sm">
          <CalendarDays className="mt-0.5 h-4 w-4 shrink-0" />

          <span>{formatDate(event.startDate)}</span>
        </div>

        <div className="flex items-start gap-2 text-sm">
          <MapPin className="mt-0.5 h-4 w-4 shrink-0" />

          <span>{event.location || "Location unavailable"}</span>
        </div>

        {event.description && (
          <p className="text-muted-foreground line-clamp-3 text-sm">
            {event.description}
          </p>
        )}
      </CardContent>

      <CardFooter>
        <Button
          type="button"
          className="w-full"
          variant={added ? "secondary" : "default"}
          disabled={added || adding}
          onClick={handleAddEvent}
        >
          {added ? (
            <>
              <Check className="h-4 w-4" />
              Added to Group
            </>
          ) : adding ? (
            "Adding..."
          ) : (
            <>
              <Plus className="h-4 w-4" />
              Add to Group
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}

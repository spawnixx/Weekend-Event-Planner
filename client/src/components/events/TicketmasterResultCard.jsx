import { useState } from "react";
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
import EventMapDialog from "./EventMapDialog";

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
  const eventDate = new Date(startDate);

  if (Number.isNaN(eventDate.getTime())) {
    return new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000).toISOString();
  }

  const MS_PER_DAY = 24 * 60 * 60 * 1000;

  const daysUntilEvent = (eventDate.getTime() - now.getTime()) / MS_PER_DAY;

  let deadline;

  if (daysUntilEvent >= 14) {
    deadline = new Date(now.getTime() + 7 * MS_PER_DAY);
  } else if (daysUntilEvent >= 7) {
    deadline = new Date(now.getTime() + 4 * MS_PER_DAY);
  } else if (daysUntilEvent >= 3) {
    deadline = new Date(eventDate.getTime() - 1 * MS_PER_DAY);
  } else {
    deadline = new Date(eventDate.getTime() - 12 * 60 * 60 * 1000);
  }

  return deadline.toISOString();
}

export default function TicketmasterResultCard({
  event,
  groupId,
  initiallyAdded,
  onEventAdded,
}) {
  const [justAdded, setJustAdded] = useState(false);

  const added = initiallyAdded || justAdded;
  const [adding, setAdding] = useState(false);

  async function handleAddEvent() {
    if (added || adding) return;

    try {
      setAdding(true);

      const eventPayload = {
        title: event.title,
        startDate: event.startDate,
        endDate: event.endDate ?? null,
        location: event.location,
        description: event.description || "No description available.",
        votingEnds: createDefaultVotingDeadline(event.startDate),
        ticketmasterId: event.ticketmasterId,
        eventImageUrl: event.eventImageUrl,
        latitude: event.latitude,
        longitude: event.longitude,
      };

      const data = await createEvent(groupId, eventPayload);

      setJustAdded(true);
      toast.success("Event added to the group");

      await onEventAdded?.(data.event);
    } catch (err) {
      console.error(err);

      if (err.status === 409) {
        setJustAdded(true);
        toast.info("This event is already in the group");
        return;
      }

      toast.error(err.message);
    } finally {
      setAdding(false);
    }
  }

  return (
    <Card className="flex h-full flex-col overflow-hidden">
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
          <CardTitle className="line-clamp-2 h-12">{event.title}</CardTitle>

          {added && <Badge variant="secondary">Added</Badge>}
        </div>
      </CardHeader>

      <CardContent className="flex flex-1 flex-col gap-2">
        <div className="flex items-start gap-2 text-sm">
          <CalendarDays className="mt-0.5 h-4 w-4 shrink-0" />

          <span>{formatDate(event.startDate)}</span>
        </div>

        <div className="flex items-start gap-2 text-sm">
          {event.location ? (
            <EventMapDialog event={event} />
          ) : (
            <>
              <MapPin className="mt-0.5 h-4 w-4 shrink-0" />
              <span>Location unavailable</span>
            </>
          )}
        </div>

        {event.description && (
          <p className="line-clamp-4 min-h-5 text-sm text-muted-foreground">
            {event.description || "No description available."}
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

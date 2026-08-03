import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import VoteBadge from "./VoteBadge";
import {
  ChevronDown,
  ChevronUp,
  MapPin,
  ThumbsDown,
  ThumbsUp,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";
import EditEventModal from "./EditEventModal";
export default function EventCard({ event, onEventChange, isOwner }) {
  const { user } = useAuth();
  function formatDate(date) {
    return new Date(date).toLocaleString();
  }

  const [expandCard, setExpandCard] = useState(false);

  async function handleVote(value) {
    const res = await fetch(
      `http://localhost:3001/groups/${event.groupid}/events/${event.id}/vote`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          vote: value,
        }),
      },
    );
    const data = await res.json();

    if (!res.ok) {
      console.log(data);
      toast.error(data.message);
      return;
    }
    console.log("Vote saved:", data.vote.vote);
    toast.success("Vote Saved!");
    await onEventChange();
  }

  const votingClosed = new Date() > new Date(event.votingends);
  const currentMember = event.members?.find((member) => member.id === user?.id);

  const userVote = currentMember?.vote ?? null;

  async function handleDelete() {
    const confirmed = window.confirm(`Delete "${event.title}"?`);
    if (!confirmed) return;

    const res = await fetch(
      `http://localhost:3001/groups/${event.groupid}/events/${event.id}`,
      {
        method: "DELETE",
        credentials: "include",
      },
    );
    const data = await res.json();

    if (!res.ok) {
      toast.error(data.message || "Unable to delete event");
      return;
    }

    toast.success("Event deleted");
    onEventChange({
      type: "delete",
      eventId: data.eventId,
    });
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>{event?.title}</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Starts: {formatDate(event.startdate)}</p>
          <p>Ends: {formatDate(event.enddate)}</p>

          {event.location && (
            <p>
              <MapPin className="inline" /> {event.location}
            </p>
          )}
          {event?.status === "closed" && (
            <Badge variant="destructive">Closed</Badge>
          )}

          {event?.status === "proposed" && (
            <Badge
              variant="default"
              className="bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-300"
            >
              Open
            </Badge>
          )}
          {event?.status === "confirmed" && (
            <Badge variant="default">Confirmed</Badge>
          )}

          <Button
            variant="ghost"
            onClick={() => setExpandCard((prev) => !prev)}
          >
            {expandCard ? "Show Less" : "More Details"}
            {expandCard ? (
              <ChevronUp data-icon="inline-end"></ChevronUp>
            ) : (
              <ChevronDown data-icon="inline-end"></ChevronDown>
            )}
          </Button>

          <div className="flex gap-2">
            <Button
              variant="outline"
              className={
                userVote === true
                  ? "gap-2 border-green-600 bg-green-50 text-green-700 ring-2 ring-green-200"
                  : ""
              }
              onClick={() => handleVote(true)}
              disabled={votingClosed}
            >
              <ThumbsUp className="h-4 w-4" />
              <span>{event.votes_for}</span>
            </Button>

            <Button
              variant="outline"
              className={
                userVote === false
                  ? " gap-2 border-red-600 bg-red-50 text-red-700 ring-2 ring-red-200"
                  : ""
              }
              onClick={() => handleVote(false)}
              disabled={votingClosed}
            >
              <ThumbsDown className="h-4 w-4" />
              <span>{event.votes_against}</span>
            </Button>
            {!votingClosed && <p>Voting Ends:{formatDate(event.votingends)}</p>}

            {votingClosed && <Badge variant="secondary">Voting Closed</Badge>}
          </div>
          {expandCard && (
            <div>
              <hr />

              <h3>Description</h3>
              <p>{event?.description}</p>

              {event.members?.map((member) => (
                <VoteBadge key={member.id} member={member} />
              ))}
              {isOwner && event.status === "proposed" && (
                <div className="flex gap-2">
                  <EditEventModal event={event} onEventChange={onEventChange} />

                  <Button variant="destructive" onClick={handleDelete}>
                    Delete Event
                  </Button>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </>
  );
}

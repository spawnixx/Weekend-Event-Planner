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
export default function EventCard({ event, onEventChange }) {
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
          Authorization: `Bearer ${localStorage.token}`,
        },
        body: JSON.stringify({
          vote: value,
        }),
      },
    );
    const data = await res.json();

    if (!res.ok) {
      console.log(data);
      return;
    }
    console.log("Vote saved:", data);
    await onEventChange();
  }

  const votingClosed = new Date() > new Date(event.votingends);

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>{event?.title}</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Starts: {formatDate(event.startdate)}</p>
          <p>Ends: {formatDate(event.enddate)}</p>
          <p>Voting Ends:{formatDate(event.votingends)}</p>
          {event.location && (
            <p>
              <MapPin /> {event.location}
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
              variant="ghost"
              onClick={() => handleVote(true)}
              disabled={votingClosed}
            >
              <Badge variant="secondary" className="gap-1">
                <ThumbsUp
                  className="h-4 w-4 text-green-600"
                  fill="currentColor"
                />
                <span>{event.votes_for}</span>
              </Badge>
            </Button>
            <Button
              variant="ghost"
              onClick={() => handleVote(false)}
              disabled={votingClosed}
            >
              <Badge variant="secondary" className="gap-1">
                <ThumbsDown
                  className="h-4 w-4 text-red-600"
                  fill="currentColor"
                />
                {event.votes_against}
              </Badge>
            </Button>
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
            </div>
          )}
        </CardContent>
      </Card>
    </>
  );
}

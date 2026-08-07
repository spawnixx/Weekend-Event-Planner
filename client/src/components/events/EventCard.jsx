import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Trash2,
  ChevronDown,
  ChevronUp,
  Clock,
  MapPin,
  ThumbsDown,
  ThumbsUp,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import VoteBadge from "./VoteBadge";
import EditEventModal from "./EditEventModal";
import { voteOnEvent, deleteEvent } from "@/api/eventApi";
import EventMapDialog from "./EventMapDialog";

export default function EventCard({ event, onEventChange, isOwner }) {
  const { user } = useAuth();
  const [expandCard, setExpandCard] = useState(false);
  const [voting, setVoting] = useState(false);

  const currentMember = event.members?.find((member) => member.id === user?.id);

  const userVote = currentMember?.vote ?? null;

  const votingClosed =
    event.status !== "proposed" || new Date() > new Date(event.votingends);

  const startDate = event.startdate ? new Date(event.startdate) : null;

  const month = startDate
    ? startDate.toLocaleString("en-US", { month: "short" }).toUpperCase()
    : "---";

  const day = startDate
    ? startDate.toLocaleString("en-US", {
        day: "2-digit",
      })
    : "--";

  const weekday = startDate
    ? startDate.toLocaleString("en-US", { weekday: "short" }).toUpperCase()
    : "---";

  const formattedTime = startDate
    ? startDate.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
      })
    : "Time unavailable";

  function formatDate(date) {
    if (!date) return "Not provided";

    return new Date(date).toLocaleString("en-US", {
      dateStyle: "medium",
      timeStyle: "short",
    });
  }

  async function handleVote(value) {
    if (votingClosed || voting) return;

    try {
      setVoting(true);

      const data = await voteOnEvent(event.groupid, event.id, value);

      toast.success(
        data.event?.status === "confirmed" ? "Event confirmed!" : "Vote saved!",
      );

      await onEventChange?.(data.event);
    } catch (err) {
      console.error(err);
      toast.error("Unable to connect to the server");
    } finally {
      setVoting(false);
    }
  }
  async function handleDelete() {
    const confirmed = window.confirm(`Delete "${event.title}"?`);

    if (!confirmed) return;

    try {
      await deleteEvent(event.groupid, event.id);

      toast.success("Event deleted");
      await onEventChange?.();
    } catch (err) {
      console.error(err);
      toast.error(err.message);
    }
  }

  const statusStyles = {
    proposed: "bg-[#FBF2DF] text-[#966412] border-[#E7D5AE]",
    confirmed: "bg-[#E7F2EF] text-[#0F6E5C] border-[#B8D9D1]",
    closed: "bg-[#F1F0EC] text-[#6B6B66] border-[#E4E4E1]",
  };

  const statusLabel = {
    proposed: "Proposed",
    confirmed: "Confirmed",
    closed: "Closed",
  };

  return (
    <Card className="overflow-hidden rounded-xl border-[#E4E4E1] bg-white shadow-none transition-shadow hover:shadow-sm">
      {event.eventimageurl && (
        <div className="aspect-16/7 overflow-hidden">
          <img
            src={event.eventimageurl}
            alt={event.title}
            className="h-full w-full object-cover"
          />
        </div>
      )}

      <CardContent className="p-4 sm:p-5">
        <div className="flex items-start gap-4">
          <div className="flex h-15 w-14 shrink-0 flex-col items-center justify-center rounded-lg border border-[#E4E4E1] bg-[#F1F0EC]">
            <span className="font-mono-ui text-[9px] font-bold uppercase tracking-wider text-[#E8492C]">
              {month}
            </span>

            <span className="font-display mt-0.5 text-xl font-semibold leading-none text-[#17171A]">
              {day}
            </span>

            <span className="font-mono-ui mt-0.5 text-[8px] uppercase tracking-wide text-[#6B6B66]">
              {weekday}
            </span>
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-sm font-semibold text-[#17171A] sm:text-base">
                {event.title}
              </h3>

              <Badge
                variant="outline"
                className={`font-mono-ui rounded px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide ${
                  statusStyles[event.status] ?? statusStyles.closed
                }`}
              >
                {statusLabel[event.status] ?? event.status}
              </Badge>
            </div>

            <div className="mt-2 flex flex-wrap gap-x-4 gap-y-2 text-xs text-[#6B6B66]">
              <span className="flex items-center gap-1">
                <Clock className="h-3.5 w-3.5" />
                {formattedTime}
              </span>

              {event.location && <EventMapDialog event={event} />}
            </div>

            {event.proposer && (
              <p className="mt-2 text-xs text-[#6B6B66]">
                Suggested by{" "}
                <span className="font-medium text-[#17171A]">
                  {event.proposer.name}
                </span>
              </p>
            )}
          </div>
        </div>

        {event.status === "proposed" && (
          <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-[#E4E4E1] pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => handleVote(true)}
              disabled={votingClosed || voting}
              aria-pressed={userVote === true}
              className={
                userVote === true
                  ? "border-[#0F6E5C] bg-[#E7F2EF] text-[#0F6E5C] hover:bg-[#DCECE8]"
                  : "border-[#E4E4E1]"
              }
            >
              <ThumbsUp
                className="h-4 w-4"
                fill={userVote === true ? "currentColor" : "none"}
              />
              {event.votes_for}
            </Button>

            <Button
              type="button"
              variant="outline"
              onClick={() => handleVote(false)}
              disabled={votingClosed || voting}
              aria-pressed={userVote === false}
              className={
                userVote === false
                  ? "border-[#C63A1E] bg-[#FBEAE6] text-[#C63A1E] hover:bg-[#F7DDD7]"
                  : "border-[#E4E4E1]"
              }
            >
              <ThumbsDown
                className="h-4 w-4"
                fill={userVote === false ? "currentColor" : "none"}
              />
              {event.votes_against}
            </Button>

            {votingClosed && (
              <Badge
                variant="secondary"
                className="font-mono-ui text-[10px] uppercase"
              >
                Voting closed
              </Badge>
            )}
            <div>
              <p className="font-mono-ui text-[10px] font-semibold uppercase tracking-wider text-[#6B6B66]">
                Voting ends
              </p>

              <p className="mt-1 text-[#17171A]">
                {formatDate(event.votingends)}
              </p>
            </div>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setExpandCard((previous) => !previous)}
              className="ml-auto text-[#6B6B66]"
            >
              {expandCard ? "Show less" : "Details"}

              {expandCard ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </Button>
          </div>
        )}

        {event.status !== "proposed" && (
          <div className="mt-4 flex justify-end border-t border-[#E4E4E1] pt-4">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setExpandCard((previous) => !previous)}
              className="text-[#6B6B66]"
            >
              {expandCard ? "Show less" : "Details"}

              {expandCard ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </Button>
          </div>
        )}

        {expandCard && (
          <div className="mt-4 space-y-5 border-t border-[#E4E4E1] pt-4">
            <div className="grid gap-4 text-sm sm:grid-cols-2">
              <div>
                <p className="font-mono-ui text-[10px] font-semibold uppercase tracking-wider text-[#6B6B66]">
                  Starts
                </p>

                <p className="mt-1 text-[#17171A]">
                  {formatDate(event.startdate)}
                </p>
              </div>

              <div>
                <p className="font-mono-ui text-[10px] font-semibold uppercase tracking-wider text-[#6B6B66]">
                  Ends
                </p>

                <p className="mt-1 text-[#17171A]">
                  {formatDate(event.enddate)}
                </p>
              </div>

              {event.location && (
                <div>
                  <p className="font-mono-ui text-[10px] font-semibold uppercase tracking-wider text-[#6B6B66]">
                    Location
                  </p>

                  <p className="mt-1 flex items-center gap-1 text-[#17171A]">
                    <MapPin className="h-4 w-4" />
                    {event.location}
                  </p>
                </div>
              )}
            </div>

            <div>
              <p className="font-mono-ui text-[10px] font-semibold uppercase tracking-wider text-[#6B6B66]">
                Description
              </p>

              <p className="mt-2 text-sm leading-6 text-[#17171A]">
                {event.description || "No description provided."}
              </p>
            </div>

            {event.members?.length > 0 && (
              <div>
                <p className="font-mono-ui mb-2 text-[10px] font-semibold uppercase tracking-wider text-[#6B6B66]">
                  Member votes
                </p>

                <div className="flex flex-wrap gap-2">
                  {event.members.map((member) => (
                    <VoteBadge key={member.id} member={member} />
                  ))}
                </div>
              </div>
            )}

            {isOwner && (
              <div className="mt-4 flex gap-2">
                <EditEventModal event={event} onEventChange={onEventChange} />

                <Button
                  variant="outline"
                  onClick={handleDelete}
                  className="
      flex-1
      border-red-200
      text-red-600
      hover:border-red-500
      hover:bg-red-50
    "
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
                </Button>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

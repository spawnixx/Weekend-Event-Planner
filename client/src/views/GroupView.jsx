import EventCard from "@/components/events/EventCard";
import GroupMemberManager from "@/components/groups/GroupMemberManager";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import CreateEventModal from "@/components/events/CreateEventModal";
import {
  Avatar,
  AvatarFallback,
  AvatarGroup,
  AvatarGroupCount,
  AvatarImage,
} from "@/components/ui/avatar";
import EventSection from "@/components/events/EventSection";
import { useAuth } from "@/context/AuthContext";

function GroupView() {
  const { id } = useParams();
  const [group, setGroup] = useState(null);
  const [events, setEvents] = useState([]);
  const { user } = useAuth();

  const currentMember = group?.members?.find(
    (member) => member.id === user?.id,
  );

  const isOwner = currentMember?.role === "owner";

  const proposedEvents = events.filter((event) => event.status === "proposed");
  const confirmedEvents = events.filter(
    (event) => event.status === "confirmed",
  );
  const closedEvents = events.filter((event) => event.status === "closed");

  const fetchEvents = async () => {
    const res = await fetch(`http://localhost:3001/groups/${id}/events`, {
      headers: {
        Authorization: `Bearer ${localStorage.token}`,
      },
    });
    const data = await res.json();

    if (res.ok) {
      setEvents(data.events);
    }
  };
  useEffect(() => {
    fetchEvents();
  }, []);

  useEffect(() => {
    const fetchGroup = async () => {
      const res = await fetch(`http://localhost:3001/groups/${id}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${localStorage.token}`,
        },
      });
      const data = await res.json();
      if (!res.ok) {
        console.log(data);
        return;
      }
      setGroup(data.group);
    };
    fetchGroup();
  }, [id]);

  if (!group) {
    return <p>Loading group...</p>;
  }
  return (
    <div>
      <h1>{group.name}</h1>
      <section>
        <GroupMemberManager
          group={group}
          members={group.members}
          setGroup={setGroup}
          isOwner={isOwner}
        />
      </section>
      <p>Invite Code: {group.invite_code}</p>
      <CreateEventModal onEventCreated={fetchEvents} groupId={id} />
      <EventSection
        title="Confirmed Events"
        events={confirmedEvents}
        emptyMessage="No events have been confirmed yet."
        onEventChange={fetchEvents}
        isOwner={isOwner}
      />
      <EventSection
        title="Proposed Events"
        events={proposedEvents}
        emptyMessage="No events are currently open for voting."
        onEventChange={fetchEvents}
        isOwner={isOwner}
      />

      <EventSection
        title="Past Proposals"
        events={closedEvents}
        emptyMessage="No closed proposals."
        onEventChange={fetchEvents}
        isOwner={isOwner}
      />
    </div>
  );
}

export default GroupView;

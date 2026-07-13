import EventCard from "@/components/events/EventCard";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import CreateEventModal from "@/components/events/CreateEventModal";
function GroupView() {
  const { id } = useParams();
  const [group, setGroup] = useState(null);
  const [events, setEvents] = useState([]);

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
      <p>Invite Code: {group.invite_code}</p>
      <CreateEventModal onEventCreated={fetchEvents} groupId={id} />
      {events.map((event) => (
        <div key={event.id}>
          <EventCard key={event.id} event={event} onEventChange={fetchEvents} />
        </div>
      ))}
    </div>
  );
}

export default GroupView;

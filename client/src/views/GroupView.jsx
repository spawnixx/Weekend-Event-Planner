import GroupMemberManager from "@/components/groups/GroupMemberManager";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  Avatar,
  AvatarFallback,
  AvatarGroup,
  AvatarGroupCount,
  AvatarImage,
} from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import EventSection from "@/components/events/EventSection";
import { useAuth } from "@/context/AuthContext";
import AddEventModal from "@/components/events/AddEventModal";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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
      credentials: "include",
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
        credentials: "include",
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
    <main className="min-h-screen bg-background">
      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 sm:py-10">
        <header className="mb-8">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="font-mono-ui mb-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-primary">
                Group
              </p>

              <h1 className="font-display text-3xl font-semibold tracking-tight">
                {group.name}
              </h1>

              <div className="mt-3 flex flex-wrap items-center gap-3">
                <AvatarGroup>
                  {group.members.slice(0, 4).map((member) => (
                    <Avatar key={member.id}>
                      <AvatarFallback>
                        {member.firstName[0]}
                        {member.lastName[0]}
                      </AvatarFallback>
                    </Avatar>
                  ))}

                  {group.members.length > 4 && (
                    <AvatarGroupCount>
                      +{group.members.length - 4}
                    </AvatarGroupCount>
                  )}
                </AvatarGroup>

                <span className="text-xs text-muted-foreground">
                  <GroupMemberManager
                    group={group}
                    members={group.members}
                    setGroup={setGroup}
                  />
                </span>

                <Badge
                  variant={isOwner ? "default" : "outline"}
                  className="font-mono-ui text-[10px] uppercase tracking-wider"
                >
                  {currentMember?.role}
                </Badge>
              </div>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <AddEventModal
              groupId={id}
              groupEvents={events}
              onEventAdded={fetchEvents}
            />
          </div>
        </header>

        <Tabs defaultValue="proposed" className="mt-10">
          <TabsList className="h-auto w-full justify-start gap-6 rounded-none border-b bg-transparent p-0">
            <TabsTrigger
              value="confirmed"
              className="rounded-none border-b-2 border-transparent px-0 pb-3 data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none"
            >
              Confirmed
              <span className="font-mono-ui ml-1 text-xs text-muted-foreground">
                ({confirmedEvents.length})
              </span>
            </TabsTrigger>

            <TabsTrigger
              value="proposed"
              className="rounded-none border-b-2 border-transparent px-0 pb-3 data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none"
            >
              Proposed
              <span className="font-mono-ui ml-1 text-xs text-muted-foreground">
                ({proposedEvents.length})
              </span>
            </TabsTrigger>

            <TabsTrigger
              value="past"
              className="rounded-none border-b-2 border-transparent px-0 pb-3 data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none"
            >
              Past & canceled
              <span className="font-mono-ui ml-1 text-xs text-muted-foreground">
                ({closedEvents.length})
              </span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="confirmed" className="mt-5">
            <EventSection
              events={confirmedEvents}
              emptyMessage="No confirmed events yet."
              onEventChange={fetchEvents}
              isOwner={isOwner}
            />
          </TabsContent>

          <TabsContent value="proposed" className="mt-5">
            <EventSection
              events={proposedEvents}
              emptyMessage="No events are open for voting."
              onEventChange={fetchEvents}
              isOwner={isOwner}
            />
          </TabsContent>

          <TabsContent value="past" className="mt-5">
            <EventSection
              events={closedEvents}
              emptyMessage="No past proposals."
              onEventChange={fetchEvents}
              isOwner={isOwner}
            />
          </TabsContent>
        </Tabs>
      </div>
    </main>
  );
}

export default GroupView;

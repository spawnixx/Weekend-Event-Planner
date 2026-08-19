import GroupMemberManager from "@/components/groups/GroupMemberManager";
import { useCallback, useEffect, useState } from "react";
import { getGroup, deleteGroup } from "@/api/groupApi";
import { getGroupEvents } from "@/api/eventApi";
import { useParams, useNavigate } from "react-router-dom";
import {
  Avatar,
  AvatarFallback,
  AvatarGroup,
  AvatarGroupCount,
} from "@/components/ui/avatar";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { getAvatarColor } from "@/lib/avatarColors";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import EventSection from "@/components/events/EventSection";
import { useAuth } from "@/context/AuthContext";
import AddEventModal from "@/components/events/AddEventModal";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ArrowLeft, Trash2, Settings, Users } from "lucide-react";

function GroupView() {
  const { id } = useParams();
  const [group, setGroup] = useState(null);
  const [events, setEvents] = useState([]);
  const [membersOpen, setMembersOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  async function handleDeleteGroup() {
    try {
      await deleteGroup(group.id);

      toast.success("Group deleted");
      navigate("/groups");
    } catch (err) {
      console.error(err);
      toast.error(err.message);
    }
  }

  const currentMember = group?.members?.find(
    (member) => member.id === user?.id,
  );

  const isOwner = currentMember?.role === "owner";

  const proposedEvents = events.filter((event) => event.status === "proposed");
  const confirmedEvents = events.filter(
    (event) => event.status === "confirmed",
  );
  const closedEvents = events.filter((event) => event.status === "closed");

  const fetchEvents = useCallback(async () => {
    try {
      const data = await getGroupEvents(id);
      setEvents(data.events);
    } catch (err) {
      console.error("Failed to load events:", err);
    }
  }, [id]);
  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  useEffect(() => {
    const fetchGroup = async () => {
      const data = await getGroup(id);
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
          <div className="mt-6 flex flex-wrap gap-3">
            <Button
              variant="link"
              className="mb-4 px-0 text-muted-foreground"
              onClick={() => navigate("/groups")}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Groups
            </Button>
          </div>
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className=" mb-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-primary">
                Group
              </p>

              <h1 className="font-display text-3xl font-semibold tracking-tight">
                {group.name}
              </h1>
              <div className="mt-3 flex flex-wrap items-center gap-3">
                <AvatarGroup>
                  {group.members.slice(0, 4).map((member) => (
                    <Avatar key={member.id}>
                      <AvatarFallback
                        className={`${getAvatarColor(member.id)} font-semibold`}
                      >
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
                <Badge
                  variant={isOwner ? "default" : "outline"}
                  className=" text-[10px] uppercase tracking-wider"
                >
                  {currentMember?.role}
                </Badge>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm" className="gap-2">
                      <Settings className="h-4 w-4" />
                      Settings
                    </Button>
                  </DropdownMenuTrigger>

                  <DropdownMenuContent align="end" className="w-48">
                    <DropdownMenuItem
                      onSelect={() => setMembersOpen(true)}
                      className="gap-2"
                    >
                      <Users className="h-4 w-4" />
                      {isOwner ? "Manage Members" : "Manage Membership"}
                    </DropdownMenuItem>

                    {isOwner && (
                      <DropdownMenuItem
                        onSelect={() => setDeleteOpen(true)}
                        className="gap-2 text-red-600 focus:text-red-600"
                      >
                        <Trash2 className="h-4 w-4" />
                        Delete Group
                      </DropdownMenuItem>
                    )}
                  </DropdownMenuContent>

                  <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>
                          Delete {group.name}?
                        </AlertDialogTitle>

                        <AlertDialogDescription>
                          This will permanently delete the group, its events,
                          votes, and membership data. This action cannot be
                          undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>

                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>

                        <AlertDialogAction
                          onClick={handleDeleteGroup}
                          className="bg-red-600 text-white hover:bg-red-700"
                        >
                          Delete Group
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </DropdownMenu>
                <GroupMemberManager
                  open={membersOpen}
                  onOpenChange={setMembersOpen}
                  group={group}
                  members={group.members}
                  setGroup={setGroup}
                />
              </div>
            </div>
          </div>
        </header>
        <div>
          <AddEventModal
            groupId={id}
            groupEvents={events}
            onEventAdded={fetchEvents}
          />
        </div>
        <Tabs defaultValue="proposed" className="mt-10">
          <TabsList className="h-auto w-full justify-start gap-6 rounded-none border-b bg-transparent p-0">
            <TabsTrigger
              value="confirmed"
              className="rounded-none border-b-2 border-transparent px-0 pb-3 data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none"
            >
              Confirmed
              <span className=" ml-1 text-xs text-muted-foreground">
                ({confirmedEvents.length})
              </span>
            </TabsTrigger>

            <TabsTrigger
              value="proposed"
              className="rounded-none border-b-2 border-transparent px-0 pb-3 data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none"
            >
              Proposed
              <span className=" ml-1 text-xs text-muted-foreground">
                ({proposedEvents.length})
              </span>
            </TabsTrigger>

            <TabsTrigger
              value="past"
              className="rounded-none border-b-2 border-transparent px-0 pb-3 data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none"
            >
              Past & canceled
              <span className=" ml-1 text-xs text-muted-foreground">
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

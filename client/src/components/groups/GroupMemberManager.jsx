import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { getAvatarColor } from "@/lib/avatarColors";
import { Badge } from "@/components/ui/badge";
import { Trash2, UserRound, Users } from "lucide-react";
import { toast } from "sonner";

function getInitials(member) {
  const firstInitial = member.firstName?.[0] ?? "";
  const lastInitial = member.lastName?.[0] ?? "";

  return `${firstInitial}${lastInitial}`.toUpperCase();
}

export default function GroupMemberManager({ group, setGroup, members = [] }) {
  const { user } = useAuth();

  const [removingMemberId, setRemovingMemberId] = useState(null);

  const currentMember = members.find((member) => member?.id === user?.id);

  const isOwner = currentMember?.role === "owner";

  async function handleRemoveMember(memberId) {
    if (!group?.id || !memberId) {
      toast.error("Missing group or member information");
      return;
    }

    try {
      setRemovingMemberId(memberId);

      const res = await fetch(
        `http://localhost:3001/groups/${group.id}/members/${memberId}`,
        {
          method: "DELETE",
          credentials: "include",
        },
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(
          data.error?.message || data.message || "Unable to remove member",
        );
      }

      setGroup((currentGroup) => ({
        ...currentGroup,
        members: (currentGroup.members ?? []).filter(
          (member) => member.id !== memberId,
        ),
      }));

      toast.success("Member removed");
    } catch (err) {
      console.error(err);
      toast.error(err.message);
    } finally {
      setRemovingMemberId(null);
    }
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" className="gap-2">
          <Users className="h-4 w-4" />
          Members
          <span className="font-mono-ui text-xs text-muted-foreground">
            {members.length}
          </span>
        </Button>
      </PopoverTrigger>

      <PopoverContent align="end" className="w-[340px] border-[#E4E4E1] p-0">
        <div className="border-b border-[#E4E4E1] px-4 py-3">
          <h3 className="font-display text-lg font-semibold">Group members</h3>

          <p className="mt-1 text-xs text-muted-foreground">
            {members.length} {members.length === 1 ? "member" : "members"} in
            this group
          </p>
        </div>

        <div className="max-h-80 overflow-y-auto p-2">
          {members.length === 0 ? (
            <div className="flex flex-col items-center px-4 py-8 text-center">
              <UserRound className="mb-2 h-5 w-5 text-muted-foreground" />

              <p className="text-sm text-muted-foreground">
                No group members found.
              </p>
            </div>
          ) : (
            <ul className="space-y-1">
              {members.map((member) => {
                const isRemoving = removingMemberId === member.id;

                const canRemove =
                  isOwner && member.role !== "owner" && member.id !== user?.id;

                return (
                  <li
                    key={member.id}
                    className="flex items-center gap-3 rounded-lg px-2 py-2 transition-colors hover:bg-[#F1F0EC]"
                  >
                    <Avatar className="h-9 w-9">
                      <AvatarFallback
                        className={`${getAvatarColor(member.id)} font-semibold`}
                      >
                        {getInitials(member)}
                      </AvatarFallback>
                    </Avatar>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <p className="truncate text-sm font-semibold">
                          {member.firstName} {member.lastName}
                        </p>

                        {member.id === user?.id && (
                          <span className="text-xs text-muted-foreground">
                            You
                          </span>
                        )}
                      </div>

                      {member.email && (
                        <p className="truncate text-xs text-muted-foreground">
                          {member.email}
                        </p>
                      )}
                    </div>

                    <div className="flex shrink-0 items-center gap-2">
                      <Badge
                        variant={
                          member.role === "owner" ? "default" : "outline"
                        }
                        className={
                          member.role === "owner"
                            ? "font-mono-ui bg-[#E8492C] text-[9px] uppercase tracking-wider text-white"
                            : "font-mono-ui text-[9px] uppercase tracking-wider text-muted-foreground"
                        }
                      >
                        {member.role}
                      </Badge>

                      {canRemove && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          aria-label={`Remove ${member.firstName} ${member.lastName}`}
                          disabled={isRemoving}
                          onClick={() => handleRemoveMember(member.id)}
                          className="h-8 w-8 text-muted-foreground hover:bg-[#FBEAE6] hover:text-[#C63A1E]"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        {!isOwner && (
          <div className="border-t border-[#E4E4E1] px-4 py-3">
            <p className="text-xs text-muted-foreground">
              Only the group owner can remove members.
            </p>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
}

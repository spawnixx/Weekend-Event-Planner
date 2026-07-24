import { useAuth } from "@/context/AuthContext";
import { useState } from "react";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import { toast } from "sonner";

export default function GroupMemberManager({ group, setGroup, members = [] }) {
  const { user } = useAuth();

  const [error, setError] = useState("");
  const [removingMemberId, setRemovingMemberId] = useState(null);
  const currentMember = members.find((member) => member?.id === user?.id);
  const isOwner = currentMember?.role === "owner";

  const handleRemoveMember = async (memberId) => {
    if (!group.id || !memberId) {
      setError("Missing group or member information");
      return;
    }
    try {
      setError("");
      setRemovingMemberId(memberId);

      const res = await fetch(
        `http://localhost:3001/groups/${group.id}/members/${memberId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${localStorage.token}`,
          },
        },
      );
      const data = await res.json();
      toast.success("User removed");
      if (!res.ok) {
        toast.error(data.error);
        throw new Error(data.error?.message || "Unable to remove member");
      }
      setGroup((currentGroup) => ({
        ...currentGroup,
        members: (currentGroup.members ?? []).filter(
          (member) => member?.id !== memberId,
        ),
      }));
    } catch (err) {
      setError(err.message);
    } finally {
      setRemovingMemberId(null);
    }
  };

  return (
    <section className="grid gap-4 md:grid-cols-8">
      {error && <p>{error}</p>}
      <ul>
        {members.map((member) => {
          const isRemoving = removingMemberId === member.id;
          const canRemove =
            isOwner && member.role !== "owner" && member.id !== user?.id;

          return (
            <li key={member.id}>
              <Card>
                <strong>
                  {member.firstName} {member.lastName[0]}
                </strong>

                {canRemove && (
                  <Button
                    onClick={() => handleRemoveMember(member.id)}
                    disabled={isRemoving}
                  >
                    {isRemoving ? "Removing..." : "Remove"}
                  </Button>
                )}
              </Card>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

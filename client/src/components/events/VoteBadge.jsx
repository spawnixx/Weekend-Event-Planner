import { Avatar, AvatarFallback } from "@/components/ui/avatar";
export default function VoteBadge({ member }) {
  let fallbackColor = "bg-gray-300 text-gray-900";
  let avatarColor = " border-2 border-gray-400";

  fallbackColor =
    member.vote === true
      ? "bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-300"
      : member.vote === false
        ? "bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-300"
        : "bg-gray-300 text-gray-900";

  avatarColor =
    member.vote === true
      ? "border-2 border-green-500"
      : member.vote === false
        ? "border-2 border-red-500"
        : "border-2 border-gray-400";

  return (
    <Avatar title={member.name} className={avatarColor}>
      <AvatarFallback className={fallbackColor}>
        {member.initials}
      </AvatarFallback>
    </Avatar>
  );
}

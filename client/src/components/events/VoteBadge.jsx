import { Avatar, AvatarFallback } from "@/components/ui/avatar";
export default function VoteBadge({ member }) {
  let fallbackColor = "bg-gray-300 text-gray-900";
  let avatarColor = " border-2 border-gray-400";

  if (member.vote === true) {
    fallbackColor =
      "bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-300";
    avatarColor = " border-2 border-green-500";
  }

  if (member.vote === false) {
    fallbackColor = "bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-300";
    avatarColor = " border-2 border-red-500";
  }

  return (
    <Avatar title={member.name} className={avatarColor}>
      <AvatarFallback className={fallbackColor}>
        {member.initials}
      </AvatarFallback>
    </Avatar>
  );
}

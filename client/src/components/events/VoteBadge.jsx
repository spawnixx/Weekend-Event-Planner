import { Avatar, AvatarFallback } from "@/components/ui/avatar";
export default function VoteBadge({ member }) {
  let color = "bg-gray-300 text-gray-900";

  if (member.vote === true) {
    color = "bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-300";
  }

  if (member.vote === false) {
    color = "bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-300";
  }

  return (
    <Avatar
      title={`${member.name}`}
      className={`border-2 ${
        member.vote === true
          ? "border-green-500"
          : member.vote === false
            ? "border-red-500"
            : "border-gray-400"
      }`}
    >
      <AvatarFallback className={`${color} `}>{member.initials}</AvatarFallback>
    </Avatar>
  );
}

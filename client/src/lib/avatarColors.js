const avatarColors = [
  "bg-[#FBEAE6] text-[#C63A1E]", // coral
  "bg-[#E7F2EF] text-[#0F6E5C]", // teal
  "bg-[#FBF2DF] text-[#966412]", // gold
  "bg-[#EEEAFB] text-[#5A47B8]", // lavender
  "bg-[#E6F1FB] text-[#1F5E9C]", // blue
  "bg-[#F8EAF5] text-[#A4377B]", // rose
  "bg-[#EAF6EF] text-[#2F7D4F]", // green
  "bg-[#F2EEF9] text-[#6D46B2]", // purple
];

export function getAvatarColor(id) {
  return avatarColors[id % avatarColors.length];
}

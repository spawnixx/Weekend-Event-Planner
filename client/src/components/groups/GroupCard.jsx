import { useNavigate } from "react-router-dom";

export default function GroupCard({ group }) {
  const navigate = useNavigate();
  return (
    <div onClick={() => navigate(`/groups/${group.id}`)}>
      <h2>{group.name}</h2>
      <p>Invite Code: {group.invite_code}</p>
    </div>
  );
}

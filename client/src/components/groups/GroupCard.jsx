import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function GroupCard({ group }) {
  const navigate = useNavigate();
  return (
    <div onClick={() => navigate(`/groups/${group.id}`)}>
      <Card>
        <CardHeader>
          <CardTitle>{group?.name}</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Invite Code:{group?.invite_code}</p>
        </CardContent>
      </Card>
    </div>
  );
}

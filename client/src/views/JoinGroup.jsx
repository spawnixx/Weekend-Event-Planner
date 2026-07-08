import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
function JoinGroup() {
  const { inviteCode } = useParams();
  const [group, setGroup] = useState(null);
  const [message, setMessage] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchInvite() {
      const res = await fetch(
        `http://localhost:3001/groups/invite/${inviteCode}`,
      );

      const data = await res.json();

      if (!res.ok) {
        setMessage(data.error.message);
        return;
      }

      setGroup(data.group);
    }

    fetchInvite();
  }, [inviteCode]);

  const handleJoin = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      localStorage.setItem("pendingInvite", inviteCode);
      navigate("/register");
      return;
    }

    const res = await fetch(
      `http://localhost:3001/groups/invite/${inviteCode}`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    const data = await res.json();

    if (!res.ok) {
      setMessage(data.error.message);
      return;
    }

    console.log("Joined:", data);
    localStorage.removeItem("pendingInvite");
    navigate(`/groups/${data.group.id}`);
  };

  if (message) {
    return (
      <div>
        <h1>{message}</h1>
        <Button onClick={() => navigate("/groups")}>Back to Groups</Button>
      </div>
    );
  }
  if (!group) {
    return <p>Loading invite...</p>;
  }
  return (
    <div>
      <h1>You're invited!</h1>
      <h2>{group.name}</h2>

      <Button variant="outline" onClick={handleJoin}>
        Join Group
      </Button>
    </div>
  );
}

export default JoinGroup;

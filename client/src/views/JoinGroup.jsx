import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
function JoinGroup() {
  const { inviteCode } = useParams();
  const { isAuthenticated, loading } = useAuth();

  const [group, setGroup] = useState(null);
  const [message, setMessage] = useState(null);
  const [joining, setJoining] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    async function fetchInvite() {
      try {
        const res = await fetch(
          `http://localhost:3001/groups/invite/${inviteCode}`,
        );

        const data = await res.json();

        if (!res.ok) {
          setMessage(
            data.error?.message || data.message || "Unable to load invite",
          );
          return;
        }

        setGroup(data.group);
      } catch (err) {
        console.error(err);
        setMessage("Unable to connect to the server");
      }
    }

    fetchInvite();
  }, [inviteCode]);

  const handleJoin = async () => {
    if (loading) return;

    if (!isAuthenticated) {
      localStorage.setItem("pendingInvite", inviteCode);
      navigate("/register");
      return;
    }

    try {
      setJoining(true);
      setMessage(null);

      const res = await fetch(
        `http://localhost:3001/groups/invite/${inviteCode}`,
        {
          method: "POST",
          credentials: "include",
        },
      );

      const data = await res.json();

      if (!res.ok) {
        setMessage(
          data.error?.message || data.message || "Unable to join group",
        );
        return;
      }

      localStorage.removeItem("pendingInvite");
      navigate(`/groups/${data.group.id}`);
    } catch (err) {
      console.error(err);
      setMessage("Unable to connect to the server");
    } finally {
      setJoining(false);
    }
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

import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
function GroupView() {
  const { id } = useParams();
  const [group, setGroup] = useState(null);
  useEffect(() => {
    const fetchGroup = async () => {
      const token = localStorage.getItem("token");
      const res = await fetch(`http://localhost:3001/groups/${id}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      if (!res.ok) {
        console.log(data);
        return;
      }
      setGroup(data.group);
    };
    fetchGroup();
  }, [id]);
  if (!group) {
    return <p>Loading group...</p>;
  }
  return (
    <div>
      <h1>{group.name}</h1>
      <p>Invite Code: {group.invite_code}</p>
    </div>
  );
}

export default GroupView;

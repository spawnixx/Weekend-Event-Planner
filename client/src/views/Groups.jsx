import JoinGroupModal from "@/components/groups/JoinGroupModal";
import CreateGroupModal from "../components/groups/CreateGroupModal";
import { useEffect, useState } from "react";
import GroupCard from "@/components/groups/GroupCard";
function Groups() {
  const [groups, setGroups] = useState([]);

  const fetchGroups = async () => {
    const token = localStorage.getItem("token");
    const res = await fetch("http://localhost:3001/groups", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const data = await res.json();
    // console.log("Groups response:", data);
    setGroups(data.groups);
  };
  useEffect(() => {
    fetchGroups();
  }, []);
  if (!groups) {
    return <p>Loading Groups...</p>;
  }
  return (
    <>
      <h1>Groups</h1>
      <CreateGroupModal onGroupChange={fetchGroups} />
      <JoinGroupModal onGroupChange={fetchGroups} />

      {groups.map((group) => (
        <GroupCard key={group.id} group={group} />
      ))}
    </>
    /*

    <ProfileWidget />
    <CreateGroupButton /> IMPLEMENTED
    <JoinGroupButton />   IMPLEMENTED
    <BrowseEventsButton />
    <GroupList>           IMPLEMENTED
        <GroupCard />     IMPLEMENTED NEEDS SHADCN COMPONENT/STYLING
        ...
        ...
    
    */
  );
}

export default Groups;

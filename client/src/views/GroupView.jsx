import { useParams } from "react-router-dom";

function GroupView() {
  const { id } = useParams();

  return (
    <div>
      <h1>Group View</h1>
      <p>Group ID: {id}</p>
    </div>
  );
}

export default GroupView;

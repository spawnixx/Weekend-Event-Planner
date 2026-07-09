export default function EventCard({ events }) {
  return (
    <>
      <h2>{events?.title}</h2>
      <p>{events?.startDate}</p>
      <p>{events?.endDate}</p>
      <p>{events?.description}</p>
    </>
  );
}

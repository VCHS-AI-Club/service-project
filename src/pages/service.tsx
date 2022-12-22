import { OppCard } from "../components/Opp";
import { trpc } from "../utils/trpc";

export default function ServicePage() {
  const { data: opps, error, isLoading } = trpc.opp.upcoming.useQuery();

  const addOpp = trpc.opp.add.useMutation().mutateAsync;

  if (isLoading) {
    return <div>Loading...</div>;
  }
  if (error) {
    return <div>{error.message}</div>;
  }
  if (!opps) {
    return <div>No opps</div>;
  }

  const oneDayAgo = new Date();
  oneDayAgo.setDate(oneDayAgo.getDate() - 1);

  return (
    <div className="px-36">
      <h1 className="py-8 text-3xl">Service Opportunities</h1>
      <ul className="flex flex-col gap-8">
        {opps.map((opp) => (
          <OppCard
            opp={opp}
            key={opp.id}
            new_={opp.createdAt > oneDayAgo}
            action={addOpp}
            actionText="Add"
          />
        ))}
      </ul>
    </div>
  );
}

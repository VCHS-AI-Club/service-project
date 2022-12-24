import { OppCard } from "../components/opp/OppCard";
import { Button, Container, H1 } from "../components/ui";
import { trpc } from "../utils/trpc";

export default function ServicePage() {
  const { data: opps, error, isLoading } = trpc.opp.upcoming.useQuery();

  const utils = trpc.useContext();
  // utils.opp.upcoming.setDAta();

  const addOpp = trpc.opp.add.useMutation({
    onMutate: (addedOpp) => {
      utils.opp.upcoming.setData(undefined, (oldData) => {
        return oldData ? oldData.filter((o) => o.id !== addedOpp.id) : [];
      });
    },
  }).mutateAsync;

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
    <Container>
      <H1>Service Opportunities</H1>
      <ul className="flex flex-col gap-8">
        {opps.map((opp) => (
          <OppCard
            opp={opp}
            key={opp.id}
            new_={opp.createdAt > oneDayAgo}
            action={
              <Button variant="primary" onClick={() => addOpp({ id: opp.id })}>
                Add
              </Button>
            }
          />
        ))}
      </ul>
    </Container>
  );
}

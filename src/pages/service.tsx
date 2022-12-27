import { type GetServerSideProps } from "next";
import { useSession } from "next-auth/react";
import { useState } from "react";
import InterestsModal from "../components/InterestsModal";
import { OppCard } from "../components/opp/OppCard";
import SignIn from "../components/SignIn";
import { Button, Container, H1 } from "../components/ui";
import { getServerAuthSession } from "../server/get-server-auth-session";
import { trpc } from "../utils/trpc";

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const session = await getServerAuthSession(ctx);

  return {
    props: { session },
  };
};
export default function ServicePage() {
  const { data: session } = useSession();
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

  const [modalOpen, setModalOpen] = useState(true);

  const { data: interests, isLoading: interestsLoading } =
    trpc.user.interests.useQuery();

  if (!session) {
    return <SignIn />;
  }

  if (isLoading || interestsLoading) {
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
      {!interests && (
        <InterestsModal
          open={modalOpen}
          setOpen={setModalOpen}
          interests={interests}
        />
      )}
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

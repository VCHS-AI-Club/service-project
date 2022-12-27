import { type GetServerSideProps } from "next";
import { useSession } from "next-auth/react";
import { useState } from "react";
import InterestsModal from "../components/InterestsModal";
import { OppCard } from "../components/opp/OppCard";
import OppCardSkeleton from "../components/opp/OppCardSkeleton";
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

  const { data: interests, isLoading: isInterestsLoading } =
    trpc.user.interests.useQuery();

  const addOpp = trpc.opp.add.useMutation({
    onMutate: (addedOpp) => {
      utils.opp.upcoming.setData(undefined, (oldData) => {
        return oldData ? oldData.filter((o) => o.id !== addedOpp.id) : [];
      });
    },
  }).mutateAsync;

  const [modalOpen, setModalOpen] = useState(true);

  if (!session) {
    return <SignIn />;
  }

  if (error) {
    return <div>{error.message}</div>;
  }

  const oneDayAgo = new Date();
  oneDayAgo.setDate(oneDayAgo.getDate() - 1);

  return (
    <Container>
      {!interests && (
        <InterestsModal
          open={modalOpen && !isInterestsLoading}
          setOpen={setModalOpen}
          interests={interests}
        />
      )}
      <H1>Service Opportunities</H1>
      <ul className="flex flex-col gap-8">
        {isLoading || isInterestsLoading ? (
          <OppCardSkeleton />
        ) : (
          opps.map((opp) => (
            <OppCard
              opp={opp}
              key={opp.id}
              new_={opp.createdAt > oneDayAgo}
              action={
                <Button
                  variant="primary"
                  onClick={() => addOpp({ id: opp.id })}
                >
                  Add
                </Button>
              }
            />
          ))
        )}
      </ul>
    </Container>
  );
}

import type { GetServerSideProps } from "next";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { OppCard } from "../../components/opp/OppCard";
import { Button, Container, H1 } from "../../components/ui";
import { getServerAuthSession } from "../../server/get-server-auth-session";
import { trpc } from "../../utils/trpc";

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const session = await getServerAuthSession(ctx);
  return {
    props: { session },
  };
};

const EditPage = () => {
  const { data: session } = useSession();

  const { data: opps } = trpc.opp.all.useQuery();
  const utils = trpc.useContext();
  const deleteMutation = trpc.opp.delete.useMutation({
    onMutate: (deletedOpp) => {
      utils.opp.all.setData(undefined, (oldData) => {
        return oldData?.filter((opp) => opp.id !== deletedOpp.id);
      });
    },
  }).mutateAsync;

  if (session && session.user?.role !== "ADMIN") {
    return <div>Not authorized</div>;
  }

  return (
    <Container>
      <H1>Manage Service Opportunities</H1>
      <ul className="flex flex-col gap-4">
        {opps?.map((opp) => (
          <OppCard
            opp={opp}
            key={opp.id}
            new_={false}
            action={
              <div className="flex items-center gap-2">
                <Button variant="secondary">
                  <Link href={`/edit/${opp.id}`}>Edit</Link>{" "}
                </Button>
                <Button
                  variant="danger"
                  onClick={() => deleteMutation({ id: opp.id })}
                >
                  Delete
                </Button>
              </div>
            }
          />
        ))}
      </ul>
    </Container>
  );
};

export default EditPage;

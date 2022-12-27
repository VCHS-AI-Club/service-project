import { type GetServerSideProps } from "next";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useState } from "react";
import InterestsModal from "../components/InterestsModal";
import { OppCard } from "../components/opp/OppCard";
import SignIn from "../components/SignIn";
import { Button, Container, H2 } from "../components/ui";
import { getServerAuthSession } from "../server/get-server-auth-session";
import { trpc } from "../utils/trpc";

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const session = await getServerAuthSession(ctx);

  return {
    props: { session },
  };
};

const Star: React.FC<{ title: string; on?: boolean; onClick: () => void }> = ({
  title,
  on,
  onClick,
}) => {
  return (
    <svg
      aria-hidden="true"
      className={"h-5 w-5 " + (on ? "text-yellow-400" : "text-gray-500")}
      fill="currentColor"
      viewBox="0 0 20 20"
      xmlns="http://www.w3.org/2000/svg"
      onClick={() => onClick()}
    >
      <title>{title}</title>
      <path
        className={on ? "text-indigo-600" : "text-gray-400"}
        d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
      ></path>
    </svg>
  );
};

const Rating: React.FC<{
  currentRating: number;
  onClick: (i: number) => void;
}> = ({ onClick, currentRating }) => {
  return (
    <div className="flex sm:gap-1 md:gap-2">
      <Star title="1 star" on={currentRating >= 1} onClick={() => onClick(1)} />
      <Star title="2 star" on={currentRating >= 2} onClick={() => onClick(2)} />
      <Star title="3 star" on={currentRating >= 3} onClick={() => onClick(3)} />
      <Star title="4 star" on={currentRating >= 4} onClick={() => onClick(4)} />
      <Star title="5 star" on={currentRating >= 5} onClick={() => onClick(5)} />
    </div>
  );
};

export default function DashboardPage() {
  const { data: session } = useSession();
  const utils = trpc.useContext();
  const [modalOpen, setModalOpen] = useState(true);

  // TODO: merge into 1 query
  const { data: upcomingUserOpps } = trpc.opp.userUpcoming.useQuery();
  const { data: pastUserOpps } = trpc.opp.userPast.useQuery();
  const removeOpp = trpc.opp.remove.useMutation({
    onMutate: (deletedOpp) => {
      utils.opp.userUpcoming.setData(undefined, (oldData) => {
        return oldData ? oldData.filter((o) => o.opp.id !== deletedOpp.id) : [];
      });
    },
  }).mutateAsync;

  const rateOpp = trpc.opp.rate.useMutation({
    onMutate: (ratedOpp) => {
      utils.opp.userPast.setData(undefined, (oldData) => {
        console.log("oldData", oldData);

        return oldData
          ? oldData.map((assoc) => {
              if (assoc.opp.id === ratedOpp.oppId) {
                return { ...assoc, rating: ratedOpp.rating };
              }
              return assoc;
            })
          : [];
      });
    },
  }).mutateAsync;

  const { data: interests, isLoading } = trpc.user.interests.useQuery();

  if (!session?.user) {
    return <SignIn />;
  }

  if (isLoading) {
    return null;
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
      <H2>Upcoming</H2>
      <ul className="flex flex-col gap-8">
        {upcomingUserOpps?.length ? (
          upcomingUserOpps.map(({ opp }) => (
            <OppCard
              opp={opp}
              key={opp.id}
              new_={opp.createdAt > oneDayAgo}
              action={
                <Button
                  variant="danger"
                  onClick={() => removeOpp({ id: opp.id })}
                >
                  Remove
                </Button>
              }
            />
          ))
        ) : (
          <p>
            No upcoming opportunities, you can add some{" "}
            <Link className="text-indigo-600" href="/service">
              here
            </Link>
            .
          </p>
        )}
      </ul>
      <H2>Past</H2>
      <ul className="flex flex-col gap-8">
        {pastUserOpps &&
          pastUserOpps.map(({ opp, rating }) => {
            const currentRating = rating ?? 0;
            return (
              <OppCard
                opp={opp}
                key={opp.id}
                // new_={opp.createdAt > oneDayAgo}
                new_={opp.end > oneDayAgo}
                action={
                  <Rating
                    onClick={(r) => rateOpp({ oppId: opp.id, rating: r })}
                    currentRating={currentRating}
                  />
                }
              />
            );
          })}
      </ul>
    </Container>
  );
}

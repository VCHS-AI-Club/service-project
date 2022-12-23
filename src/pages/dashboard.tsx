import { type GetServerSideProps } from "next";
import { useSession } from "next-auth/react";
import { OppCard } from "../components/opp/Opp";
import { getServerAuthSession } from "../server/get-server-auth-session";
import { trpc } from "../utils/trpc";

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
      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
    </svg>
  );
};
export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const session = await getServerAuthSession(ctx);

  return {
    props: { session },
  };
};

export default function DashboardPage() {
  const { data: session } = useSession();
  const utils = trpc.useContext();

  // TODO: merge into 1 query
  const { data: upcomingUserOpps } = trpc.opp.userUpcoming.useQuery();
  const { data: pastUserOpps } = trpc.opp.userPast.useQuery();
  const deleteOpp = trpc.opp.remove.useMutation({
    onMutate: (deletedOpp) => {
      utils.opp.userUpcoming.setData(undefined, (oldData) => {
        return oldData ? oldData.filter((o) => o.opp.id !== deletedOpp.id) : [];
      });
    },
  }).mutateAsync;

  const rateOpp = trpc.opp.rate.useMutation({
    onMutate: (ratedOpp) => {
      utils.opp.userPast.setData(undefined, (oldData) => {
        console.log("rated", ratedOpp);
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

  if (!session?.user) {
    return <div>Not logged in</div>;
  }

  return (
    <div className="px-36">
      <h1 className="py-8 text-center text-3xl font-bold">Dashboard</h1>

      <h2 className="pb-4 text-center text-2xl font-bold">Upcoming</h2>
      <ul className="flex flex-col gap-8">
        {upcomingUserOpps &&
          upcomingUserOpps.map(({ opp }) => (
            <OppCard
              opp={opp}
              key={opp.id}
              // new_={opp.createdAt > oneDayAgo}
              new_={false} // TODO
              action={
                <button onClick={() => deleteOpp({ id: opp.id })}>
                  Delete
                </button>
              }
            />
          ))}
      </ul>
      <h2 className="py-4 text-center text-2xl font-bold">Past</h2>
      <ul className="flex flex-col gap-8">
        {pastUserOpps &&
          pastUserOpps.map(({ opp, rating }) => {
            const currentRating = rating ?? 0;
            return (
              <OppCard
                opp={opp}
                key={opp.id}
                // new_={opp.createdAt > oneDayAgo}
                new_={false} // TODO
                action={
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <Star
                        key={i}
                        on={currentRating >= i}
                        onClick={() => rateOpp({ oppId: opp.id, rating: i })}
                        title={`${i}`}
                      />
                    ))}
                  </div>
                }
              />
            );
          })}
      </ul>
    </div>
  );
}

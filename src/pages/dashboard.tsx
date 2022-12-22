import { useSession } from "next-auth/react";
import { OppCard } from "../components/Opp";
import { trpc } from "../utils/trpc";

export default function DashboardPage() {
  const { data: session } = useSession();

  // TODO: merge into 1 query
  const { data: upcomingUserOpps } = trpc.opp.userUpcoming.useQuery();
  const { data: pastUserOpps } = trpc.opp.userPast.useQuery();
  const deleteOpp = trpc.opp.delete.useMutation().mutateAsync;

  if (!session?.user) {
    return <div>Not logged in</div>;
  }

  return (
    <div>
      <h1>Dashboard</h1>

      <h2>Upcoming</h2>
      <ul className="flex flex-col gap-8">
        {upcomingUserOpps &&
          upcomingUserOpps.map(({ opp }) => (
            <OppCard
              opp={opp}
              key={opp.id}
              // new_={opp.createdAt > oneDayAgo}
              new_={false} // TODO
              action={deleteOpp}
              actionText="Delete"
            />
          ))}
      </ul>
      <h2>Past</h2>
      <ul className="flex flex-col gap-8">
        {pastUserOpps &&
          pastUserOpps.map(({ opp }) => (
            <OppCard
              opp={opp}
              key={opp.id}
              // new_={opp.createdAt > oneDayAgo}
              new_={false} // TODO
              // action={deleteOpp}
              actionText="Rate"
              action={async ({ id }) => console.log(id)}
            />
          ))}
      </ul>
    </div>
  );
}

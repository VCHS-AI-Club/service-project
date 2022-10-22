import { useQuery } from "@tanstack/react-query";
import { GetServerSideProps } from "next";
import { unstable_getServerSession } from "next-auth";
import { useSession } from "next-auth/react";
import React, { LegacyRef } from "react";
import { authOptions } from "./api/auth/[...nextauth]";
import { partition } from "../utils";
import {
  RemoveableOppCard,
  RateableOppCard,
  type Opp,
  type RateableOpp,
} from "../components/OppCard";
import { getRateableOpps } from "../api";
import { useAutoAnimate } from "@formkit/auto-animate/react";

export default function DashboardPage(props: { opps: RateableOpp[] | null }) {
  const { data: session } = useSession();
  const user = session?.user;

  const { data: ratedOpps, isLoading, isError } = useQuery<RateableOpp[] | null, Error>(
    ["rateable opps"],
    () => {
      console.log("quering ratealbe opps");
      return getRateableOpps(user?.id)
    },
    { initialData: props.opps }
  );

  const [animationParent] = useAutoAnimate()

  if (!session || !user) {
    return <div>Please Login</div>;
  }
  console.log("opps", ratedOpps)

  const now = Date.now();

  ratedOpps?.sort((a, b) => a.end - b.end)
  const [upcoming, past] = partition(
    ratedOpps || [],
    (o: Opp) => o.start * 1000 > now

  );
  if (isLoading) return <div>Loading</div>
  if (isError) return <div>Error</div>

  return (
    <div className="flex flex-col items-center">
      <h1>Dashboard</h1>
      <h2>Upcoming</h2>
      <div>
        <ul ref={animationParent as LegacyRef<HTMLUListElement>}>

          {upcoming &&
            upcoming.map((opp) => <RemoveableOppCard opp={opp} key={opp.id} />)}
        </ul>
      </div>
      <h2>Past</h2>
      <div>
        <ul ref={animationParent as LegacyRef<HTMLUListElement>}>
          Pase
          {past && past.map((opp) => <RateableOppCard opp={opp} key={opp.id} />)}
        </ul>
      </div>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const session = await unstable_getServerSession(
    ctx.req,
    ctx.res,
    authOptions
  );

  let opps: Opp[] | null = null;
  console.log("session", session)
  try {
    opps = await getRateableOpps(session?.user?.id);
  } catch (err) {
    console.log(err);
    throw new Error("Error fetching rated opps")
  }
  console.log("opps", opps)
  return { props: { session, opps } };
};

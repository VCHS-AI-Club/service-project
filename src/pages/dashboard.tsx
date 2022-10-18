import { useMutation, useQuery } from "@tanstack/react-query";
import { GetServerSideProps } from "next";
import { unstable_getServerSession } from "next-auth";
import { useSession } from "next-auth/react";
import React from "react";
import {
  ServiceCard,
  type Opp,
  type RateableOpp,
} from "../components/SereviceOpp";
import { env } from "../env/client.mjs";
import { env as serverEnv } from "../env/server.mjs";
import { authOptions } from "./api/auth/[...nextauth]";
import { partition } from "../utils";

export default (props: { opps: RateableOpp[] | null }) => {
  const { data: session } = useSession();
  const user = session?.user;
  if (!session || !user) {
    return <div>Please Login</div>;
  }

  const {
    isLoading,
    error,
    data: opps,
  } = useQuery<RateableOpp[] | null, Error>(
    ["user.opps"],
    async (): Promise<RateableOpp[]> => {
      const res = await fetch(
        env.NEXT_PUBLIC_API_URL + `/user/${session.user?.id}/opps`
      );
      const arr = (await res.json()) as RateableOpp[];
      return arr;
    },
    { initialData: props.opps }
  );

  const { mutate } = useMutation<
    Response,
    Error,
    { opp_id: number; rating: number },
    Response
  >(
    ["user.opps"],
    async ({ opp_id, rating }) => {
      console.log("Rating", opp_id, "with", rating);

      return await fetch(env.NEXT_PUBLIC_API_URL + `/opp/${opp_id}/rate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: user.id, rating }),
      });
    },
  );

  console.log("opps", opps);
  const now = Date.now();
  const [upcoming, past] = partition(
    opps || [],
    (o: Opp) => o.start * 1000 > now
  );

  return (
    <div className="flex flex-col items-center">
      <h1>Dashboard</h1>
      <h2>Upcoming</h2>
      <div>
        {upcoming &&
          upcoming.map((opp) => <ServiceCard opp={opp} key={opp.id} />)}
      </div>
      <h2>Past</h2>
      <div>
        {past &&
          past.map((opp) => (
            <ServiceCard
              opp={opp}
              key={opp.id}
              rateable
              initialRating={opp.rating || undefined}
              mutate={(rating) => mutate({ opp_id: opp.id, rating })}
            />
          ))}
      </div>
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await unstable_getServerSession(
    context.req,
    context.res,
    authOptions
  );

  let opps: Opp[] | null = null;
  try {
    const res = await fetch(
      serverEnv.API_URL + `/user/${session?.user?.id}/opps`
    );
    opps = (await res.json()) as RateableOpp[];
  } catch (err) {
    console.log(err);
  }
  return { props: { session, opps } };
};

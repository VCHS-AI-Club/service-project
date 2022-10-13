import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { GetServerSideProps, NextPage } from "next";
import { Session, unstable_getServerSession } from "next-auth";
import { getSession, useSession } from "next-auth/react";
import Link from "next/link";
import React, { useMemo, useState } from "react";
import { InterestModal, Interests } from "../components/InterestsModal";
import { ServiceCard, type Opp } from "../components/SereviceOpp";
import { env } from "../env/client.mjs";
import { env as serverEnv } from "../env/server.mjs";
import { authOptions } from "./api/auth/[...nextauth]";

export const DashboardPage: NextPage = () => {
  const { data: session } = useSession();
  if (!session) {
    return <div>Please Login</div>;
  }

  const {
    isLoading,
    error,
    data: userOpps,
  } = useQuery<Opp[], Error>(["opps"], async (): Promise<Opp[]> => {
    const res = await fetch(
      env.NEXT_PUBLIC_API_URL + `/${session.user?.id}/opps`
    );
    const arr = (await res.json()) as Opp[];
    return arr;
  });

  return (
    <div>
      <h1>Dashboard</h1>
      <div>
        {userOpps?.map((opp) => (
          <ServiceCard opp={opp} key={opp.id} />
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

  let interests: Interests | null = null;
  try {
    const res = await fetch(serverEnv.API_URL + `/users/${session?.user?.id}`);
    interests = (await res.json()) as Interests;
  } catch (err) {
    console.log(err);
  }
  return { props: { session, interests } };
};

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { GetServerSideProps, NextPage } from "next";
import { unstable_getServerSession } from "next-auth";
import { useSession } from "next-auth/react";
import React, { useState } from "react";
import { InterestModal, Interests } from "../components/InterestsModal";
import type { Opp } from "../components/OppCard";
import { env } from "../env/client.mjs";
import { authOptions } from "./api/auth/[...nextauth]";
import { getInterests, getOpps } from "../api";
import { AddableOppCard } from "../components/OppCard";

const Service: NextPage<{ interests: Interests | null }> = ({ interests }) => {
  const { data: session } = useSession();
  const user = session?.user;
  const queryClient = useQueryClient();

  const {
    isLoading,
    error,
    data: opps,
  } = useQuery<Opp[], Error>(["opps"], getOpps);

  const { data: ints } = useQuery<Interests | null, Error>(
    ["interests"],
    () => getInterests(session?.user?.id),
    { initialData: interests }
  );

  const [interestsModalOpen, setInterestsModalOpen] = useState(ints === null);

  if (!(session && user)) {
    return <div>Please Sign In</div>;
  }
  if (error) return <div>Error</div>;
  if (isLoading) return <div>Loading...</div>;

  return (
    <div>
      <h1 className="text-center text-5xl font-extrabold leading-normal text-purple-300 md:text-[5rem]">
        Service
      </h1>
      <div className="flex flex-col items-center gap-4 px-32">
        {opps?.map((opp) => (
          <AddableOppCard opp={opp} key={opp.id} />
        ))}
        <button
          onClick={() => queryClient.invalidateQueries(["opps"])}
          className="rounded bg-purple-300"
        >
          Re-Fetch
        </button>
      </div>
      <InterestModal
        session={session}
        interests={interests}
        open={interestsModalOpen}
        setOpen={setInterestsModalOpen}
      />
      <button onClick={() => setInterestsModalOpen(true)}>
        Update Interests
      </button>
    </div>
  );
};

export default Service;

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const session = await unstable_getServerSession(
    ctx.req,
    ctx.res,
    authOptions
  );

  let interests: Interests | null = null;
  try {
    interests = await getInterests(session?.user?.id);
  } catch (err) {
    console.log(err);
  }
  return { props: { session, interests } };
};

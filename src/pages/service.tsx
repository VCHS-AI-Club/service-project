import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { GetServerSideProps, NextPage } from "next";
import { unstable_getServerSession } from "next-auth";
import { useSession } from "next-auth/react";
import React, { useState } from "react";
import { InterestModal, Interests } from "../components/InterestsModal";
import { ServiceCard } from "../components/SereviceOpp";
import type { Opp } from "../components/SereviceOpp";
import { env } from "../env/client.mjs";
import { env as serverEnv } from "../env/server.mjs";
import { authOptions } from "./api/auth/[...nextauth]";

const Service: NextPage<{ interests: Interests | null }> = ({ interests }) => {
  const { data: session } = useSession();
  const user = session?.user;
  const queryClient = useQueryClient();

  const {
    isLoading,
    error,
    data: opps,
  } = useQuery<Opp[], Error>(["opps"], async (): Promise<Opp[]> => {
    const res = await fetch(env.NEXT_PUBLIC_API_URL + "/opp");
    const arr = (await res.json()) as Opp[];
    return arr;
  });

  const { data: ints } = useQuery<Interests | null, Error>(
    ["interests"],
    async (): Promise<Interests> => {
      const res = await fetch(
        env.NEXT_PUBLIC_API_URL + `/user/${session?.user?.id}`
      );
      const ints = (await res.json()) as Interests;
      return ints;
    },
    { initialData: interests }
  );

  const addMutation = useMutation(async (opp_id: number) => {
    console.log("mutating opp");
    return await fetch(env.NEXT_PUBLIC_API_URL + `/user/opp`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user_id: user.id, opp_id }),
    });
  });

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
          <ServiceCard
            opp={opp}
            key={opp.id}
            action={() => addMutation.mutate(opp.id)}
            actionText="add"
          />
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

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await unstable_getServerSession(
    context.req,
    context.res,
    authOptions
  );

  let interests: Interests | null = null;
  try {
    const res = await fetch(serverEnv.API_URL + `/user/${session?.user?.id}`);
    interests = (await res.json()) as Interests;
  } catch (err) {
    console.log(err);
  }
  return { props: { session, interests } };
};

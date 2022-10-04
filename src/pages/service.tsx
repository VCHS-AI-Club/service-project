import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { NextPage } from "next";
import React, { useState } from "react";
import { env } from "../env/client.mjs";

type Opp = {
  name: string;
  desc: string;
  start: number;
  end: number;
  lat: number;
  lon: number;
  id: number;
};

const Service: NextPage = () => {
  const queryClient = useQueryClient();
  const { isLoading, error, data } = useQuery<Opp[], Error>(
    ["opps"],
    async (): Promise<Opp[]> => {
      const res = await fetch(env.NEXT_PUBLIC_API_URL + "/opps");
      const arr = (await res.json()) as Opp[];
      return arr;
    }
  );
  console.log("data", JSON.stringify(data));
  const { mutate } = useMutation(
    (oppPost: { name: string; desc: string }) => {
      return fetch(env.NEXT_PUBLIC_API_URL + "/opps", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(oppPost),
      });
    },
    { onSuccess: () => queryClient.invalidateQueries(["opps"]) }
  );

  return (
    <>
      {isLoading && <div>Loading...</div>}
      {error && <div>error</div>}
      <h1 className="text-5xl md:text-[5rem] leading-normal font-extrabold text-purple-300 text-center">
        Service
      </h1>
      <div className="flex flex-col px-32 items-center gap-4">
        {data?.map((opp) => (
          <ServiceCard opp={opp} key={opp.id} />
        ))}
        <button
          onClick={() => queryClient.invalidateQueries(["opps"])}
          className="bg-purple-300 rounded"
        >
          Re-Fetch
        </button>
      </div>
    </>
  );
};

const ServiceCard: React.FC<{ opp: Opp }> = ({ opp: { name, desc, id } }) => {
  const queryClient = useQueryClient();
  const deleteMutation = useMutation(
    (del: { id: number }) => {
      return fetch(env.NEXT_PUBLIC_API_URL + `/opps/${del.id}`, {
        method: "DELETE",
      });
    },
    {
      onSuccess: () => queryClient.invalidateQueries(["opps"]),
    }
  );
  return (
    <article className="p-6 bg-white rounded-lg border border-gray-200 shadow-md  dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700 flex justify-between w-96">
      <div>
        <h2 className="text-gray-50">
          {id} | {name}
        </h2>
        <p className="text-gray-300 break-words">{desc}</p>
      </div>
      <div className=" flex items-center justify-center flex-col">
        <button
          className="text-red-500"
          onClick={() => deleteMutation.mutate({ id })}
        >
          X
        </button>
        <p className="text-green-400">80%</p>
      </div>
    </article>
  );
};

export default Service;

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { NextPage } from "next";
import React from "react";

type Opp = {
  name: string;
  desc: string;
  id: number;
};

const Service: NextPage = () => {
  const queryClient = useQueryClient();
  const { isLoading, error, data } = useQuery<Opp[], Error>(
    ["opps"],
    async (): Promise<Opp[]> => {
      const res = await fetch("http://localhost:8000/items");
      const arr = (await res.json()) as Opp[];
      return arr;
    }
  );
  console.log("data", data);

  return (
    <>
      {isLoading && <div>Loading...</div>}
      {error && <div>error</div>}
      <h1 className="text-5xl md:text-[5rem] leading-normal font-extrabold text-purple-300 text-center">
        Service
      </h1>
      <div className="flex flex-col px-32 items-center gap-4">
        {data?.map((opp) => (
          <ServiceCard opp={opp} />
        ))}
        <button
          onClick={() => queryClient.invalidateQueries()}
          className="bg-purple-300 rounded"
        >
          Re-Fetch
        </button>
      </div>
    </>
  );
};

const ServiceCard: React.FC<{ opp: Opp }> = ({ opp: { name, desc, id } }) => {
  return (
    // <article className="p-6 max-w-sm bg-white rounded-lg border border-gray-200 shadow-md  dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700 flex flex-row justify-end">
    <article className="p-6 bg-white rounded-lg border border-gray-200 shadow-md  dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700 flex justify-between w-96">
      <div>
        <h2 className="text-gray-50">
          {id} | {name}
        </h2>
        <p className="text-gray-300 break-words">{desc}</p>
      </div>
      <div className=" flex items-center justify-center">
        <p className="text-green-400">80%</p>
      </div>
    </article>
  );
};

export default Service;

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { NextPage } from "next";
import React from "react";

type Opp = {
  name: string;
  desc: string;
  id: number;
};


const Search: NextPage = () => {
  const queryClient = useQueryClient();
  const { isLoading, error, data } = useQuery<Opp[], Error>(["opps"], async (): Promise<Opp[]> => {
    const res = await fetch(
      "http://localhost:8000/items"
    );
    const arr = (await res.json()) as Opp[]
    return arr;
  });
  console.log("data", data);

  return (
    <>
      {isLoading && <div>Loading...</div>}
      {error && <div>error</div>}
      {data?.map((opp) => (
        <div>{opp.name}</div>
      ))}
      <button
        onClick={() => queryClient.invalidateQueries()}
        className="bg-purple-500 rounded"
      >
        Re-Fetch
      </button>
    </>
  );
};

export default Search;

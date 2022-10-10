import { TextField } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { GetServerSideProps } from "next";
import { unstable_getServerSession } from "next-auth";
import { useSession } from "next-auth/react";
import Head from "next/head";
import Link from "next/link";
import { useState } from "react";
import { authOptions } from "./api/auth/[...nextauth]";
// filters:
//  location
//  date
//  time

type Opp = {
  name: string;
  desc: string;
  start: number;
  end: number;
  lat: number;
  lon: number;
  id: number;
};

const OppListing: React.FC<{ opp: Opp }> = ({ opp }) => {
  return (
    <div>
      <h3>{opp.name}</h3>
      <p>{opp.desc}</p>
      <Link href={`https://maps.google.com/@${opp.lat},${opp.lon}`}>
        Google Maps
      </Link>
    </div>
  );
};

type Filter = {
  start: number | null;
  end: number | null;
  lat: number | null;
  lon: number | null;
  dist: number | null;
};

const Search = () => {
  const [query, setQuery] = useState<string>("");
  const [filter, setFilter] = useState<Filter>({
    start: null,
    end: null,
    lat: null,
    lon: null,
    dist: null,
  });

  const { isLoading, error, data } = useQuery<Opp[], Error>(
    ["opps"],
    async (): Promise<Opp[]> => {
      const res = await fetch("http://localhost:8080/opps");
      const arr = (await res.json()) as Opp[];
      return arr;
    }
  );

  const { data: session } = useSession();
  console.log(session);

  if (!data) {
    if (error) return <div>Error...</div>;
    if (isLoading) return <div>Loading...</div>;
  }

  const LatLng = google.maps.LatLng;

  const filtered = data.filter((opp) => {
    return (
      (!filter.start || opp.start >= filter.start) && // check if filter exists
      (!filter.end || opp.end <= filter.end) &&
      (!(filter.lat && filter.lon && filter.dist && google) ||
        google.maps.geometry.spherical.computeDistanceBetween(
          new LatLng({ lat: opp.lat, lng: opp.lon }),
          new LatLng({ lat: filter.lat, lng: filter.lon })
        ))
    );
  });

  return (
    <>
      <Head>
        <meta />
      </Head>
      <h1>Search for an opportunity</h1>
      <TextField onChange={(e) => setQuery(e.target.value)} />
      <div>
        {data && data.map((opp) => <OppListing key={opp.id} opp={opp} />)}
      </div>
    </>
  );
};

export default Search;

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await unstable_getServerSession(
    context.req,
    context.res,
    authOptions
  );
  console.log(session);

  return { props: { session } };
};

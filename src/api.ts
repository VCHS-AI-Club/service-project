import { type Interests } from "./components/InterestsModal";
import { type RateableOpp, type Opp } from "./components/OppCard";
import { env } from "./env/client.mjs";

export const getOpps = async (): Promise<Opp[]> => {
  const res = await fetch(env.NEXT_PUBLIC_API_URL + "/opp");
  const arr = (await res.json()) as Opp[];
  return arr;
};

export const getInterests = async (userId?: string): Promise<Interests> => {
  const res = await fetch(env.NEXT_PUBLIC_API_URL + `/user/${userId}`);
  const ints = (await res.json()) as Interests;
  return ints;
};

export const getRateableOpps = async (
  userId?: string
): Promise<RateableOpp[]> => {
  const res = await fetch(env.NEXT_PUBLIC_API_URL + `/user/${userId}/opps`);
  const arr = (await res.json()) as RateableOpp[];
  return arr;
};

type OppSchema = {
  name: string;
  desc: string;
  isChurch: boolean;
  contact: string;
  website: string;

  lat: number;
  lon: number;
  start: number;
  end: number;
};
export const createOpp = async (newOpp: OppSchema) => {
  console.log(JSON.stringify(newOpp));
  return await fetch(env.NEXT_PUBLIC_API_URL + "/opp", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(newOpp),
  });
};

export const updateInterests = async (interests: Interests, userId?: string) => {
  return await fetch(env.NEXT_PUBLIC_API_URL + `/user/${userId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ...interests, id: userId }),
  });
}

export const updateOppRating = async (rating: number, oppId: number, userId?: string) => {
  console.log("Rating", oppId, "with", rating);

  return await fetch(env.NEXT_PUBLIC_API_URL + `/opp/${oppId}/rate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ user_id: userId, rating }),
  });
}

export const getInverseOpps = async (userId?: string) => {
  const res = await fetch(env.NEXT_PUBLIC_API_URL + `/user/${userId}/inverse_opps`, {
    method: "GET",
  });
  return await res.json() as Opp[]
}

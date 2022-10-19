import Link from "next/link";
import { useState } from "react";

export type Opp = {
  id: number;
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
export type RateableOpp = Opp & { rating: number | null };

export const ServiceCard: React.FC<{
  opp: Opp | RateableOpp;
  action?: () => void;
  actionText?: string;
  rateable?: boolean;
  initialRating?: number;
  mutate?: (rating: number) => void;
}> = ({ opp, action, actionText, rateable, mutate, initialRating }) => {
  if (initialRating === null) return <div />
  console.log(initialRating);
  let rating = null;
  let setRating: (_: number) => void = (_) => {};
  let updateRating: (_: number) => void = (_) => {};

  [rating, setRating] = useState<number>(initialRating || 0);

  if (rateable && mutate) {
    updateRating = (newRating: number) => {
      setRating(newRating);
      mutate(newRating);
    };
  }
  return (
    <>
      <article className="max-w-sm overflow-hidden rounded shadow-lg">
        <div className="px-6 py-4">
          <div className="flex flex-row justify-between">
            <div className="mb-2 text-xl font-bold">{opp.name}</div>
            {action && actionText && (
              <div
                onClick={() => action()}
                className="cursor-pointer rounded-full bg-pink-300 p-4"
              >
                {actionText}
              </div>
            )}
            {rateable && rating !== null && mutate && (
              <div className="flex items-center">
                <Star
                  onClick={() => updateRating(1)}
                  on={rating >= 1}
                  title="First star"
                />
                <Star
                  onClick={() => updateRating(2)}
                  on={rating >= 2}
                  title="Second star"
                />
                <Star
                  onClick={() => updateRating(3)}
                  on={rating >= 3}
                  title="Third star"
                />
                <Star
                  onClick={() => updateRating(4)}
                  on={rating >= 4}
                  title="Fourth star"
                />
                <Star
                  onClick={() => updateRating(5)}
                  on={rating >= 5}
                  title="Fifth star"
                />
              </div>
            )}
          </div>
          <p className="text-base text-gray-700">{opp.desc}</p>
          <Link href={`https://maps.google.com/maps/@${opp.lat},${opp.lon}`}>
            <a target="_blank">Google Maps</a>
          </Link>
          <p>
            {new Date(opp.start * 1000).toLocaleDateString("en-us", {
              weekday: "long",
              year: "numeric",
              month: "short",
              day: "numeric",
            })}
            {}
          </p>
          <p>
            {new Date(opp.end * 1000).toLocaleDateString("en-us", {
              weekday: "long",
              year: "numeric",
              month: "short",
              day: "numeric",
            })}
          </p>
          <p>{opp.contact}</p>
          {opp.website && <Link href={opp.website}>Website</Link>}

          <div
            className={
              "mr-2 mb-2 inline-block rounded-full px-3 py-1 text-sm font-semibold text-gray-700 " +
              (opp.isChurch ? "bg-blue-200" : "bg-green-200")
            }
          >
            {opp.isChurch ? "Church" : "Organization"}
          </div>
        </div>
        <div className="px-6 pt-4 pb-2">
          <span className="mr-2 mb-2 inline-block rounded-full bg-gray-200 px-3 py-1 text-sm font-semibold text-gray-700">
            #photography
          </span>
          <span className="mr-2 mb-2 inline-block rounded-full bg-gray-200 px-3 py-1 text-sm font-semibold text-gray-700">
            #travel
          </span>
          <span className="mr-2 mb-2 inline-block rounded-full bg-gray-200 px-3 py-1 text-sm font-semibold text-gray-700">
            #winter
          </span>
        </div>
      </article>
    </>
  );
};

const Star: React.FC<{ title: string; on?: boolean; onClick: () => void }> = ({
  title,
  on,
  onClick,
}) => {
  return (
    <svg
      aria-hidden="true"
      className={"h-5 w-5 " + (on ? "text-yellow-400" : "text-gray-500")}
      fill="currentColor"
      viewBox="0 0 20 20"
      xmlns="http://www.w3.org/2000/svg"
      onClick={() => onClick()}
    >
      <title>{title}</title>
      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
    </svg>
  );
};

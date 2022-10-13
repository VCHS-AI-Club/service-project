import Link from "next/link";

export type Opp = {
  id: string;
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

export const ServiceCard: React.FC<{ opp: Opp }> = ({ opp }) => {
  return (
    <>
      <article className="max-w-sm overflow-hidden rounded shadow-lg">
        <div className="px-6 py-4">
          <div className="mb-2 text-xl font-bold">{opp.name}</div>
          <p className="text-base text-gray-700">{opp.desc}</p>
          <Link href={`https://maps.google.com/maps/@${opp.lat},${opp.lon}`}>
            <a target="_blank">Google Maps</a>
          </Link>
          <p>
            {new Date(opp.start).toLocaleDateString("en-us", {
              weekday: "long",
              year: "numeric",
              month: "short",
              day: "numeric",
            })}
          </p>
          <p>
            {new Date(opp.end).toLocaleDateString("en-us", {
              weekday: "long",
              year: "numeric",
              month: "short",
              day: "numeric",
            })}
          </p>
          <p>{opp.contact}</p>
          <Link href={opp.website}>Website</Link>

          <span
            className={
              "mr-2 mb-2 inline-block rounded-full px-3 py-1 text-sm font-semibold text-gray-700 " +
              (opp.isChurch ? "bg-blue-200" : "bg-green-200")
            }
          >
            {opp.isChurch ? "Church" : "Organization"}
          </span>
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

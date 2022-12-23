import React from "react";
import { type RouterOutputs } from "../../utils/trpc";
import {} from "date-fns";

// TODO: cva

type Opp = RouterOutputs["opp"]["upcoming"][number];

export const OppCard: React.FC<{
  opp: Opp;
  new_: boolean;
  action: React.ReactNode;
}> = ({
  opp: {
    id,
    title,
    description,
    location,
    start,
    end,
    isChurch,
    categories,
    contact,
    url,
  },
  new_,
  action,
}) => {
  return (
    <article
      className={`flex flex-col gap-4 rounded-md p-8 ${
        new_ && " border-2 border-gray-500 "
      } ${isChurch ? " bg-blue-50 " : " bg-green-50 "}`}
    >
      <div className="flex justify-between">
        <div className="flex flex-row items-center gap-8 ">
          <h2 className="text-2xl font-bold text-gray-800">{title}</h2>
          {new_ && (
            <span
              className={`rounded-3xl px-2 py-1 ${
                isChurch ? " bg-blue-200 " : " bg-green-200 "
              }`}
            >
              New!
            </span>
          )}
        </div>
        {action}
      </div>
      <p className="text-gray-700">{description}</p>
      <div>
        <div>{location}</div>
        <div>
          {start.toLocaleDateString()} | {end.toLocaleDateString()}
        </div>
        {contact && <div>{contact}</div>}
        {url && <div>{url}</div>}
      </div>
      <div className="flex gap-2">
        {categories.split(",").map((category) => (
          <span
            key={category}
            className="rounded-xl bg-gray-300 px-2 py-1 text-center"
          >
            {category}
          </span>
        ))}
      </div>
    </article>
  );
};

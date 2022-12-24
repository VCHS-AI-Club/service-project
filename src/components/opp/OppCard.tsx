import React, { type ComponentProps, type ComponentType } from "react";
import { type RouterOutputs } from "../../utils/trpc";
import { cva } from "class-variance-authority";
import { H3, P } from "../ui";
import {
  AtSymbolIcon,
  CalendarIcon,
  LinkIcon,
  MapPinIcon,
  HomeIcon,
  BookOpenIcon,
  WrenchScrewdriverIcon,
  GlobeAsiaAustraliaIcon,
  PencilIcon,
  ComputerDesktopIcon,
  FaceSmileIcon,
  CheckCircleIcon,
} from "@heroicons/react/24/outline";
import Link from "next/link";

type Opp = RouterOutputs["opp"]["upcoming"][number];

const formatDate = (date: Date, date2: Date) => {
  // format the date to Mon Day, time1-time2
  const day = date.toLocaleDateString("en-US", { weekday: "short" });
  const dayNum = date.toLocaleDateString("en-US", { day: "numeric" });
  const month = date.toLocaleDateString("en-US", { month: "short" });
  const time = date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "numeric",
  });
  const time2 = date2.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "numeric",
  });
  return `${day} ${month} ${dayNum}, ${time} - ${time2}`;
};

const IconText: React.FC<{
  Icon: ComponentType<ComponentProps<"svg">>;
  children: React.ReactNode;
}> = ({ Icon, children }) => {
  return (
    <div className="flex items-center gap-2">
      <Icon height={20} className="text-gray-500" />
      <span className="text-gray-500">{children}</span>
    </div>
  );
};

const CategoryPill: React.FC<{
  type:
    | "environment"
    | "tech"
    | "children"
    | "church"
    | "teaching"
    | "physical";
}> = ({ type }) => {
  const color = cva("group py-1 px-2 rounded-3xl flex items-center gap-1 ", {
    variants: {
      type: {
        environment: ["bg-green-100 text-green-800 hover:bg-green-200"],
        tech: ["bg-blue-100 text-blue-800 hover:bg-blue-200"],
        children: ["bg-yellow-100 text-yellow-800 hover:bg-yellow-200"],
        church: ["bg-purple-100 text-purple-800 hover:bg-purple-200"],
        teaching: ["bg-indigo-100 text-indigo-800 hover:bg-indigo-200"],
        physical: ["bg-red-100 text-red-800 hover:bg-red-200"],
      },
    },
  })({ type }); // FIXME
  const ICON_SIZE = 16;
  const icon = {
    environment: <GlobeAsiaAustraliaIcon height={ICON_SIZE} />,
    tech: <ComputerDesktopIcon height={ICON_SIZE} />,
    children: <FaceSmileIcon height={ICON_SIZE} />,
    church: <BookOpenIcon height={ICON_SIZE} />,
    teaching: <PencilIcon height={ICON_SIZE} />,
    physical: <WrenchScrewdriverIcon height={ICON_SIZE} />,
  };
  return (
    <div className={color}>
      <div className="peer">
        {icon[type] || <CheckCircleIcon height={ICON_SIZE} />}
      </div>
      <span className="text-sm">{type}</span>
    </div>
  );
};

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
  const sameDay =
    start.getFullYear() === end.getFullYear() &&
    start.getMonth() === end.getMonth() &&
    start.getDate() === end.getDate();

  if (!sameDay) {
    console.error("Dates do not match! ID:", id);
  }

  return (
    <article className="rounded-xl bg-white shadow">
      <div className="m-4 flex items-center justify-between">
        <H3>{title}</H3>
        {action}
      </div>
      <hr className="border-1 my-2 border-gray-300" />
      <div className="m-4 flex flex-col gap-4">
        <P>{description}</P>
        <div className="flex items-center justify-between">
          <div className="flex gap-8">
            <IconText Icon={CalendarIcon}>{formatDate(start, end)}</IconText>
            <IconText Icon={MapPinIcon}>{location}</IconText>
            {contact && <IconText Icon={AtSymbolIcon}>{contact}</IconText>}
            {url && (
              <IconText Icon={LinkIcon}>
                <Link href={url} target="_blank" className="underline">
                  Sign Up
                </Link>
              </IconText>
            )}
          </div>
          <div className="flex gap-2">
            {categories.split(",").map((category) => (
              <CategoryPill type={category as any} key={category} /> // FIXME
            ))}
          </div>
        </div>
      </div>
    </article>
  );
};

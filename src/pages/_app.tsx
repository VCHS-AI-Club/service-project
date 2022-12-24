import { type AppType } from "next/app";
import { type Session } from "next-auth";
import { SessionProvider, signIn, signOut, useSession } from "next-auth/react";

import { trpc } from "../utils/trpc";

import "../styles/globals.css";
import Link from "next/link";
import React from "react";
import { Button } from "../components/ui";
import { useRouter } from "next/router";
import Image from "next/image";

const NavLink: React.FC<{
  href: string;
  children: React.ReactNode;
  current?: boolean;
}> = ({ href, children, current }) => {
  return (
    <Link
      href={href}
      className={
        " border-b-2 px-2 py-1 text-gray-800 hover:border-indigo-400" +
        (current ? " border-indigo-500 " : " border-transparent ")
      }
    >
      {children}
    </Link>
  );
};

const NavBar: React.FC = () => {
  const { data: session } = useSession();
  const { pathname } = useRouter();
  return (
    <nav className="space-y-1 bg-gray-50 px-16 py-4 shadow">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-8">
          <Image src="/logo.svg" height={48} width={48} alt="logo" />
          {session && (
            <>
              <NavLink current={pathname === "/"} href="/">
                Home
              </NavLink>
              <NavLink current={pathname === "/service"} href="/service">
                Service
              </NavLink>
              <NavLink current={pathname === "/dashboard"} href="/dashboard">
                Dashboard
              </NavLink>
            </>
          )}
          {session?.user?.role == "ADMIN" && (
            <>
              <NavLink current={pathname === "/create"} href="/create">
                Create
              </NavLink>
              <NavLink current={pathname === "/edit"} href="/edit">
                Edit
              </NavLink>
            </>
          )}
        </div>
        <div className="flex items-center gap-8">
          <div>Search Bar</div>
          {session ? (
            <Button variant="secondary" onClick={() => signOut()}>
              Log Out
            </Button>
          ) : (
            <Button onClick={() => signIn("google")}>Log In</Button>
          )}
        </div>
      </div>
    </nav>
  );
};

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  return (
    <SessionProvider session={session}>
      <NavBar />
      <Component {...pageProps} />
    </SessionProvider>
  );
};

export default trpc.withTRPC(MyApp);

import "../styles/globals.css";

import { type AppProps } from "next/app";
import type { Session } from "next-auth";
import { SessionProvider, signIn, signOut, useSession } from "next-auth/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import Link from "next/link";
import Image from "next/image";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { useRouter } from "next/router";

const NavBar = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  if (status === "loading") return <div>Loading...</div>;
  return (
    <>
      <nav className="bg-gray-800 ">
        <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
          <div className="hidden sm:ml-6 sm:block">
            <div className="flex space-x-4">
              <NavLink href="/" slug={router.pathname} text="Home" />
              <NavLink
                href="/dashboard"
                slug={router.pathname}
                text="Dashboard"
              />
              {/*<NavLink href="/search" slug={router.pathname} text="Search" />*/}
              <NavLink href="/service" slug={router.pathname} text="Service" />
              <NavLink
                href="/admin/create"
                slug={router.pathname}
                text="Create"
              />
              <button
                className="rounded-md px-3 py-2 text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white"
                onClick={() => (session?.user ? signOut() : signIn("google"))}
              >
                {session?.user ? "Sign Out" : "Sign In"}
              </button>
            </div>
          </div>
          {session?.user && (
            <div className="rounded-md px-3 py-2 text-sm font-medium text-white">
              Signed in as {session?.user?.name}
            </div>
          )}
          {session?.user?.image && (
            <>
              <Image src={session?.user?.image} width="36" height="1" />
              <div className="text-white">{session?.user?.id}</div>
            </>
          )}
        </div>
      </nav>
    </>
  );
};
const queryClient = new QueryClient();

const NavLink: React.FC<{ href: string; slug: string; text: string }> = ({
  href,
  slug,
  text,
}) => {
  return (
    <Link href={href}>
      <a
        className={
          "rounded-md px-3 py-2 text-sm font-medium " +
          (href === slug
            ? "bg-gray-900  text-white"
            : " text-gray-300 hover:bg-gray-700 hover:text-white")
        }
      >
        {text}
      </a>
    </Link>
  );
};

const MyApp = ({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps<{ session: Session }>) => {
  return (
    <QueryClientProvider client={queryClient}>
      <LocalizationProvider dateAdapter={AdapterMoment}>
        <SessionProvider session={session}>
          <NavBar />
          <Component {...pageProps} />
          <ReactQueryDevtools />
        </SessionProvider>
      </LocalizationProvider>
    </QueryClientProvider>
  );
};

export default MyApp;

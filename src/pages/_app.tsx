import { type AppType } from "next/app";
import { type Session } from "next-auth";
import { SessionProvider, signIn, signOut, useSession } from "next-auth/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { trpc } from "../utils/trpc";

import "../styles/globals.css";
import Link from "next/link";
import React from "react";
import { Button } from "../components/ui";
import { useRouter } from "next/router";
import Image from "next/image";
import NavBar from "../components/NavBar";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
});
const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  return (
    <SessionProvider session={session}>
      <QueryClientProvider client={queryClient}>
        <NavBar />
        <Component {...pageProps} />
      </QueryClientProvider>
    </SessionProvider>
  );
};

export default trpc.withTRPC(MyApp);

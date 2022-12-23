import { type NextPage } from "next";
import { signIn, useSession } from "next-auth/react";
import Head from "next/head";
import Link from "next/link";

const Home: NextPage = () => {
  const { data: session } = useSession();
  return (
    <>
      <Head>
        <title>AI Service</title>
        <meta name="description" content="AI Suggested Service" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c]">
        <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16 ">
          <h1 className="text-5xl font-extrabold tracking-tight text-white sm:text-[5rem]">
            AI <span className="text-[hsl(280,100%,70%)]">Service</span>
          </h1>
          {!session && (
            <button
              className="rounded  bg-[hsl(280,100%,70%)] px-8 py-4 font-bold text-white"
              onClick={() => signIn("google")}
            >
              Sing In
            </button>
          )}
          <div className="flex flex-col items-center gap-2">
            <Link href="/dashboard" className="text-white underline">
              Dashboard
            </Link>
            <Link href="/service" className="text-white underline">
              Service
            </Link>
            <Link href="/create" className="text-white underline">
              Create
            </Link>
            <Link href="/edit" className="text-white underline">
              Edit
            </Link>
          </div>
        </div>
      </main>
    </>
  );
};

export default Home;

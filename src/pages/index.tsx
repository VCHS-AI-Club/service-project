import { type NextPage } from "next";
import { signIn } from "next-auth/react";
import Head from "next/head";
import { Button } from "../components/ui";

const Home: NextPage = () => {
  return (
    <>
      <Head>
        <title>AI Service</title>
        <meta name="description" content="AI Suggested Service" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex min-h-screen items-center justify-center">
        <div className="container flex flex-1 flex-col items-center justify-center gap-12 px-16 py-16 ">
          <div>
            <h1 className="text-5xl font-extrabold tracking-tight  text-gray-800 sm:text-[5rem]">
              Make an <span className="text-[hsl(280,100%,70%)]">IMPACT</span>{" "}
            </h1>
            <h2 className="text-3xl text-gray-800">Doing What You Love</h2>
          </div>
          <Button onClick={() => signIn("google")}>Get Started</Button>
        </div>
        <div className="flex-1">asdf</div>
      </main>
    </>
  );
};

export default Home;

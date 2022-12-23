import type { GetServerSideProps } from "next";
import { useSession } from "next-auth/react";
import Link from "next/link";
import React from "react";
import { OppCard } from "../../components/opp/Opp";
import { getServerAuthSession } from "../../server/get-server-auth-session";
import { trpc } from "../../utils/trpc";

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const session = await getServerAuthSession(ctx);
  return {
    props: { session },
  };
};

const EditPage = () => {
  const { data: session } = useSession();

  const { data: opps } = trpc.opp.all.useQuery();

  const deleteOpp = (id: string) => {
    return null;
  };

  if (session && session.user?.role !== "ADMIN") {
    return <div>Not authorized</div>;
  }
  return (
    <div className="px-36">
      <h1>Edit Page</h1>
      <ul className="flex flex-col gap-4">
        {opps?.map((opp) => (
          <OppCard
            opp={opp}
            key={opp.id}
            new_={false}
            action={
              <div className="flex items-center gap-2">
                <Link href={`/edit/${opp.id}`}>Edit</Link>
                <button onClick={() => deleteOpp("")}>Delete</button>
              </div>
            }
          />
        ))}
      </ul>
    </div>
  );
};

export default EditPage;

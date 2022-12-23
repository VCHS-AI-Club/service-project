import { useSession } from "next-auth/react";
import { OppCreateForm } from "../components/opp";

const CreatePage = () => {
  const { data: session } = useSession();
  if (session && session.user?.role !== "ADMIN")
    return <div>Not authorized</div>;

  return (
    <div className="px-36">
      <h1>Create a Service Opportunity</h1>
      <OppCreateForm />
    </div>
  );
};

export default CreatePage;

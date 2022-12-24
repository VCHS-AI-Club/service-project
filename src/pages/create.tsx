import { useSession } from "next-auth/react";
import { OppCreateForm } from "../components/opp";
import { Container, H1 } from "../components/ui";

const CreatePage = () => {
  const { data: session } = useSession();
  if (session && session.user?.role !== "ADMIN")
    return <div>Not authorized</div>;

  return (
    <Container>
      <H1>Create a Service Opportunity</H1>
      <OppCreateForm />
    </Container>
  );
};

export default CreatePage;

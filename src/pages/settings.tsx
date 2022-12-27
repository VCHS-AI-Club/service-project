import { useState } from "react";
import InterestsModal from "../components/InterestsModal";
import { Button, Container, H1, H2 } from "../components/ui";
import { trpc } from "../utils/trpc";

const SettingsPage = () => {
  const [interestsModalOpen, setInterestsModalOpen] = useState(false);
  const { data: interests } = trpc.user.interests.useQuery();
  return (
    <Container>
      <H1>User Settings</H1>
      <H2>Interests</H2>
      <Button>Update Interests</Button>
      <InterestsModal
        interests={interests}
        open={interestsModalOpen}
        setOpen={setInterestsModalOpen}
      />
    </Container>
  );
};

export default SettingsPage;

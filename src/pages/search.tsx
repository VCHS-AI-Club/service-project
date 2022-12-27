import { useState } from "react";
import InterestsModal from "../components/InterestsModal";
import { Container, H1 } from "../components/ui";
import { trpc } from "../utils/trpc";

const SearchPage = () => {
  const { data: interests, isLoading } = trpc.user.interests.useQuery();

  const [modalOpen, setModalOpen] = useState(true);
  if (isLoading) {
    return null;
  }
  return (
    <Container>
      {!interests && (
        <InterestsModal
          open={modalOpen}
          setOpen={setModalOpen}
          interests={interests}
        />
      )}
      <H1>Search</H1>
      <ul>{}</ul>
    </Container>
  );
};

export default SearchPage;

import { zodResolver } from "@hookform/resolvers/zod";
import React, { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { z } from "zod";
import { TextInput } from "../components/form";
import InterestsModal from "../components/InterestsModal";
import { OppCard } from "../components/opp";
import OppCardSkeleton from "../components/opp/OppCardSkeleton";
import { Button, Container, H1 } from "../components/ui";
import { trpc } from "../utils/trpc";

const formSchema = z.object({
  // categories: z.array(z.string()),
  text: z.string(),
});

type FormSchema = z.infer<typeof formSchema>;

const SearchPage = () => {
  const { data: interests, isLoading: isInterestsLoading } =
    trpc.user.interests.useQuery();

  const [modalOpen, setModalOpen] = useState(true);

  const methods = useForm<FormSchema>({
    defaultValues: {
      text: "",
    },
    resolver: zodResolver(formSchema),
    mode: "all",
  });

  React.useEffect(() => {
    const subscription = methods.watch((value, { name, type }) =>
      console.log(value, name, type)
    );
    return () => subscription.unsubscribe();
  }, [methods]);

  const { data: opps, isLoading: isOppsLoading } = trpc.opp.search.useQuery({
    text: methods.watch("text"),
  });

  if (isInterestsLoading) {
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
      <FormProvider {...methods}>
        <form className="pb-8">
          <TextInput<FormSchema>
            name="text"
            label="Search"
            className="w-full"
          />
        </form>
      </FormProvider>
      <ul className="flex flex-col gap-8">
        {isOppsLoading && <OppCardSkeleton />}
        {opps?.map((opp) => (
          <OppCard
            opp={opp}
            key={opp.id}
            new_={false}
            action={<Button>Add</Button>}
          />
        ))}
      </ul>
      <pre>{JSON.stringify(methods.getValues())}</pre>
    </Container>
  );
};

export default SearchPage;

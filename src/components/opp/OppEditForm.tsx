import { env } from "../../env/client.mjs";
import { useLoadScript } from "@react-google-maps/api";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { TextField } from "@mui/material";
import { FormProvider, useForm } from "react-hook-form";
import { trpc } from "../../utils/trpc";
import { useSession } from "next-auth/react";
import {
  Checkbox,
  DatePicker,
  LocationAutocomplete,
  MultiSelect,
  TextInput,
} from "../form";

// Google API doesn't export their type, so it's copied here
type LibType = (
  | "places"
  | "drawing"
  | "geometry"
  | "localContext"
  | "visualization"
)[];
const LIBRARIES: LibType = ["places"];

const formSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  description: z.string().min(1),
  contact: z.string().email().or(z.literal("")),
  url: z.string().url("Invalid URL, try adding 'https://'").or(z.literal("")),
  start: z.date().min(new Date(), "Date must be in the future"),
  end: z.date().min(new Date(), "Date must be in the future"),
  isChurch: z.boolean(),
  location: z.string().min(1),
  categories: z.array(z.string().min(1)),
});
type FormSchema = z.infer<typeof formSchema>;

export const OppEditForm: React.FC<{ oppId: string }> = ({ oppId }) => {
  // Form Handlers

  // const

  const methods = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    // TODO: revisit defaults
    defaultValues: {
      id: oppId,
      title: "Service Opp | " + Date.now(),
      description: "Description for service opp",
      start: new Date(),
      end: new Date(),
      isChurch: true,
      categories: [],
      contact: "",
      url: "",
      location: "",
    },
    mode: "all",
  });

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
    libraries: LIBRARIES,
  });

  if (loadError) console.error("Error loading google maps api:", loadError);

  //   const mutate = trpc.opp.create.useMutation().mutateAsync;
  const mutate = trpc.opp.edit.useMutation().mutateAsync;

  const onSubmit = async (formData: FormSchema) => {
    const parsedData = formSchema.safeParse(formData);
    if (!parsedData.success) {
      // TODO: toast
      console.log("Error parsing form data:", parsedData.error);
      return;
    }
    const data = parsedData.data;
    await mutate(data);
  };

  const { data: session } = useSession();
  if (!session) {
    return null;
  }
  if (session?.user?.role !== "ADMIN") {
    return (
      <div>
        Not authorized. You must be an admin to create service opportunities{" "}
        <span>ROLE: {session?.user?.role}</span>
      </div>
    );
  }

  return (
    <>
      <div className="m-36">
        <FormProvider {...methods}>
          <form
            onSubmit={methods.handleSubmit(onSubmit)}
            className="flex flex-col gap-4"
          >
            <TextInput<FormSchema> name="title" label="Title" />
            <TextInput<FormSchema> name="description" label="Description" />

            <TextInput<FormSchema> name="url" label="Website" optional />
            <TextInput<FormSchema>
              name="contact"
              label="Contact Email"
              optional
            />

            <DatePicker<FormSchema> name="start" label="Start date and time" />
            <DatePicker<FormSchema> name="end" label="End date and time" />

            <Checkbox<FormSchema> name="isChurch" label="Church Hours" />

            <MultiSelect<FormSchema>
              name="categories"
              label="Categories"
              options={[
                "environment",
                "tech",
                "children",
                "church",
                "teaching",
                "physical",
              ]}
            />

            {/* Only load the location autocomplete if the google maps api is loaded */}
            {/* otherwise, load a dummy input area */}
            {isLoaded ? (
              <LocationAutocomplete name="location" />
            ) : (
              <TextField placeholder="Location" />
            )}

            <button
              type="submit"
              className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              Save
            </button>
          </form>
        </FormProvider>
      </div>
    </>
  );
};

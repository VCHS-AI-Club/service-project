import React, { useState } from "react";
import usePlacesAutocomplete from "use-places-autocomplete";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { DateTimePicker } from "@mui/x-date-pickers";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { env } from "../env/client.mjs";
import { useLoadScript } from "@react-google-maps/api";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Autocomplete,
  Checkbox as MuiCheckbox,
  FormControl,
  FormControlLabel,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
  TextField,
} from "@mui/material";
import {
  Controller,
  FormProvider,
  useForm,
  useFormContext,
} from "react-hook-form";
import { trpc } from "../utils/trpc";
import { useSession } from "next-auth/react";

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
type FormData = z.infer<typeof formSchema>;

const CreatePage = () => {
  // Form Handlers

  const [data, setData] = useState<FormData>();
  const [error, setError] = useState("");

  const methods = useForm<FormData>({
    resolver: zodResolver(formSchema),
    // TODO: revisit defaults
    defaultValues: {
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

  const mutate = trpc.opp.create.useMutation().mutateAsync;

  const onSubmit = async (formData: FormData) => {
    const parsedData = formSchema.safeParse(formData);
    if (!parsedData.success) {
      // TODO: toast
      console.log("Error parsing form data:", parsedData.error);
      return;
    }
    const data = parsedData.data;
    setData(data);
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
            <TextInput name="title" label="Title" />
            <TextInput name="description" label="Description" />

            <TextInput name="url" label="Website" optional />
            <TextInput name="contact" label="Contact Email" optional />

            <DatePicker name="start" label="Start date and time" />
            <DatePicker name="end" label="End date and time" />

            <Checkbox name="isChurch" label="Church Hours" />

            <MultiSelect
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
        <pre>Data: {JSON.stringify(data, null, "\n")}</pre>
        <pre>Error: {error}</pre>
      </div>
    </>
  );
};

/** Gets keys on the type `Type` that are of type `Filter`
 *
 * @generic `Type` Any type
 * @generic `Filter` The type to filter by
 *
 * @example
 * ```ts
 * type Person = {
 *   name: string;
 *   age: number;
 *   birthYear: number;
 * };
 * PersonNumbers = SelectKeysByValueType<Person, number>;
 * // 'age' | 'birthYear'
 * PersonStrings = SelectKeysByValueType<Person, string>;
 * // 'name'
 * PersonDates = SelectKeysByValueType<Person, Date>;
 * // never
 * ```
 */
export type SelectKeysByValueType<Type, Filter> = {
  [Key in keyof Type]: Type[Key] extends Filter ? Key : never;
}[keyof Type];

/** Creates an object that only has types `Filter` from the type `Type`.
 *
 * @generic `Type` Any type
 * @generic `Filter` The type to filter by
 *
 * @example
 * ```ts
 * type Person = {
 *   name: string;
 *   age: number;
 *   birthYear: number;
 * };
 * PersonNumbers = SelectKeysByType<Person, number>;
 * // { age: number; birthYear: number; }
 * PersonStrings = SelectKeysByType<Person, string>;
 * // { name: string; }
 * PersonDates = SelectKeysByType<Person, Date>;
 * // { }
 * ```
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export type SelectKeysByType<Type, Filter> = Type extends infer _
  ? {
      [Key in SelectKeysByValueType<Type, Filter>]: Type[Key];
    }
  : never;

const DatePicker: React.FC<{
  name: SelectKeysByValueType<FormData, Date>;
  label: string;
}> = ({ name, label }) => {
  const { control } = useFormContext();
  return (
    <Controller
      control={control}
      name={name}
      render={({ field: { ref, onBlur, name, ...field }, fieldState }) => (
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <DateTimePicker
            {...field}
            inputRef={ref}
            label={label}
            renderInput={(inputProps) => (
              <TextField
                {...inputProps}
                onBlur={onBlur}
                name={name}
                error={!!fieldState.error}
                helperText={fieldState.error?.message}
              />
            )}
          />
        </LocalizationProvider>
      )}
    />
  );
};
const TextInput: React.FC<{
  name: SelectKeysByValueType<FormData, string | number | undefined>;
  label: string;
  optional?: boolean;
}> = ({ label, name, optional = false }) => {
  const { control } = useFormContext();
  return (
    <Controller
      name={name}
      control={control}
      render={({
        field: { onChange, onBlur, value, ref },
        fieldState: { error },
      }) => (
        <TextField
          label={`${label} ${optional ? "(optional)" : ""}`}
          onChange={onChange}
          error={!!error}
          ref={ref}
          onBlur={onBlur}
          value={value}
          helperText={error?.message || ""}
        />
      )}
    />
  );
};
const Checkbox: React.FC<{
  name: SelectKeysByValueType<FormData, boolean>;
  label: string;
}> = ({ name, label }) => {
  const { control } = useFormContext();
  return (
    <FormControlLabel
      label={label}
      control={
        <Controller
          control={control}
          name={name}
          render={({ field: { value, onChange, ref } }) => (
            <MuiCheckbox checked={value} onChange={onChange} ref={ref} />
          )}
        />
      }
    />
  );
};
const LocationAutocomplete: React.FC<{
  name: SelectKeysByValueType<FormData, string>;
}> = ({ name }) => {
  const { control } = useFormContext();
  const { ready, suggestions, setValue } = usePlacesAutocomplete();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field: { onChange, value }, fieldState }) => (
        <Autocomplete
          disabled={!ready}
          disablePortal // screen-readers don't work on this, so we disable them
          options={suggestions.data.map((s) => s.description)}
          renderInput={(params) => (
            <TextField
              {...params}
              placeholder="Location"
              onChange={(e) => {
                setValue(e.target.value);
              }}
              helperText={fieldState.error?.message}
              error={!!fieldState.error}
            />
          )}
          value={value}
          onChange={(e, data) => {
            onChange(data);
            return data;
          }}
        />
      )}
    />
  );
};

const MultiSelect: React.FC<{
  name: SelectKeysByValueType<FormData, string[]>;
  label: string;
  options: string[];
}> = ({ name, label, options }) => {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field: { onChange, value }, fieldState }) => (
        <>
          <InputLabel id={`${name}-label`}>{label}</InputLabel>
          <Select
            labelId={`${name}-label`}
            value={value}
            id="select"
            onChange={onChange}
            multiple
            input={<OutlinedInput label={label} />}
          >
            {options.map((option) => (
              <MenuItem key={option} value={option}>
                {option}
              </MenuItem>
            ))}
          </Select>
        </>
      )}
    />
  );
};

export default CreatePage;

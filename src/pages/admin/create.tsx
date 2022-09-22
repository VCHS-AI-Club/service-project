import { NextPage } from "next";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useForm, Controller } from "react-hook-form";
import { DateTimePicker } from "@mui/x-date-pickers";
import { Button, TextField } from "@mui/material";
import usePlacesAutocomplete, {
  getGeocode,
  getLatLng,
} from "use-places-autocomplete";
import useOnclickOutside from "react-cool-onclickoutside";
import {env} from "../../env/client.mjs"
import `https://maps.googleapis.com/maps/api/js?key=${env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&libraries=places&callback=initMap`;
import {useMutation} from "@tanstack/react-query"

type FormData = {
  name: string;
  description: string;
  date: Date;
  location: { lat: number; lon: number };
};

const PlacesAutocomplete = () => {
  // https://hackernoon.com/create-your-reactjs-address-autocomplete-component-in-10-minutes-ws2j33ej
  const {
    ready,
    value,
    suggestions: { status, data },
    setValue,
    clearSuggestions,
  } = usePlacesAutocomplete({
    requestOptions: {
      /* Define search scope here */
    },
    debounce: 300,
  });
  const ref = useOnclickOutside(() => {
    // When user clicks outside of the component, we can dismiss
    // the searched suggestions by calling this method
    clearSuggestions();
  });

  const handleInput = (e) => {
    // Update the keyword of the input element
    setValue(e.target.value);
  };

  const handleSelect =
    ({ description }) =>
    () => {
      // When user selects a place, we can replace the keyword without request data from API
      // by setting the second parameter to "false"
      setValue(description, false);
      clearSuggestions();

      // Get latitude and longitude via utility functions
      getGeocode({ address: description }).then((results) => {
        const { lat, lng } = getLatLng(results[0]);
        console.log("📍 Coordinates: ", { lat, lng });
      });
    };

  const renderSuggestions = () =>
    data.map((suggestion) => {
      const {
        place_id,
        structured_formatting: { main_text, secondary_text },
      } = suggestion;

      return (
        <li key={place_id} onClick={handleSelect(suggestion)}>
          <strong>{main_text}</strong> <small>{secondary_text}</small>
        </li>
      );
    });

  return (
    <div ref={ref} className="inline">
      <TextField
        value={value}
        onChange={handleInput}
        disabled={!ready}
        label="location"
      />
      {/* We can use the "status" to decide whether we should display the dropdown or not */}
      {status === "OK" && <ul>{renderSuggestions()}</ul>}
    </div>
  );
};

const Create: NextPage = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { register, handleSubmit, control } = useForm<FormData>();

  const {} = useMutation();

  if (status === "unauthenticated") {
    router.push("/");
  }

  const onSubmit = (data: FormData) => {
    console.log(data.date);
  };

  return (
    <>
      <div>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="p-8 flex flex-col items-center content-center gap-4">
            <TextField label="name" {...register("name")} className="block" />
            <TextField
              label="description"
              {...register("description")}
              className="block"
            />
            <TextField
              label="location"
              {...register("location")}
              className="block"
            />

            <Controller
              name="date"
              control={control}
              defaultValue={new Date()}
              render={({ field }) => (
                <DateTimePicker
                  {...field}
                  renderInput={(props) => (
                    <TextField {...props} className="block" />
                  )}
                />
              )}
            />

            <PlacesAutocomplete />
            <Button
              className="bg-blue-500"
              type="submit"
              color="primary"
              variant="contained"
            >
              Submit
            </Button>
          </div>
        </form>
      </div>
    </>
  );
};

export default Create;

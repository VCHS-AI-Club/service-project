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
import { useMutation } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import Script from "next/script";
import moment, { Moment } from "moment";
import { Loader } from "@googlemaps/js-api-loader";
import { env } from "../../env/client.mjs";

type FormData = {
  name: string;
  desc: string;
  start: Moment;
  end: Moment;
};
type Opp = {
  name: string;
  desc: string;
  lat: number;
  lon: number;
  start: number;
  end: number;
};

const PlacesAutocomplete = ({
  maps,
  setLoc,
}: {
  maps: typeof google.maps | null;
  setLoc: ({ lat, lon }: { lat: number; lon: number }) => void;
}) => {
  // https://hackernoon.com/create-your-reactjs-address-autocomplete-component-in-10-minutes-ws2j33ej
  if (!maps) return <div />; // TODO: Add spinner maybe
  const {
    ready,
    value,
    suggestions: { status, data },
    setValue,
    clearSuggestions,
  } = usePlacesAutocomplete({
    requestOptions: {
      googleMaps: maps, // @ts-ignore: lib uses `any` for some reason
    },
    debounce: 300,
  });
  const ref = useOnclickOutside(() => {
    // When user clicks outside of the component, we can dismiss
    // the searched suggestions by calling this method
    clearSuggestions();
  });

  const handleInput = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    // Update the keyword of the input element
    setValue(e.target.value);
  };

  const handleSelect =
    ({ description }: { description: string }) =>
    () => {
      // When user selects a place, we can replace the keyword without request data from API
      // by setting the second parameter to "false"
      setValue(description, false);
      clearSuggestions();

      // Get latitude and longitude via utility functions
      getGeocode({ address: description }).then((results) => {
        if (results[0]) {
          const { lat, lng: lon } = getLatLng(results[0]);
          setLoc({ lat, lon });
          console.log("📍 Coordinates: ", { lat, lon });
        }
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
    <div ref={ref} className="items-center justify-center flex flex-col">
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
  const { status } = useSession();
  const router = useRouter();
  if (status === "unauthenticated") {
    router.push("/");
  }

  const { register, handleSubmit, control } = useForm<FormData>();
  const [loc, setLoc] = useState<{ lat: number; lon: number }>({
    lat: 0,
    lon: 0,
  });

  const [maps, setMaps] = useState<typeof google.maps | null>(null);
  const { mutate } = useMutation(async (newOpp: Opp) => {
    console.log(newOpp);
    console.log(JSON.stringify(newOpp));
    // return await fetch("https://localhost:8080/opp", {
    //   method: "POST",
    //   headers: { "Content-Type": "application/json" },
    //   body: JSON.stringify({start: newOpp.start.toISOString(), newOpp}),
    // });
  });

  const onSubmit = (data: FormData) => {
    mutate({ ...data, start: data.start.unix(), end: data.end.unix(), ...loc });
  };

  useEffect(() => {
    const loader = new Loader({
      apiKey: env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY, 
      version: "weekly",
      libraries: ["places"],
    });
    loader.load().then(() => {
      setMaps(window.google.maps);
    });
  });

  return (
    <>
      <div>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="py-8 px-96 flex flex-col items-center content-center gap-4">
            <div className="flex flex-row justify-between gap-4">
              <TextField label="name" {...register("name")} className="block" />
              <Controller
                name="start"
                control={control}
                defaultValue={moment()}
                render={({ field }) => (
                  <DateTimePicker
                    {...field}
                    renderInput={(props) => (
                      <TextField
                        {...props}
                        className="block"
                        label="start time"
                      />
                    )}
                  />
                )}
              />
              <Controller
                name="end"
                control={control}
                defaultValue={moment()}
                render={({ field }) => (
                  <DateTimePicker
                    {...field}
                    renderInput={(props) => (
                      <TextField
                        {...props}
                        className="block"
                        label="end time"
                      />
                    )}
                  />
                )}
              />
            </div>
            <TextField
              label="description"
              {...register("desc")}
              className="block"
              multiline
              fullWidth
              // rows={10}
            />
            {maps && <PlacesAutocomplete maps={maps} setLoc={setLoc} />}{" "}
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

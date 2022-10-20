import { TextField } from "@mui/material";
import usePlacesAutocomplete, {
  getGeocode,
  getLatLng,
} from "use-places-autocomplete";
import useOnclickOutside from "react-cool-onclickoutside";

export const LocationAutocomplete = ({
  maps,
  setLoc,
}: {
  maps: typeof google.maps | null;
  setLoc: ({ lat, lon }: { lat: number; lon: number }) => void;
}) => {
  // https://hackernoon.com/create-your-reactjs-address-autocomplete-component-in-10-minutes-ws2j33ej
  const {
    ready,
    value,
    suggestions: { data },
    setValue,
    clearSuggestions,
  } = usePlacesAutocomplete({
    requestOptions: {
      googleMaps: maps,
    },
    debounce: 300,
  } as any);
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

  if (!maps) return <div />; // TODO: Add spinner maybe
  return (
    <div ref={ref} className="flex flex-col items-center justify-center">
      <TextField
        value={value}
        onChange={handleInput}
        disabled={!ready}
        label="location"
      />
      {/* We can use the "status" to decide whether we should display the dropdown or not */}
      {/* status === "OK" && <ul>{renderSuggestions()}</ul>*/}
      <ul>{renderSuggestions()}</ul>
    </div>
  );
};

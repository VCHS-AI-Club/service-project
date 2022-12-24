/** This file is full of cursed typescript. Proceed with caution.
 */

import usePlacesAutocomplete from "use-places-autocomplete";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { DateTimePicker } from "@mui/x-date-pickers";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import {
  Autocomplete,
  Checkbox as MuiCheckbox,
  FormControlLabel,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
  TextField,
} from "@mui/material";
import { Controller, useFormContext } from "react-hook-form";

// ============================================================================
// The following typescript is unnecessary, but it helps with autocomplete for
// form 'name' props. Because we use `useFormContext` to get the form methods,
// the `name` prop is a `string`, not the specific keys of the form schema.
// The two helper types below allow us to get the keys of the form schema that
// are of a specific type, and then use those keys as the `name` prop.
// ============================================================================

/** Gets keys on the type `Type` that are of type `Filter` if the key is a `string`.
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
  [Key in keyof Type]: Key extends string
    ? Type[Key] extends Filter
      ? Key
      : never
    : never;
}[keyof Type];

/** Creates an object that only has types `Filter` from the type `Type` where those types had `string` keys.
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

// ============================================================================
// If you want to use these form components without the complex typescript,
// replace all the `name` types with `string`.
// ============================================================================

type DatePickerProps<FormSchema> = {
  name: SelectKeysByValueType<FormSchema, Date>;
  label: string;
};

export function DatePicker<FormSchema>({
  name,
  label,
}: DatePickerProps<FormSchema>) {
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
}

type TextInputProps<FormSchema> = {
  name: SelectKeysByValueType<FormSchema, string | number | undefined>;
  label: string;
  optional?: boolean;
  multiline?: boolean;
};

export function TextInput<FormSchema>({
  label,
  name,
  multiline,
  optional = false,
}: TextInputProps<FormSchema>) {
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
          multiline={multiline}
          error={!!error}
          ref={ref}
          onBlur={onBlur}
          value={value}
          helperText={error?.message || ""}
        />
      )}
    />
  );
}

type CheckboxProps<FormSchema> = {
  name: SelectKeysByValueType<FormSchema, boolean>;
  label: string;
};

export function Checkbox<FormSchema>({
  name,
  label,
}: CheckboxProps<FormSchema>) {
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
}

type LocationAutocompleteProps<FormSchema> = {
  name: SelectKeysByValueType<FormSchema, string>;
};

export function LocationAutocomplete<FormSchema>({
  name,
}: LocationAutocompleteProps<FormSchema>) {
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
}

type MultiSelectProps<FormSchema> = {
  name: SelectKeysByValueType<FormSchema, string[]>;
  label: string;
  options: string[];
};

export function MultiSelect<FormSchema>({
  name,
  label,
  options,
}: MultiSelectProps<FormSchema>) {
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
}

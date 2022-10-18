import {
  Box,
  Button,
  Checkbox as MuiCheckbox,
  FormControlLabel,
  Modal,
} from "@mui/material";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Session } from "next-auth";
import Head from "next/head";
import { useEffect, useMemo, useState } from "react";
import { FormState, useForm } from "react-hook-form";
import { env } from "../env/client.mjs";

export type Interests = {
  children: boolean;
  setup_labor: boolean;
  audio_visual: boolean;
  teaching: boolean;
  food: boolean;
  environment: boolean;
  id: string;
};

export const InterestModal: React.FC<{
  interests: Interests | null;
  session: Session;
  open: boolean;
  setOpen: (_: boolean) => void;
}> = ({ interests, session, open, setOpen }) => {
  const [ints, setInts] = useState(interests || undefined);

  const { register, handleSubmit, reset, formState } = useForm<Interests>({
    defaultValues: ints,
  });
  useEffect(() => {
    reset(ints);
  }, [ints]);

  const queryClient = useQueryClient();
  const { mutate } = useMutation(
    ["interests.mutation"],
    (interests: Interests) => {
      setInts(interests);
      console.log("mutating put req");

      return fetch(env.NEXT_PUBLIC_API_URL + `/user/${session?.user?.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...interests, id: session?.user?.id }),
      });
    },
    { onSuccess: () => queryClient.invalidateQueries(["interests"]) }
  );

  const onSubmit = (data: Interests) => {
    console.log("mutating", data);
    setOpen(false);
    mutate(data);
  };

  const Checkbox: React.FC<{
    label: string;
    formId:
      | "children"
      | "setup_labor"
      | "audio_visual"
      | "teaching"
      | "food"
      | "environment";
  }> = ({ label, formId }) => {
    return (
      <FormControlLabel
        className="text-white"
        label={label}
        control={
          <MuiCheckbox
            {...register(formId)}
            defaultChecked={
              formState?.defaultValues && formState.defaultValues[formId]
            }
            className="!text-white"
          />
        }
      />
    );
  };

  return (
    <Modal
      open={open}
      onClose={() => setOpen(false)}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
      className="flex items-center justify-center"
    >
      <Box className="rounded-md bg-gray-900 p-16 ">
        <h2 className="text-4xl text-white">Interests</h2>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="items-left flex flex-col justify-center"
        >
          <Checkbox label="Food" formId="food" />
          <Checkbox label="Supervising Children" formId="children" />
          <Checkbox label="Teaching / Tutoring" formId="teaching" />
          <Checkbox label="Setup / Manual Labor" formId="setup_labor" />
          <Checkbox label="Audio Visual" formId="audio_visual" />
          <Checkbox label="Environmental" formId="environment" />

          <Button
            className="bg-blue-500"
            type="submit"
            color="primary"
            variant="contained"
          >
            Update
          </Button>
        </form>
      </Box>
    </Modal>
  );
};

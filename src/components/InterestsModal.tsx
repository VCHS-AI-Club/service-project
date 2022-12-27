import { Fragment, useRef, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { type RouterOutputs, trpc } from "../utils/trpc";
import { Button } from "./ui";
import Image from "next/image";
import { Checkbox } from "./form";
import { z } from "zod";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { interestFormSchema, interestsSchema } from "../schemas";

const InterestsModal: React.FC<{
  interests: RouterOutputs["user"]["interests"] | undefined;
  open: boolean;
  setOpen: (open: boolean) => void;
}> = ({ interests, open, setOpen }) => {
  console.log("interests", interests);

  const cancelButtonRef = useRef(null);

  const formSchema = z.object({
    church: z.boolean(),
    teaching: z.boolean(),
    children: z.boolean(),
    environment: z.boolean(),
    tech: z.boolean(),
    physical: z.boolean(),
  });
  type FormSchema = z.infer<typeof formSchema>;

  const methods = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      church: interests?.includes("church") ?? false,
      teaching: interests?.includes("teaching") ?? false,
      children: interests?.includes("children") ?? false,
      environment: interests?.includes("environment") ?? false,
      tech: interests?.includes("tech") ?? false,
      physical: interests?.includes("physical") ?? false,
    },
  });

  const { mutate } = trpc.user.updateInterests.useMutation();

  const onSubmit = async (data: FormSchema) => {
    // Parse data from form
    const interestsData = interestFormSchema.parse(data);
    // Filter out unchecked interests
    const interestsArray = Object.keys(interestsData).filter(
      (k) => interestsData[k as keyof typeof interestsData] === true
    );
    // Parse interests array
    const interests = interestsSchema.parse({ interests: interestsArray });
    console.log(interests);

    mutate(interests);

    setOpen(false);
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)}>
        <Transition.Root show={open} as={Fragment}>
          <Dialog
            as="div"
            className="relative z-10"
            initialFocus={cancelButtonRef}
            onClose={setOpen}
          >
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
            </Transition.Child>

            <div className="fixed inset-0 z-10 overflow-y-auto">
              <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                <Transition.Child
                  as={Fragment}
                  enter="ease-out duration-300"
                  enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                  enterTo="opacity-100 translate-y-0 sm:scale-100"
                  leave="ease-in duration-200"
                  leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                  leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                >
                  <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
                    <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                      <div className="sm:flex sm:items-start">
                        <Image
                          src="/logo.svg"
                          width={32}
                          height={32}
                          alt="logo"
                          className="mx-auto"
                        />
                        <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                          <Dialog.Title
                            as="h3"
                            className="text-lg font-medium leading-6 text-gray-900"
                          >
                            Update Interests
                          </Dialog.Title>
                          <div className="mt-2 flex flex-col">
                            <p className="text-sm text-gray-500">
                              Setting interests will help us recommend service
                              opportunities to you and to others.
                            </p>
                            <Checkbox<FormSchema>
                              name="church"
                              label="Church related service"
                            />
                            <Checkbox<FormSchema>
                              name="children"
                              label="Working with children"
                            />
                            <Checkbox<FormSchema>
                              name="physical"
                              label="Physical labor"
                            />
                            <Checkbox<FormSchema>
                              name="environment"
                              label="Helping the environment"
                            />
                            <Checkbox<FormSchema>
                              name="teaching"
                              label="Teaching related service"
                            />
                            <Checkbox<FormSchema>
                              name="tech"
                              label="Tech related service"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2 bg-gray-50 px-4 py-3 sm:flex-row-reverse sm:px-6">
                      <Button
                        // type="submit"
                        onClick={methods.handleSubmit(onSubmit)}
                      >
                        Submit
                      </Button>
                      <Button
                        type="button"
                        variant="secondary"
                        onClick={() => setOpen(false)}
                      >
                        Cancel
                      </Button>
                    </div>
                  </Dialog.Panel>
                </Transition.Child>
              </div>
            </div>
          </Dialog>
        </Transition.Root>
      </form>
    </FormProvider>
  );
};

export default InterestsModal;

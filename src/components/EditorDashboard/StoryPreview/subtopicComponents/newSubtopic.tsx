"use client";

import { Dialog, Listbox, Transition } from "@headlessui/react";
import { ChevronUpDownIcon } from "@heroicons/react/20/solid";
import { Fragment, useState } from "react";
import ConfirmNewSubtopic from "./confirmNewSubtopic";

type props = {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => any;
  topicList: any[];
  createSubtopic: (subtopic: string) => any;
};

export default function NewSubtopic({
  isOpen,
  setIsOpen,
  topicList,
  createSubtopic,
}: props) {
  if (topicList.length == 0) return null;

  const [topic, setTopic] = useState(topicList[0]);
  const [newSubtopic, setNewSubtopic] = useState("");
  const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false); //boolean to check if user submitted the form

  const create = () => {
    setIsSubmitted(true);
    if (newSubtopic !== "") setIsConfirmationModalOpen(true);
  };

  const handleClose = () => {
    setIsSubmitted(false);
    setIsOpen(false);
    setNewSubtopic("");
  };

  const addNewSubtopic = () => {
    createSubtopic(newSubtopic);
  };

  return (
    <div className="hidden">
      <Dialog
        open={isOpen}
        onClose={() => handleClose}
        className="relative z-50"
      >
        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="w-full max-w-xs rounded border bg-white px-3 pb-3 pt-2 shadow-lg shadow-gray-400">
            <Dialog.Title className="text-center text-lg font-semibold">
              Create subtopic tag
            </Dialog.Title>
            <div className="grid grid-cols-1 gap-5 pt-4">
              {/* <Listbox value={topic} onChange={setTopic}>
                <div className="relative mt-1">
                  <span className="font-bold">Topic</span>
                  <ListboxButton className="custom_input relative mt-1 w-full cursor-default py-2 pl-3 pr-10 text-left focus:outline-none sm:text-sm">
                    <span className="block truncate">{topic.data.name}</span>
                    <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                      <ChevronUpDownIcon
                        className="h-5 w-5 text-gray-400"
                        aria-hidden="true"
                      />
                    </span>
                  </ListboxButton>
                  <Transition
                    as={Fragment}
                    leave="transition ease-in duration-100"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                  >
                    <ListboxOptions className="border-1 absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md border border-gray-200 bg-white py-1  text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                      {topicList.map((topicItem, topicIdx) => (
                        <ListboxOption
                          key={topicIdx}
                          className={({ active }) =>
                            `relative cursor-default select-none py-2 pl-4 pr-4 ${
                              active
                                ? "bg-sciquelGreenSheen text-white"
                                : "text-gray-900"
                            }`
                          }
                          value={topicItem}
                        >
                          <span className="block truncate">
                            {topicItem.data.name}
                          </span>
                        </ListboxOption>
                      ))}
                    </ListboxOptions>
                  </Transition>
                </div>
              </Listbox> */}
              <label className="block">
                <span className="mb-1 font-bold">Subtopic name</span>
                <input
                  type="text"
                  value={newSubtopic}
                  onChange={(e) => {
                    setNewSubtopic(e.currentTarget.value);
                  }}
                  placeholder="Enter subtopic name..."
                  className="custom_input mt-1 block w-full"
                  maxLength={20}
                />
                <span
                  className={`${
                    isSubmitted && newSubtopic === "" ? "visible" : "hidden"
                  } text-sm font-medium text-red-500`}
                >
                  Please enter a subtopic
                </span>
              </label>
              <div className="flex justify-end gap-2">
                <button
                  className="btn btn-sm btn-cancel"
                  onClick={() => handleClose()}
                >
                  Cancel
                </button>
                <button
                  className="btn btn-sm btn-confirm"
                  onClick={() => create()}
                >
                  Create
                </button>
              </div>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>

      <ConfirmNewSubtopic
        isOpen={isConfirmationModalOpen}
        setIsOpen={setIsConfirmationModalOpen}
        setIsCreateSubtopicModalOpen={setIsOpen}
        setNewSubtopic={setNewSubtopic}
        setIsSubmitted={setIsSubmitted}
        createSubtopic={addNewSubtopic}
        title={"Are you sure?"}
        content={`Confirm you want to create a subtopic tag <span class='text-sciquelGreenSheen'> ${newSubtopic} </span>.`}
      />
    </div>
  );
}

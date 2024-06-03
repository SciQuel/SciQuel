"use client";

import { Dialog, Listbox, Transition } from "@headlessui/react";
import { ChevronUpDownIcon } from "@heroicons/react/20/solid";
import { Fragment, useState } from "react";
import ConfirmNewSubject from "./confirmNewSubject";

type props = {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => any;
  topicList: any[];
  createSubject: (subtopic: string) => any;
};

export default function NewSubject(props: props) {
  if (props.topicList.length == 0) return null;

  const [topic, setTopic] = useState(props.topicList[0]);
  const [newSubject, setNewSubject] = useState("");
  const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false); //boolean to check if user submitted the form

  const create = () => {
    setIsSubmitted(true);
    if (newSubject !== "") setIsConfirmationModalOpen(true);
  };

  const handleClose = () => {
    setIsSubmitted(false);
    props.setIsOpen(false);
    setNewSubject("");
  };

  const addNewSubject = () => {
    props.createSubject(newSubject);
  };

  return (
    <div className="hidden">
      <Dialog
        open={props.isOpen}
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
                  <Listbox.Button className="custom_input relative mt-1 w-full cursor-default py-2 pl-3 pr-10 text-left focus:outline-none sm:text-sm">
                    <span className="block truncate">{topic.data.name}</span>
                    <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                      <ChevronUpDownIcon
                        className="h-5 w-5 text-gray-400"
                        aria-hidden="true"
                      />
                    </span>
                  </Listbox.Button>
                  <Transition
                    as={Fragment}
                    leave="transition ease-in duration-100"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                  >
                    <Listbox.Options className="border-1 absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md border border-gray-200 bg-white py-1  text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                      {props.topicList.map((topicItem, topicIdx) => (
                        <Listbox.Option
                          key={topicIdx}
                          className={({ active }) =>
                            `relative cursor-default select-none py-2 pl-4 pr-4 ${
                              active
                                ? "bg-green-sheen text-white"
                                : "text-gray-900"
                            }`
                          }
                          value={topicItem}
                        >
                          <span className="block truncate">
                            {topicItem.data.name}
                          </span>
                        </Listbox.Option>
                      ))}
                    </Listbox.Options>
                  </Transition>
                </div>
              </Listbox> */}
              <label className="block">
                <span className="mb-1 font-bold">Subject name</span>
                <input
                  type="text"
                  value={newSubject}
                  onChange={(e) => {
                    setNewSubject(e.currentTarget.value);
                  }}
                  placeholder="Enter subject name..."
                  className="custom_input mt-1 block w-full"
                  maxLength={20}
                />
                <span
                  className={`${
                    isSubmitted && newSubject === "" ? "visible" : "hidden"
                  } text-sm font-medium text-red-500`}
                >
                  Please enter a subject
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

      <ConfirmNewSubject
        isOpen={isConfirmationModalOpen}
        setIsOpen={setIsConfirmationModalOpen}
        setIsCreateSubjectModalOpen={props.setIsOpen}
        setNewSubject={setNewSubject}
        setIsSubmitted={setIsSubmitted}
        createSubject={addNewSubject}
        title={"Are you sure?"}
        content={`Confirm you want to create a subject tag <span class='text-sciquelGreenSheen'> ${newSubject} </span>.`}
      />
    </div>
  );
}

"use client";

import { Dialog } from "@headlessui/react";

type props = {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => any;
  setIsCreateSubjectModalOpen: (isOpen: boolean) => any;
  setNewSubject: (subtopic: string) => any;
  setIsSubmitted: (bool: boolean) => any;
  createSubject: () => any;
  title: string;
  content: string;
};

export default function ConfirmNewSubject(props: props) {
  const confirm = () => {
    props.createSubject();

    //close all modals and reset data
    props.setIsSubmitted(false);
    props.setIsOpen(false);
    props.setNewSubject("");
    props.setIsCreateSubjectModalOpen(false);
  };

  return (
    <Dialog open={props.isOpen} onClose={() => null} className="relative z-50">
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="grid w-full max-w-md grid-cols-1 gap-4 rounded border bg-white  px-3 pb-3 pt-2 shadow-lg shadow-gray-400">
          <Dialog.Title className="text-left text-lg font-semibold">
            {props.title}
          </Dialog.Title>

          <p dangerouslySetInnerHTML={{ __html: props.content }}></p>

          <div className="flex justify-end gap-2">
            <button
              className="btn btn-sm btn-cancel"
              onClick={() => props.setIsOpen(false)}
            >
              Cancel
            </button>
            <button
              className="btn btn-sm btn-confirm"
              onClick={() => confirm()}
            >
              Confirm
            </button>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}

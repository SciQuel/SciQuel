"use client";

import { Dialog } from "@headlessui/react";

type props = {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => any;
  setIsCreateSubtopicModalOpen: (isOpen: boolean) => any;
  setNewSubtopic: (subtopic: string) => any;
  setIsSubmitted: (bool: boolean) => any;
  createSubtopic: () => any;
  title: string;
  content: string;
};

export default function ConfirmNewSubtopic({
  isOpen,
  setIsOpen,
  setIsCreateSubtopicModalOpen,
  setNewSubtopic,
  setIsSubmitted,
  createSubtopic,
  title,
  content,
}: props) {
  const confirm = () => {
    createSubtopic();

    //close all modals and reset data
    setIsSubmitted(false);
    setIsOpen(false);
    setNewSubtopic("");
    setIsCreateSubtopicModalOpen(false);
  };

  return (
    <Dialog open={isOpen} onClose={() => null} className="relative z-50">
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="grid w-full max-w-md grid-cols-1 gap-4 rounded border bg-white  px-3 pb-3 pt-2 shadow-lg shadow-gray-400">
          <Dialog.Title className="text-left text-lg font-semibold">
            {title}
          </Dialog.Title>

          <p dangerouslySetInnerHTML={{ __html: content }}></p>

          <div className="flex justify-end gap-2">
            <button
              className="btn btn-sm btn-cancel"
              onClick={() => setIsOpen(false)}
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

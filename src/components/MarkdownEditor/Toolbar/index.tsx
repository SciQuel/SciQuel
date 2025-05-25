"use client";

import { type editor } from "monaco-editor";
import bold from "./actions/bold";
import dictionarySentence from "./actions/dictionarySentence";
import dictionaryWord from "./actions/dictionaryWord";
import heading from "./actions/heading";
import image from "./actions/image";
import italic from "./actions/italic";
import link from "./actions/link";
import quote from "./actions/quote";
import EditFooterForm from "./EditFooterForm";
import ImageIcon from "./icons/ImageIcon";
import LinkIcon from "./icons/LinkIcon";
import ToolbarButton from "./ToolbarButton";
import ToolbarDropdown from "./ToolbarDropdown";
import ToolbarRule from "./ToolbarRule";
import withDialog from "./withDialog";

interface Props {
  editor: editor.IStandaloneCodeEditor | null;
  onSubmit?: () => void;
  loading: boolean;
  storyId: string;
  dictionaryWords: string[];
}

export default function Toolbar({
  editor,
  onSubmit,
  loading,
  storyId,
  dictionaryWords,
}: Props) {
  const ToolbarEditFooterButton = withDialog({
    disabled: editor === null || loading,
    tooltip: "Edit Story Footer",
    children: "Footer",
    modalBody: (labelId, _descriptionId, setIsOpen) => (
      <>
        <div className="flex flex-col p-4">
          <h2 id={labelId} className="text-lg font-semibold">
            Edit Story Footer
          </h2>
        </div>
        <hr />
        <EditFooterForm storyId={storyId} setIsOpen={setIsOpen} />
      </>
    ),
  });

  return (
    <div className="flex flex-row border-b bg-gray-100">
      <div className="flex grow flex-row gap-1 p-2">
        <ToolbarDropdown
          disabled={editor === null || loading}
          dropdownItems={new Array(6).fill(null, 0, 6).map((_value, index) => ({
            label: `Heading ${index + 1}`,
            onClick: () => {
              if (editor) {
                heading(editor, index + 1);
              }
            },
          }))}
        >
          Headings
        </ToolbarDropdown>
        <ToolbarRule />
        <ToolbarButton
          disabled={editor === null || loading}
          tooltip="Bold (Ctrl/⌘+B)"
          onClick={() => {
            if (editor) {
              bold(editor);
            }
          }}
        >
          <span className="font-bold">B</span>
        </ToolbarButton>
        <ToolbarButton
          disabled={editor === null || loading}
          tooltip="Italic (Ctrl/⌘+I)"
          onClick={() => {
            if (editor) {
              italic(editor);
            }
          }}
        >
          <span className="mr-[0.1rem] font-sourceSerif4 italic">I</span>
        </ToolbarButton>
        <ToolbarButton
          disabled={editor === null || loading}
          tooltip="Quote (Ctrl/⌘+Shift+9)"
          onClick={() => {
            if (editor) {
              quote(editor);
            }
          }}
        >
          <div className="mt-2 flex items-center">
            <span className="font-sourceSerif4 text-2xl font-bold leading-[5px]">
              ”
            </span>
          </div>
        </ToolbarButton>
        <ToolbarButton
          disabled={editor === null || loading}
          tooltip="Insert Link (Ctrl/⌘+K)"
          onClick={() => {
            if (editor) {
              link(editor);
            }
          }}
        >
          <div className="-my-1 h-5">
            <LinkIcon />
          </div>
        </ToolbarButton>
        <ToolbarButton
          disabled={editor === null || loading}
          tooltip="Insert Image (Ctrl/⌘+Shift+I)"
          onClick={() => {
            if (editor) {
              image(editor);
            }
          }}
        >
          <div className="-my-1 h-5">
            <ImageIcon />
          </div>
        </ToolbarButton>
        <ToolbarRule />
        <ToolbarButton
          disabled={editor === null || loading}
          onClick={() => {
            if (editor) {
              dictionarySentence(editor);
            }
          }}
        >
          Dict. Sentence
        </ToolbarButton>
        <ToolbarRule />
        <ToolbarDropdown
          disabled={editor === null || loading}
          dropdownItems={dictionaryWords.map((dictWord) => {
            return {
              label: dictWord,
              onClick: () => {
                if (editor) {
                  dictionaryWord(editor, dictWord);
                }
              },
            };
          })}
        >
          Dict. Words
        </ToolbarDropdown>
        <ToolbarRule />

        <ToolbarEditFooterButton />
      </div>
      <div className="flex h-full items-center px-2">
        <button
          onClick={onSubmit}
          disabled={editor === null || loading}
          className="select-none rounded-md bg-teal-600 px-2 py-1 text-sm font-semibold text-white disabled:pointer-events-none disabled:opacity-50"
        >
          Submit
        </button>
      </div>
    </div>
  );
}

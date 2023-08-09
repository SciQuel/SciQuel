"use client";

import { type editor } from "monaco-editor";
import bold from "./actions/bold";
import heading from "./actions/heading";
import image from "./actions/image";
import italic from "./actions/italic";
import link from "./actions/link";
import quote from "./actions/quote";
import ImageIcon from "./icons/ImageIcon";
import LinkIcon from "./icons/LinkIcon";
import ToolbarButton from "./ToolbarButton";
import ToolbarDropdown from "./ToolbarDropdown";
import ToolbarRule from "./ToolbarRule";

interface Props {
  editor: editor.IStandaloneCodeEditor | null;
}

export default function Toolbar({ editor }: Props) {
  return (
    <div className="flex flex-row gap-1 border-b bg-gray-100 p-2">
      <ToolbarDropdown
        disabled={editor === null}
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
        disabled={editor === null}
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
        disabled={editor === null}
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
        disabled={editor === null}
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
        disabled={editor === null}
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
        disabled={editor === null}
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
    </div>
  );
}

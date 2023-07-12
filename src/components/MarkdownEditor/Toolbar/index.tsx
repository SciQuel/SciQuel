"use client";

import { type editor } from "monaco-editor";
import React from "react";
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
  editorRef: editor.IStandaloneCodeEditor | null;
}

export default function Toolbar({ editorRef }: Props) {
  return (
    <div className="flex flex-row gap-1 border-b bg-gray-100 p-2">
      <ToolbarDropdown
        dropdownItems={new Array(6).fill(null, 0, 6).map((_value, index) => ({
          label: `Heading ${index + 1}`,
          onClick: () => {
            if (editorRef) {
              heading(editorRef, index + 1);
            }
          },
        }))}
      >
        Headings
      </ToolbarDropdown>
      <ToolbarRule />
      <ToolbarButton
        tooltip="Bold (Ctrl/⌘+B)"
        onClick={() => {
          if (editorRef) {
            bold(editorRef);
          }
        }}
      >
        <span className="font-bold">B</span>
      </ToolbarButton>
      <ToolbarButton
        tooltip="Italic (Ctrl/⌘+I)"
        onClick={() => {
          if (editorRef) {
            italic(editorRef);
          }
        }}
      >
        <span className="mr-[0.1rem] font-sourceSerif4 italic">I</span>
      </ToolbarButton>
      <ToolbarButton
        tooltip="Quote (Ctrl/⌘+Shift+9)"
        onClick={() => {
          if (editorRef) {
            quote(editorRef);
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
        tooltip="Insert Link (Ctrl/⌘+K)"
        onClick={() => {
          if (editorRef) {
            link(editorRef);
          }
        }}
      >
        <div className="-my-1 h-5">
          <LinkIcon />
        </div>
      </ToolbarButton>
      <ToolbarButton
        tooltip="Insert Image (Ctrl/⌘+Shift+I)"
        onClick={() => {
          if (editorRef) {
            image(editorRef);
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

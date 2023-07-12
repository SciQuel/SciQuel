"use client";

import { type editor } from "monaco-editor";
import React from "react";
import bold from "./actions/bold";
import image from "./actions/image";
import italic from "./actions/italic";
import link from "./actions/link";
import ToolbarButton from "./ToolbarButton";
import ToolbarRule from "./ToolbarRule";

interface Props {
  editorRef: editor.IStandaloneCodeEditor | null;
}

export default function Toolbar({ editorRef }: Props) {
  return (
    <div className="flex flex-row gap-1 border-b bg-gray-100 p-2">
      <ToolbarButton>Headings</ToolbarButton>
      <ToolbarRule />
      <ToolbarButton
        tooltip="Bold (Ctrl/⌘+B)"
        onClick={() => {
          if (editorRef) {
            bold(editorRef);
          }
        }}
      >
        B
      </ToolbarButton>
      <ToolbarButton
        tooltip="Italic (Ctrl/⌘+I)"
        onClick={() => {
          if (editorRef) {
            italic(editorRef);
          }
        }}
      >
        I
      </ToolbarButton>
      <ToolbarButton>Quote</ToolbarButton>
      <ToolbarButton
        tooltip="Insert Link (Ctrl/⌘+K)"
        onClick={() => {
          if (editorRef) {
            link(editorRef);
          }
        }}
      >
        Link
      </ToolbarButton>
      <ToolbarButton
        tooltip="Insert Image (Ctrl/⌘+Shift+I)"
        onClick={() => {
          if (editorRef) {
            image(editorRef);
          }
        }}
      >
        Image
      </ToolbarButton>
    </div>
  );
}

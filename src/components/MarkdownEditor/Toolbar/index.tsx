import { type editor } from "monaco-editor";
import React from "react";
import bold from "./actions/bold";
import italic from "./actions/italic";
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
        tooltip="Bold"
        onClick={() => {
          if (editorRef) {
            bold(editorRef);
          }
        }}
      >
        B
      </ToolbarButton>
      <ToolbarButton
        tooltip="Italic"
        onClick={() => {
          if (editorRef) {
            italic(editorRef);
          }
        }}
      >
        I
      </ToolbarButton>
      <ToolbarButton>Quote</ToolbarButton>
      <ToolbarButton>Link</ToolbarButton>
      <ToolbarButton>Image</ToolbarButton>
    </div>
  );
}

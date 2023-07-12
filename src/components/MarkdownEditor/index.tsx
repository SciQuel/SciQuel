"use client";

import { generateMarkdown } from "@/lib/markdown";
import clsx from "clsx";
import { type editor } from "monaco-editor";
import dynamic from "next/dynamic";
import { Inter } from "next/font/google";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import Toolbar from "./Toolbar";
import bold from "./Toolbar/actions/bold";
import italic from "./Toolbar/actions/italic";

const Editor = dynamic(
  () => import("@monaco-editor/react").then((module) => module.Editor),
  { ssr: false },
);

const inter = Inter({ subsets: ["latin"] });

export default function MarkdownEditor() {
  const [value, setValue] = useState("");
  const [renderedContent, setRenderedContent] = useState<ReactNode>(null);
  const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null);

  useEffect(() => {
    void generateMarkdown(value).then((file) => {
      setRenderedContent(file.result);
    });
  }, [value]);

  const handleEditorMount = useCallback(
    (editor: editor.IStandaloneCodeEditor) => {
      editorRef.current = editor;

      // monaco-editor requires Browser API, so it is dynamically imported on component render
      void import("monaco-editor").then(({ KeyMod, KeyCode }) => {
        editor.addAction({
          id: "insertBold",
          label: "Insert Bold Area",
          keybindings: [KeyMod.CtrlCmd | KeyCode.KeyB],
          run: (editor) => {
            bold(editor);
          },
        });
        editor.addAction({
          id: "insertItalic",
          label: "Insert Italic Area",
          keybindings: [KeyMod.CtrlCmd | KeyCode.KeyI],
          run: (editor) => {
            italic(editor);
          },
        });
      });
    },
    [],
  );

  return (
    <div className="flex grow flex-row">
      <div className={clsx("flex w-1/2 flex-col border-r", inter.className)}>
        <Toolbar editorRef={editorRef.current} />
        <Editor
          language="markdown"
          loading={<></>}
          value={value}
          onChange={(v) => setValue(v ?? "")}
          options={{
            wordWrap: "on",
            padding: { top: 10 },
            minimap: { enabled: false },
            lineNumbers: "off",
            unicodeHighlight: { ambiguousCharacters: false },
            suggest: { showWords: false },
          }}
          onMount={handleEditorMount}
        />
      </div>
      <div className="flex max-h-full w-1/2 flex-col overflow-scroll">
        <div className="h-0">
          <div className="flex flex-col gap-5 pt-5 @container">
            {renderedContent}
          </div>
        </div>
      </div>
    </div>
  );
}

"use client";

import { type patchStorySchema } from "@/app/api/stories/schema";
import { generateMarkdown } from "@/lib/markdown";
import axios from "axios";
import clsx from "clsx";
import { type editor } from "monaco-editor";
import dynamic from "next/dynamic";
import { Inter } from "next/font/google";
import { useRouter } from "next/navigation";
import {
  useCallback,
  useEffect,
  useState,
  useTransition,
  type ReactNode,
} from "react";
import { type z } from "zod";
import StatusBar from "./StatusBar";
import Toolbar from "./Toolbar";
import bold from "./Toolbar/actions/bold";
import image from "./Toolbar/actions/image";
import italic from "./Toolbar/actions/italic";
import link from "./Toolbar/actions/link";
import quote from "./Toolbar/actions/quote";

const Editor = dynamic(
  () => import("@monaco-editor/react").then((module) => module.Editor),
  { ssr: false },
);

const inter = Inter({ subsets: ["latin"] });

interface Props {
  initialValue?: string;
  id: string;
}

export default function MarkdownEditor({ initialValue, id }: Props) {
  const router = useRouter();
  const [dirty, setDirty] = useState(false);
  const [value, setValue] = useState(initialValue ?? "");
  const [renderedContent, setRenderedContent] = useState<ReactNode>(null);
  const [editor, setEditor] = useState<editor.IStandaloneCodeEditor | null>(
    null,
  );
  const [stats, setStats] = useState<Record<string, number>>({});
  const [loading, startTransition] = useTransition();

  useEffect(() => {
    void generateMarkdown(value).then(({ file, wordStats }) => {
      setStats(wordStats);
      setRenderedContent(file.result);
    });
  }, [value]);

  const handleEditorMount = useCallback(
    (editor: editor.IStandaloneCodeEditor) => {
      setEditor(editor);

      // monaco-editor requires Browser API, so it is dynamically imported on component render
      void import("monaco-editor").then(({ KeyMod, KeyCode }) => {
        editor.addAction({
          id: "insertRemoveBold",
          label: "Insert/Remove Bold Area",
          keybindings: [KeyMod.CtrlCmd | KeyCode.KeyB],
          run: (editor) => {
            bold(editor);
          },
        });
        editor.addAction({
          id: "insertRemoveItalic",
          label: "Insert/Remove Italic Area",
          keybindings: [KeyMod.CtrlCmd | KeyCode.KeyI],
          run: (editor) => {
            italic(editor);
          },
        });
        editor.addAction({
          id: "insertRemoveBlockquote",
          label: "Insert/Remove Blockquote",
          keybindings: [KeyMod.CtrlCmd | KeyMod.Shift | KeyCode.Digit9],
          run: (editor) => {
            quote(editor);
          },
        });
        editor.addAction({
          id: "insertLink",
          label: "Insert Link",
          keybindings: [KeyMod.CtrlCmd | KeyCode.KeyK],
          run: (editor) => {
            link(editor);
          },
        });
        editor.addAction({
          id: "insertImage",
          label: "Insert Image",
          keybindings: [KeyMod.CtrlCmd | KeyMod.Shift | KeyCode.KeyI],
          run: (editor) => {
            image(editor);
          },
        });
      });
    },
    [],
  );

  const handleEditorSubmit = useCallback(() => {
    startTransition(async () => {
      if (dirty) {
        await axios.patch<z.infer<typeof patchStorySchema>>(
          `/api/stories/id/${id}`,
          {
            content: value,
          },
        );
      }
      router.push(`/editor/dashboard`);
    });
  }, [value, id]);

  return (
    <div className="flex h-full min-h-screen grow flex-row">
      <div className={clsx("flex w-1/2 flex-col border-r", inter.className)}>
        <Toolbar
          editor={editor}
          onSubmit={handleEditorSubmit}
          loading={loading}
          storyId={id}
        />
        <div className="grow">
          <Editor
            language="markdown"
            loading={<></>}
            value={value}
            onChange={(v) => {
              setValue(v ?? "");
              setDirty(true);
            }}
            options={{
              wordWrap: "on",
              readOnly: loading,
              padding: { top: 10 },
              minimap: { enabled: false },
              lineNumbers: "off",
              unicodeHighlight: { ambiguousCharacters: false },
              suggest: { showWords: false },
            }}
            onMount={handleEditorMount}
          />
        </div>
        <StatusBar wordStats={stats} />
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

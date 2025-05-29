import { editor } from "monaco-editor";

export default function dictionaryWord(
  editor: editor.ICodeEditor,
  word: string,
) {
  const selection = editor.getSelection() ?? null;
  const model = editor.getModel();
  if (selection && model) {
    const middleText = model.getValueInRange(selection);

    editor.executeEdits("insert-dict-word", [
      {
        range: selection,
        text: `:dictionary-word[${middleText}]{word=${word}}`,
      },
    ]);

    editor.focus();
  } else {
    editor.focus();
  }
}

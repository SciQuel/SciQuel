import { editor } from "monaco-editor";

export default function dictionarySentence(editor: editor.ICodeEditor) {
  const selection = editor.getSelection() ?? null;
  const model = editor.getModel();
  if (selection && model) {
    const middleText = model.getValueInRange(selection);

    editor.executeEdits("insert-dict-sentence", [
      {
        range: selection,
        text: `:dictionary-sentence[${middleText}]`,
      },
    ]);

    editor.focus();
  } else {
    editor.focus();
  }
}

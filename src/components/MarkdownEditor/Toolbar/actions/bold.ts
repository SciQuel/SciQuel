import { type editor } from "monaco-editor";

export default function bold(editor: editor.ICodeEditor) {
  const selection = editor.getSelection() ?? null;
  if (selection !== null) {
    const wrappedText = editor.getModel()?.getValueInRange(selection) ?? "";
    editor.executeEdits("insert-bold", [
      { range: selection, text: `**${wrappedText}**` },
    ]);
  }
  editor.focus();
  const position = editor.getPosition();
  position &&
    editor.setPosition({
      column: position.column - 2,
      lineNumber: position.lineNumber,
    });
}

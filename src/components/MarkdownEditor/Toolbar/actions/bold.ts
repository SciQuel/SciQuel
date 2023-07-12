import { type editor } from "monaco-editor";

export default function bold(editor: editor.ICodeEditor) {
  const selection = editor.getSelection() ?? null;
  if (selection !== null) {
    const wrappedText = editor.getModel()?.getValueInRange(selection) ?? "";

    if (
      (wrappedText.startsWith("**") && wrappedText.endsWith("**")) ||
      (wrappedText.startsWith("__") && wrappedText.endsWith("__"))
    ) {
      editor.executeEdits("remove-bold", [
        {
          range: selection,
          text: wrappedText.slice(2, wrappedText.length - 2),
        },
      ]);
    } else {
      editor.executeEdits("insert-bold", [
        { range: selection, text: `**${wrappedText}**` },
      ]);
    }
  }
  editor.focus();
  if (
    selection &&
    selection.startLineNumber === selection.endLineNumber &&
    selection.startColumn === selection.endColumn
  ) {
    const position = editor.getPosition();
    position &&
      editor.setPosition({
        column: position.column - 2,
        lineNumber: position.lineNumber,
      });
  }
}

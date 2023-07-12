import { type editor } from "monaco-editor";

export default function italic(editor: editor.ICodeEditor) {
  const selection = editor.getSelection() ?? null;
  if (selection !== null) {
    const wrappedText = editor.getModel()?.getValueInRange(selection) ?? "";
    if (
      (wrappedText.startsWith("*") && wrappedText.endsWith("*")) ||
      (wrappedText.startsWith("_") && wrappedText.endsWith("_"))
    ) {
      editor.executeEdits("remove-italic", [
        {
          range: selection,
          text: wrappedText.slice(1, wrappedText.length - 1),
        },
      ]);
    } else {
      editor.executeEdits("insert-italic", [
        { range: selection, text: `*${wrappedText}*` },
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

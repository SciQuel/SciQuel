import { type editor } from "monaco-editor";

export default function link(editor: editor.ICodeEditor) {
  const selection = editor.getSelection() ?? null;
  if (selection !== null) {
    const wrappedText = editor.getModel()?.getValueInRange(selection) ?? "";
    try {
      new URL(wrappedText);
      editor.executeEdits("insert-link", [
        { range: selection, text: `[Link Text](${wrappedText})` },
      ]);
      editor.focus();
      const newSelection = selection
        .setStartPosition(selection.startLineNumber, selection.startColumn + 1)
        .setEndPosition(
          selection.endLineNumber,
          selection.startColumn + 1 + "Link Text".length,
        );
      editor.setSelection(newSelection);
    } catch {
      editor.executeEdits("insert-link", [
        { range: selection, text: `[${wrappedText}](https://example.com)` },
      ]);
      editor.focus();
      if (
        selection &&
        selection.startLineNumber === selection.endLineNumber &&
        selection.startColumn === selection.endColumn
      ) {
        const position = editor.getPosition();
        position &&
          editor.setPosition({
            column: position.column - "](https://example.com)".length,
            lineNumber: position.lineNumber,
          });
      } else {
        const newSelection = selection
          .setEndPosition(
            selection.endLineNumber,
            selection.startColumn +
              wrappedText.length +
              3 +
              "https://example.com".length,
          )
          .setStartPosition(
            selection.startLineNumber,
            selection.startColumn + wrappedText.length + 3,
          );
        editor.setSelection(newSelection);
      }
    }
  } else {
    editor.focus();
  }
}

import { type editor } from "monaco-editor";

export default function image(editor: editor.ICodeEditor) {
  const selection = editor.getSelection() ?? null;
  if (selection !== null) {
    const wrappedText = editor.getModel()?.getValueInRange(selection) ?? "";
    try {
      new URL(wrappedText);
      editor.executeEdits("insert-image", [
        {
          range: selection,
          text: `::large-image[Image Caption]{src=${wrappedText}}`,
        },
      ]);
      editor.focus();
      const newSelection = selection
        .setStartPosition(
          selection.startLineNumber,
          selection.startColumn + "::large-image[".length,
        )
        .setEndPosition(
          selection.endLineNumber,
          selection.startColumn +
            "::large-image[".length +
            "Image Caption".length,
        );
      editor.setSelection(newSelection);
    } catch {
      editor.executeEdits("insert-image", [
        {
          range: selection,
          text: `::large-image[${wrappedText}]{src=https://picsum.photos/id/162/800/400}`,
        },
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
            column:
              position.column -
              "]{src=https://picsum.photos/id/162/800/400}".length,
            lineNumber: position.lineNumber,
          });
      } else {
        const newSelection = selection
          .setEndPosition(
            selection.endLineNumber,
            selection.startColumn +
              wrappedText.length +
              "::large-image[".length +
              "]{src=https://picsum.photos/id/162/800/400".length,
          )
          .setStartPosition(
            selection.startLineNumber,
            selection.startColumn +
              wrappedText.length +
              "::large-image[".length +
              "]{src=".length,
          );
        editor.setSelection(newSelection);
      }
    }
  } else {
    editor.focus();
  }
}

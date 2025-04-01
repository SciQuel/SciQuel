import { type editor } from "monaco-editor";

export default function heading(editor: editor.ICodeEditor, heading: number) {
  const selection = editor.getSelection();
  const editorModel = editor.getModel();
  if (selection !== null && editorModel !== null) {
    const content = editorModel.getLineContent(selection.startLineNumber);
    const edits: editor.IIdentifiedSingleEditOperation[] = [];
    const detectedHeading =
      new Array(6)
        .fill(null, 0, 6)
        .map((_value, index) => {
          return content.startsWith("#".repeat(index + 1) + " ");
        })
        .indexOf(true) + 1;

    if (detectedHeading > 0) {
      edits.push({
        range: selection
          .setStartPosition(selection.startLineNumber, 1)
          .setEndPosition(
            selection.startLineNumber,
            editorModel.getLineMaxColumn(selection.startLineNumber),
          ),
        text: content.slice(detectedHeading + 1),
      });
    }
    if (detectedHeading !== heading) {
      edits.push({
        range: selection
          .setStartPosition(selection.startLineNumber, 1)
          .setEndPosition(selection.startLineNumber, 1),
        text: "#".repeat(heading) + " ",
      });

      editor.executeEdits(`insert-heading-${heading}`, edits);
    }
  }
  editor.focus();
}

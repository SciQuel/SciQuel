import { type editor } from "monaco-editor";

export default function quote(editor: editor.ICodeEditor) {
  const selection = editor.getSelection();
  const editorModel = editor.getModel();
  if (selection !== null && editorModel !== null) {
    const edits: editor.IIdentifiedSingleEditOperation[] = [];
    const inserting = !editorModel.getValueInRange(selection).startsWith("> ");
    for (
      let line = selection.startLineNumber;
      line < selection.endLineNumber + 1;
      line++
    ) {
      const lineContent = editorModel.getLineContent(line);
      if (inserting) {
        !lineContent.startsWith("> ") &&
          edits.push({
            range: selection.setStartPosition(line, 1).setEndPosition(line, 1),
            text: "> ",
          });
      } else {
        lineContent.startsWith("> ") &&
          edits.push({
            range: selection
              .setStartPosition(line, 1)
              .setEndPosition(line, editorModel.getLineMaxColumn(line)),
            text: lineContent.slice(2),
          });
      }
    }
    editor.executeEdits(inserting ? "insert-quote" : "remove-quote", edits);
  }
  editor.focus();
}

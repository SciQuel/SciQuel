import ToolbarButton from "./ToolbarButton";
import ToolbarRule from "./ToolbarRule";

export default function Toolbar() {
  return (
    <div className="flex flex-row gap-1 border-b bg-gray-100 p-2">
      <ToolbarButton>Headings</ToolbarButton>
      <ToolbarRule />
      <ToolbarButton tooltip="Bold">B</ToolbarButton>
      <ToolbarButton tooltip="Italic">I</ToolbarButton>
      <ToolbarButton tooltip="Underline">U</ToolbarButton>
      <ToolbarButton tooltip="Strikethrough">S</ToolbarButton>
      <ToolbarButton>Quote</ToolbarButton>
      <ToolbarButton>Link</ToolbarButton>
      <ToolbarButton>Image</ToolbarButton>
    </div>
  );
}

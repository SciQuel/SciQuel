import ToolbarButton from "./ToolbarButton";
import ToolbarRule from "./ToolbarRule";

export default function Toolbar() {
  return (
    <div className="flex flex-row gap-1 border-b bg-gray-100 p-2">
      <ToolbarButton>Headings</ToolbarButton>
      <ToolbarRule />
      <ToolbarButton>B</ToolbarButton>
      <ToolbarButton>I</ToolbarButton>
      <ToolbarButton>U</ToolbarButton>
      <ToolbarButton>S</ToolbarButton>
      <ToolbarButton>Quote</ToolbarButton>
      <ToolbarButton>Link</ToolbarButton>
      <ToolbarButton>Image</ToolbarButton>
    </div>
  );
}

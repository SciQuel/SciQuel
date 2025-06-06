import ArrowDown from "../../../../public/assets/images/oi-chevron-down.svg";

interface Props {
  openDropDown: string;
  title: string;
  onClick: (title: string) => void;
}
const DropDownTabs: React.FC<Props> = ({ openDropDown, title, onClick }) => {
  return (
    <>
      <div
        className=" flex h-[45px] w-full  flex-shrink-0  cursor-pointer border-b-2"
        onClick={() => onClick(title)}
      >
        {" "}
        {title}
        <button className="ml-auto mr-5">
          <ArrowDown transform={openDropDown === title ? "rotate(180)" : ""} />
        </button>
      </div>
    </>
  );
};
export default DropDownTabs;

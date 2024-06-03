type TagProps = {
  id: number;
  name: string;
  color: string;
  removeTag: (id: number) => any;
};

export default function Tags({ id, name, color, removeTag }: TagProps) {
  return (
    <div className={`tags ${color}`}>
      <span className="w-100">{name}</span>
      <div className="py-[6px]">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          version="1.1"
          width="8"
          height="8"
          className="cursor-pointer"
          onClick={() => removeTag(id)}
        >
          <line
            x1="0"
            y1="0"
            x2="8"
            y2="8"
            className="stroke-black stroke-2 hover:shadow-lg hover:shadow-black"
          />
          <line
            x1="0"
            y1="8"
            x2="8"
            y2="0"
            className="stroke-black stroke-2 hover:shadow-lg hover:shadow-black"
          />
        </svg>
      </div>
    </div>
  );
}

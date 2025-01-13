import { type DictionaryDefinition } from "@prisma/client";
import DictionaryListItem from "./DictionaryListItem/DictionaryListItem";

interface Props {
  definitions: DictionaryDefinition[];
}

export default async function DictionaryList({ definitions }: Props) {
  return (
    <div>
      <h2 className="text-2xl font-bold">List of current definitions:</h2>
      <ul className="my-3 flex flex-row flex-wrap items-stretch justify-center gap-4">
        {definitions.map((definition) => (
          <li
            key={definition.id}
            className={`min-w-full flex-1 rounded-lg border
          border-slate-600 p-4 md:min-w-[45%] lg:min-w-[28%]`}
          >
            <DictionaryListItem definition={definition} />
          </li>
        ))}
      </ul>
    </div>
  );
}

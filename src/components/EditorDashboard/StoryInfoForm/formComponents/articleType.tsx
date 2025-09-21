import { StoryType } from "@prisma/client";
import clsx from "clsx";
import React from "react";

type Props = {
  value: StoryType;
  onChange: (value: StoryType) => void;
  required?: boolean;
  disabled?: boolean;
  setDirty: (value: boolean) => void;
};

const ArticleType = ({
  value,
  onChange,
  required = true,
  disabled = false,
  setDirty,
}: Props) => {
  return (
    <label className="my-5 block">
      Story Type
      <select
        className={clsx(
          `peer w-full rounded-md px-2 py-1 placeholder-transparent outline outline-1
                outline-gray-200 hover:outline-sciquelTeal focus:outline-2 focus:outline-sciquelTeal
                focus:ring-0`,
          "disabled:pointer-events-none disabled:bg-gray-50 disabled:text-gray-300",
        )}
        required={required}
        value={value}
        onChange={(e) => {
          setDirty(true);
          onChange(e.target.value as "DIGEST" | "ESSAY");
        }}
        disabled={disabled}
      >
        <option value="DIGEST">Digest</option>
        <option value="ESSAY">Essay</option>
      </select>
    </label>
  );
};

export default ArticleType;

import clsx from "clsx";
import React from "react";

type Props = {
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
  indicateRequired?: boolean;
  disabled?: boolean;
  setDirty: (value: boolean) => void;
};

const ArticleType = ({
  value,
  onChange,
  required = true,
  indicateRequired = true,
  disabled = false,
  setDirty,
}: Props) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDirty(true);
    onChange(e.target.value);
  };

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
        placeholder="Select a story type"
        required={required}
        indicateRequired={indicateRequired}
        value={value}
        onChange={handleChange}
        disabled={disabled}
      >
        <option value="DIGEST">Digest</option>
        <option value="ESSAY">Essay</option>
      </select>
    </label>
  );
};

export default ArticleType;

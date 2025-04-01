import FormInput from "@/components/Form/FormInput";
import React from "react";

type Props = {
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
  indicateRequired?: boolean;
  disabled?: boolean;
  setDirty: (value: boolean) => void;
};

const ArticleTitle = ({
  value,
  onChange,
  required = false,
  indicateRequired = false,
  disabled = false,
  setDirty,
}: Props) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDirty(true);
    onChange(e.target.value);
  };

  return (
    <FormInput
      title="Story Title"
      required={required}
      indicateRequired={indicateRequired}
      value={value}
      onChange={handleChange}
      disabled={disabled}
    />
  );
};

export default ArticleTitle;

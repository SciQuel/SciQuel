import FormInput from "@/components/Form/FormInput";
import React from "react";

type Props = {
  value: Date | null;
  onChange: (value: Date) => void;
  required?: boolean;
  indicateRequired?: boolean;
  disabled?: boolean;
  setDirty: (value: boolean) => void;
};

const ArticleDate = ({
  value,
  onChange,
  required = false,
  indicateRequired = false,
  disabled = false,
  setDirty,
}: Props) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDirty(true);
    onChange(e.target.valueAsDate);
  };

  return (
    <FormInput
      title="Publish Date"
      required={required}
      indicateRequired={indicateRequired}
      type="date"
      value={value}
      onChange={handleChange}
      disabled={disabled}
    />
  );
};

export default ArticleDate;

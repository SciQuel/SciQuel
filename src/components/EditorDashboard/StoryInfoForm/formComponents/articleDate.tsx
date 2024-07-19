import FormInput from "@/components/Form/FormInput";
import React, { useState } from "react";

type Props = {
  value: Date | null;
  onChange: (value: Date | null) => void;
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
  // formats a date object (the input) to a string in the format YYYY-MM-DD
  const formatDate = (date: Date | null): string => {
    if (!date) return "";
    const year = date.getFullYear().toString().padStart(4, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  // Initialize inputValue with the formatted date
  const [inputValue, setInputValue] = useState<string>(formatDate(value));

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDirty(true);
    const newValue = e.target.value;
    setInputValue(newValue);

    // go through string get yr, month, and day as numbers
    const [year, month, day] = newValue.split("-").map(Number);

    // validate the date
    if (year && month && day && year >= 1000 && year <= 9999) {
      const dateValue = new Date(year, month - 1, day);
      onChange(dateValue);
    }
  };

  return (
    <FormInput
      title="Publish Date"
      required={required}
      indicateRequired={indicateRequired}
      type="date"
      value={inputValue}
      onChange={handleChange}
      disabled={disabled}
    />
  );
};

export default ArticleDate;

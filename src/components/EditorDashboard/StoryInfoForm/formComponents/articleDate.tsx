import FormInput from "@/components/Form/FormInput";
import React, { useEffect, useState } from "react";

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
  // preprocesses date object into YY/MM/DD into a string
  const formatDate = (date: Date | null): string => {
    if (!date) return "";
    const year = date.getFullYear().toString().padStart(4, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  // initializing our default states for the date and time states
  const [dateValue, setDateValue] = useState<string>(formatDate(value));
  const [hours, setHours] = useState<string>("12");
  const [minutes, setMinutes] = useState<string>("00");
  const [ampm, setAmpm] = useState<string>("");

  // calls onChange to update the date object with the given inputs
  const updateDate = (
    dateStr: string,
    hours: string,
    minutes: string,
    ampm: string,
  ) => {
    const [year, month, day] = dateStr.split("-").map(Number);
    let hrs = parseInt(hours);
    const m = parseInt(minutes);

    // switches AM/PM with logic
    if (ampm === "PM" && hrs < 12) hrs += 12;
    if (ampm === "AM" && hrs === 12) hrs = 0;

    // checking if input is valid
    if (year && month && day && hrs >= 0 && hrs <= 23 && m >= 0 && m <= 59) {
      const date = new Date(year, month - 1, day, hrs, m);
      onChange(date);
    } else {
      onChange(null);
    }
  };

  // handles changes in date input
  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDirty(true);
    const newDateValue = e.target.value;
    setDateValue(newDateValue);
    updateDate(newDateValue, hours, minutes, ampm);
  };

  // handles changes in hours input
  const handleHoursChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDirty(true);
    const newHours = e.target.value;
    if (parseInt(newHours) > 12 || parseInt(newHours) < 1) {
      alert("Hours must be between 1 and 12.");
    } else {
      setHours(newHours);
      if (newHours.length === 2) {
        // update once hours are valid
        updateDate(dateValue, newHours, minutes, ampm);
      }
    }
  };

  // handles changes in minutes input
  const handleMinutesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDirty(true);
    const newMinutes = e.target.value;
    if (parseInt(newMinutes) > 59) {
      alert("Minutes must be between 0 and 59.");
    } else {
      setMinutes(newMinutes);
      if (newMinutes.length === 2) {
        // update once minutes are valid
        updateDate(dateValue, hours, newMinutes, ampm);
      }
    }
  };
  // handles am/pm changes
  const handleAmpmChange = (newAmpm: string) => {
    setDirty(true);
    setAmpm(newAmpm);
    updateDate(dateValue, hours, minutes, newAmpm);
  };

  return (
    // This returns the Publish Date form and the time forms (HRS/mins) in one line
    <div className="flex items-center space-x-4">
      <FormInput
        title="Publish Date"
        required={required}
        indicateRequired={indicateRequired}
        type="date"
        value={dateValue}
        onChange={handleDateChange}
        disabled={disabled}
      />

      {/* Hours form */}
      <div className="flex items-center space-x-2">
        <FormInput
          title="Time: Hours "
          required={required}
          indicateRequired={indicateRequired}
          type="text"
          value={hours}
          onChange={handleHoursChange}
          disabled={disabled}
          maxLength={2}
        />
        <span className="relative top-2 text-xl">:</span>{" "}
        {/* Colon separation */}
        {/* Minutes Form */}
        <FormInput
          title="Minutes"
          required={required}
          indicateRequired={indicateRequired}
          type="text"
          value={minutes}
          onChange={handleMinutesChange}
          disabled={disabled}
          maxLength={2}
        />
        {/* AM/PM buttons that change color on click */}
        <button
          type="button"
          className={`px-2 py-1 ${
            ampm === "AM"
              ? "bg-sciquelTeal text-white"
              : "bg-gray-200 text-black"
          } relative top-3`}
          onClick={() => handleAmpmChange("AM")}
          disabled={disabled}
        >
          AM
        </button>
        <button
          type="button"
          className={`px-2 py-1 ${
            ampm === "PM"
              ? "bg-sciquelTeal text-white"
              : "bg-gray-200 text-black"
          } relative top-3`}
          onClick={() => handleAmpmChange("PM")}
          disabled={disabled}
        >
          PM
        </button>
      </div>
    </div>
  );
};

export default ArticleDate;

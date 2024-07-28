import FormInput from "@/components/Form/FormInput";
import React, { useEffect, useState } from "react";

type Props = {
  value: string | null;
  onChange: (value: string | null) => void;
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
  // preprocesses date object into YYYY-MM-DD string
  const formatDate = (date: string | null): string => {
    if (!date) return "";
    const dateObj = new Date(date);
    if (isNaN(dateObj.getTime())) return "";

    console.log(dateObj)

    const year = dateObj.getFullYear().toString();
    const month = (dateObj.getMonth() + 1).toString().padStart(2, "0");
    const day = dateObj.getDate().toString().padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const getHours = (date: string | null): string => {
    if (!date) return "";
    const dateObj = new Date(date);
    if (isNaN(dateObj.getTime())) return "";

    const hour = dateObj.getHours();
    const formattedHour = hour % 12 || 12;
    return formattedHour.toString().padStart(2, "0");
  };

  const getMinutes = (date: string | null): string => {
    if (!date) return "";
    const dateObj = new Date(date);
    if (isNaN(dateObj.getTime())) return "";

    const minutes = dateObj.getMinutes();
    return minutes.toString().padStart(2, "0");
  };

  const getAMPM = (date: string | null): string => {
    if (!date) return "";
    const dateObj = new Date(date);
    if (isNaN(dateObj.getTime())) return "";

    const hour = dateObj.getHours();
    return hour < 12 ? "AM" : "PM";
  };

  // initializing our default states for the date and time states
  const [dateValue, setDateValue] = useState<string>(formatDate(value));
  const [hours, setHours] = useState<string>(getHours(value));
  const [minutes, setMinutes] = useState<string>(getMinutes(value));
  const [ampm, setAmpm] = useState<string>(getAMPM(value));

  useEffect(() => {
    setDateValue(formatDate(value));
    setHours(getHours(value));
    setMinutes(getMinutes(value));
    setAmpm(getAMPM(value));
  }, [value]);

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
      onChange(date.toISOString());
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
        title="Publish Date (EDT)"
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
          title="Hours "
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

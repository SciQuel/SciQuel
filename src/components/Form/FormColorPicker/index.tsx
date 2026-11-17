"use client";

import { type ChangeEventHandler } from "react";

export default function FormColorPicker({
  title,
  onChange,
  addedStyle = "",
  value = "#000000",
}: {
  title: string;
  onChange: ChangeEventHandler<HTMLInputElement>;
  addedStyle?: string;
  value?: string;
}) {
  return (
    <div className={`mt-2 flex flex-col ${addedStyle}`}>
      <label>{title}</label>
      <input type="color" onChange={onChange} value={value}></input>
    </div>
  );
}

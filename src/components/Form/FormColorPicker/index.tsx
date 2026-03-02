"use client";

import clsx from "clsx";
import { type ChangeEventHandler } from "react";

export default function FormColorPicker({
  title,
  onChange,
}: {
  title: string;
  onChange: ChangeEventHandler<HTMLInputElement>;
}) {
  return (
    <div className="mt-6">
      <p>{title}</p>
      <input type="color" onChange={onChange}></input>
    </div>
  );
}

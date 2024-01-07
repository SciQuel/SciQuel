"use client";

import axios from "axios";
import { useState, type FormEvent } from "react";

interface Props {
  endpoint: string;
}

export function ContactForm({ endpoint }: Props) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  async function submitForm(e: FormEvent) {
    e.preventDefault();

    try {
      const response = await axios.post(endpoint, {
        message: message,
        contact_name: name,
        reply_email: email,
      });
    } catch (err) {
      console.error(err);
    }
    return;
  }

  return (
    <form
      className="flex w-full flex-col"
      onError={(err) => {
        console.warn(err);
      }}
      onSubmit={(e) => {
        submitForm(e)
          .then(() => {
            console.log("success");
          })
          .catch((err) => {
            console.error(err);
          });
      }}
    >
      <label htmlFor="contact-name-input" className="text-xl font-semibold">
        Name{" "}
        <span className=" text-base font-normal text-sciquelCaption">
          (required)
        </span>
      </label>
      <input
        id="contact-name-input"
        className="mb-2 rounded-md border-2  border-sciquelTeal p-1 text-xl"
        type="text"
        name="contact_name"
        required={true}
        onChange={(e) => {
          setName(e.target.value);
        }}
      ></input>

      <label htmlFor="contact-email-input" className=" text-xl font-semibold">
        Email{" "}
        <span className="text-base font-normal  text-sciquelCaption">
          (required)
        </span>
      </label>
      <input
        required={true}
        type="email"
        name="reply_email"
        id="contact-email-input"
        onChange={(e) => {
          setEmail(e.target.value);
        }}
        className="mb-2 rounded-md border-2 border-sciquelTeal p-1 text-xl"
      ></input>

      <label htmlFor="contact-comment-input" className=" text-xl font-semibold">
        Message
      </label>
      <textarea
        className="rounded-md border-2 border-sciquelTeal  p-1 text-xl"
        id="contact-comment-input"
        name="message"
        rows={8}
        onChange={(e) => {
          setMessage(e.target.value);
        }}
      ></textarea>

      <button
        type="submit"
        className="my-4 w-fit rounded-md bg-sciquelTeal px-4 py-2 text-xl font-semibold text-white transition-colors duration-100 hover:bg-[#046969] focus:bg-[#046969] focus:ring-4 focus:ring-[#a1c2be] sm:text-2xl"
      >
        Get Involved!
      </button>
    </form>
  );
}

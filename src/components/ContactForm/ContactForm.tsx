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
  const [showError, setShowError] = useState(false);

  const [submitted, setSubmitted] = useState(false);

  async function submitForm(e: FormEvent) {
    e.preventDefault();

    try {
      const response = await axios.post(endpoint, {
        message: message,
        contact_name: name,
        reply_email: email,
      });
      if (response.status == 200) {
        setSubmitted(true);
      }
    } catch (err) {
      console.error(err);
      setShowError(true);
    }
    return;
  }

  return (
    <>
      {submitted ? (
        <div className="w-full px-2">
          <h1 className="text-2xl font-bold text-[#046969]">Thank You!</h1>
          <p>Thank you for contacting us!</p>
          <p>
            Your message has been received. Please give some time for review.
          </p>
        </div>
      ) : (
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

          <label
            htmlFor="contact-email-input"
            className=" text-xl font-semibold"
          >
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

          <label
            htmlFor="contact-comment-input"
            className=" text-xl font-semibold"
          >
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
          {showError ? (
            <div className="my-2 w-full rounded border-2 border-red-500 bg-red-200 p-2">
              <p>Something went wrong. Please try again later.</p>
              <p>
                If the problem persists, please reach out to us at{" "}
                <a href="mailto:team@sciquel.org">team@sciquel.org</a>
              </p>
            </div>
          ) : (
            <></>
          )}
          <button
            type="submit"
            className="my-4 w-fit rounded-md bg-sciquelTeal px-4 py-2 text-xl font-semibold text-white transition-colors duration-100 hover:bg-[#046969] focus:bg-[#046969] focus:ring-4 focus:ring-[#a1c2be] sm:text-2xl"
          >
            Get Involved!
          </button>
        </form>
      )}
    </>
  );
}

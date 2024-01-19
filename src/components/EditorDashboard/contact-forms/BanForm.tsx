"use client";

import env from "@/lib/env";
import { type ContactMessage } from "@prisma/client";
import axios from "axios";
import { useState, type FormEvent } from "react";

interface Props {
  message: ContactMessage;
  closeFunction: () => void;
  updateScreenFunction: () => void;
}

export default function UserBanForm({
  message,
  closeFunction,
  updateScreenFunction,
}: Props) {
  const [useIp, setUseIp] = useState(false);
  const [useEmail, setUseEmail] = useState(false);
  const [reason, setReason] = useState("");
  const [shouldArchive, setShouldArchive] = useState(false);
  const [error, setError] = useState("");

  async function submitForm(e: FormEvent) {
    e.preventDefault();

    let newError = "";

    if (!useIp && !useEmail) {
      newError += "Please choose either ban by IP and/or ban by email. ";
    }
    if (!reason) {
      newError += "Please clarify a reason for banning.";
    }

    if (newError) {
      setError(newError);
      return;
    }
    console.log("no errors");

    try {
      if (useIp) {
        const ipResponse = await axios.post(
          `${env.NEXT_PUBLIC_SITE_URL}/api/contact/admin`,
          {
            method: "IP",
            value: message.senderIp,
            reason: reason,
            should_archive: shouldArchive,
          },
        );
      }
      if (useEmail) {
        const emailResponse = await axios.post(
          `${env.NEXT_PUBLIC_SITE_URL}/api/contact/admin`,
          {
            method: "EMAIL",
            value: message.email,
            reason: reason,
            should_archive: shouldArchive,
          },
        );
      }

      if (shouldArchive) {
        updateScreenFunction();
      }
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <div className="m-1 flex flex-col border-2 border-sciquelTeal p-2">
      <button
        className="mb-2 w-fit self-end rounded bg-sciquelTeal p-2 text-white"
        type="button"
        onClick={closeFunction}
      >
        X Close Form
      </button>
      <form
        onSubmit={(e) => {
          submitForm(e);
        }}
      >
        <h1>Ban this user from submitting contact forms?</h1>
        {message.senderIp != "unknown" ? (
          <div>
            <label>
              <input
                type="checkbox"
                checked={useIp}
                onChange={() => {
                  setUseIp(!useIp);
                }}
              />
              <span>Ban by IP</span>
            </label>{" "}
          </div>
        ) : (
          <></>
        )}
        <div>
          <label>
            <input
              type="checkbox"
              checked={useEmail}
              onChange={() => {
                setUseEmail(!useEmail);
              }}
            />
            <span>Ban by Email</span>
          </label>
        </div>
        <label>
          Reason for Ban (required): <br />
          <textarea
            className="w-full"
            required={true}
            value={reason}
            onChange={(e) => {
              setReason(e.currentTarget.value);
            }}
          ></textarea>
        </label>
        <br />
        <label>
          <input
            type="checkbox"
            checked={shouldArchive}
            onChange={() => {
              setShouldArchive(!shouldArchive);
            }}
          ></input>
          Archive messages from this user
        </label>
        <button
          type="submit"
          className="my-2 rounded  bg-sciquelTeal px-2 py-1 text-white"
        >
          Submit Ban Request
        </button>
        {error ? (
          <div className=" rounded border-2 border-red-500 bg-red-50 p-1">
            {error}
          </div>
        ) : (
          <></>
        )}
      </form>
    </div>
  );
}

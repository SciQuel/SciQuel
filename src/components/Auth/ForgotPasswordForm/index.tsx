"use client";

import Form from "@/components/Form";
import FormInput from "@/components/Form/FormInput";
import { useState } from "react";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  return (
    <Form
      className="flex flex-col"
      onSubmit={(e) => {
        e.preventDefault();
        setSubmitted(true);
      }}
    >
      <h1 className="text-center text-4xl font-semibold text-sciquelTeal">
        Forgot Password
      </h1>
      {submitted ? (
        <p className="mt-6">
          An email has been sent to <b>{email}</b> with instructions to reset
          your password.
        </p>
      ) : (
        <>
          <FormInput
            title="Email"
            required
            indicateRequired={false}
            value={email}
            type="email"
            onChange={(e) => setEmail(e.target.value)}
          />
          <button
            type="submit"
            className={`mt-6 rounded-md bg-sciquelTeal px-2 py-1 font-semibold text-white
        transition-all hover:brightness-90`}
          >
            Submit
          </button>
        </>
      )}
    </Form>
  );
}

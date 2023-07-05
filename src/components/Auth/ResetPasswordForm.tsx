"use client";

import Form from "@/components/Form";
import FormInput from "@/components/Form/FormInput";
import axios from "axios";
import Link from "next/link";
import { useState } from "react";

interface Props {
  token: string;
}

export default function ResetPasswordForm({ token }: Props) {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [submitted, setSubmitted] = useState(false);

  return (
    <Form
      onSubmit={(e) => {
        e.preventDefault();
        axios
          .post("/api/auth/reset-password", { token, password })
          .then((res) => {
            if (res.status === 200) {
              setSubmitted(true);
            }
          })
          .catch((err) => {
            // TODO: Implement proper error messaging
            console.log(err);
          });
      }}
      className="flex flex-col"
    >
      <h1 className="text-center text-4xl font-semibold text-sciquelTeal">
        Reset Password
      </h1>
      {submitted ? (
        <p className="mt-6">
          Your password has been successfully reset. Please login{" "}
          <Link href="/auth/login" className="text-sciquelTeal">
            here
          </Link>
          .
        </p>
      ) : (
        <>
          <FormInput
            title="Password (8-64 characters)"
            type="password"
            required
            indicateRequired={false}
            value={password}
            minLength={8}
            maxLength={64}
            onChange={(e) => setPassword(e.target.value)}
          />
          <FormInput
            title="Confirm Password"
            type="password"
            required
            indicateRequired={false}
            value={confirmPassword}
            invalid={password !== confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          <button
            type="submit"
            disabled={password.length === 0 || confirmPassword !== password}
            className={`mt-4 rounded-md bg-sciquelTeal px-2 py-1 font-semibold text-white
        transition-all hover:brightness-90 disabled:bg-gray-300 disabled:hover:brightness-100`}
          >
            Reset Password
          </button>
        </>
      )}
    </Form>
  );
}

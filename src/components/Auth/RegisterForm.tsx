"use client";

import Form from "@/components/Form";
import FormInput from "@/components/Form/FormInput";
import Link from "next/link";
import { useState } from "react";

export default function RegisterForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  return (
    <Form
      onSubmit={(e) => {
        e.preventDefault();
      }}
      className="flex flex-col"
    >
      <h1 className="text-center text-4xl font-semibold text-sciquelTeal">
        Register
      </h1>
      <FormInput
        title="Email"
        required
        indicateRequired={false}
        value={email}
        type="email"
        onChange={(e) => setEmail(e.target.value)}
      />
      <FormInput
        title="Password"
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
        disabled={email.length === 0 || password.length === 0}
        className={`mt-4 rounded-md bg-sciquelTeal px-2 py-1 font-semibold text-white
        transition-all hover:brightness-90 disabled:bg-gray-300 disabled:hover:brightness-100`}
      >
        Sign up
      </button>
      <p className="mt-6 text-sm text-sciquelDarkText">
        Already have an account?{" "}
        <Link href="/auth/login" className="text-sciquelTeal">
          Log in here
        </Link>
      </p>
    </Form>
  );
}

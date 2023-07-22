"use client";

import Form from "@/components/Form";
import FormInput from "@/components/Form/FormInput";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { useState } from "react";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <Form
      onSubmit={(e) => {
        e.preventDefault();
        void signIn("credentials", { email, password });
      }}
      className="flex flex-col"
    >
      <h1 className="text-center text-4xl font-semibold text-sciquelTeal">
        Login
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
        onChange={(e) => setPassword(e.target.value)}
      />
      <div className="mt-2 text-sm text-sciquelTeal">
        <Link href="/auth/forgot-password">Forgot your password?</Link>
      </div>
      <button
        type="submit"
        disabled={email.length === 0 || password.length === 0}
        className={`mt-4 rounded-md bg-sciquelTeal px-2 py-1 font-semibold text-white
        transition-all hover:brightness-90 disabled:bg-gray-300 disabled:hover:brightness-100`}
      >
        Log in
      </button>
      <p className="mt-6 text-sm text-sciquelDarkText">
        Haven't signed up yet?{" "}
        <Link href="/auth/register" className="text-sciquelTeal">
          Sign up here
        </Link>
      </p>
    </Form>
  );
}

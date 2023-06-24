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
      <Link
        className="mt-2 text-sm text-sciquelDarkText"
        href="/auth/forgot-password"
      >
        Forgot your password?
      </Link>
      <button
        type="submit"
        className={`mt-4 rounded-md bg-sciquelTeal px-2 py-1 font-semibold text-white
        transition-all hover:brightness-90`}
      >
        Log in
      </button>
    </Form>
  );
}

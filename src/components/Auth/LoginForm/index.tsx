"use client";

import Form from "@/components/Form";
import FormInput from "@/components/Form/FormInput";
import { signIn } from "next-auth/react";
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
      <button
        type="submit"
        className={`b mt-6 rounded-md bg-sciquelTeal px-2 py-1 font-semibold text-white
        transition-all hover:brightness-90`}
      >
        Submit
      </button>
    </Form>
  );
}

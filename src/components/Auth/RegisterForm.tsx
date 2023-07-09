"use client";

import Form from "@/components/Form";
import FormInput from "@/components/Form/FormInput";
import axios from "axios";
import Link from "next/link";
import { redirect, useRouter } from "next/navigation";
import { useState } from "react";

export default function RegisterForm() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const router = useRouter();

  return (
    <Form
      onSubmit={(e) => {
        e.preventDefault();
        axios
          .post("/api/auth/register", {
            firstName,
            lastName,
            email,
            password,
          })
          .then((res) => {
            if (res.status === 201) {
              setSubmitted(true);
            }
          })
          .catch(() => {
            return router.replace("/auth/register?error=Default");
          });
      }}
      className="flex flex-col"
    >
      <h1 className="text-center text-4xl font-semibold text-sciquelTeal">
        Register
      </h1>
      {submitted ? (
        <p className="mt-6">
          Account successfully created for <b>{email}</b>. Please check the
          instructions sent to your email to complete your account registration.
        </p>
      ) : (
        <>
          <FormInput
            title="First Name"
            required
            indicateRequired={false}
            value={firstName}
            type="text"
            minLength={1}
            onChange={(e) => setFirstName(e.target.value)}
          />
          <FormInput
            title="Last Name"
            required
            indicateRequired={false}
            value={lastName}
            type="text"
            minLength={1}
            onChange={(e) => setLastName(e.target.value)}
          />
          <FormInput
            title="Email"
            required
            indicateRequired={false}
            value={email}
            type="email"
            onChange={(e) => setEmail(e.target.value)}
          />
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
            disabled={
              firstName.length === 0 ||
              lastName.length === 0 ||
              email.length === 0 ||
              password.length === 0 ||
              password !== confirmPassword
            }
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
        </>
      )}
    </Form>
  );
}

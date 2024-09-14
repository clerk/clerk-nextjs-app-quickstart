"use client";

import { useSignUp, useUser } from "@clerk/nextjs";
import { useSearchParams, useRouter } from "next/navigation";
import { useState, useEffect, FormEvent } from "react";

export default function Page() {
  const { user } = useUser();
  const router = useRouter();
  const { isLoaded, signUp, setActive } = useSignUp();
  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string>("");

  // Handle signed-in users visiting this page
  // This will also redirect the user once they finish the sign-up process
  useEffect(() => {
    if (user?.id) {
      router.push("/");
    }
  }, [router, user]);

  // Get the token from the query params
  const token = useSearchParams().get("__clerk_ticket");

  // If there is no invitation token, restrict access to this page
  if (!token) {
    return <p>No invitation token found.</p>;
  }

  // Handle submission of the sign-up form
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");

    if (!isLoaded) return;

    if (!firstName || !lastName || !password) {
      setError("All fields are required");
      return;
    }

    try {
      if (!token) return null;

      // Create a new sign-up with the supplied invitation token.
      // Make sure you're also passing the ticket strategy.
      // After the below call, the user's email address will be
      // automatically verified because of the invitation token.
      const signUpAttempt = await signUp.create({
        strategy: "ticket",
        ticket: token,
        firstName,
        lastName,
        password,
      });

      console.log("signUpAttempt", signUpAttempt);

      // If the sign-up was completed, set the session to active
      if (signUpAttempt.status === "complete") {
        await setActive({ session: signUpAttempt.createdSessionId });
      } else {
        // If the status is not complete, check why.
        // User may need to complete more steps.
        console.error(JSON.stringify(signUpAttempt, null, 2));
      }
    } catch (err) {
      console.error(JSON.stringify(err, null, 2));
      setError("Failed to sign up, please try again.");
    }
  };

  return (
    <>
      <h1>Sign up</h1>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="firstName">Enter first name</label>
          <input
            id="firstName"
            type="text"
            name="firstName"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="lastName">Enter last name</label>
          <input
            id="lastName"
            type="text"
            name="lastName"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="password">Enter password</label>
          <input
            id="password"
            type="password"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div>
          <button type="submit">Next</button>
        </div>
      </form>
    </>
  );
}

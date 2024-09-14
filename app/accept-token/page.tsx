"use client";
import { useUser, useSignIn } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

export default function Page() {
  const [loading, setLoading] = useState<boolean>(false);
  const { signIn, setActive } = useSignIn();
  const { user } = useUser();

  // Get the token from the query params
  const signInToken = useSearchParams().get("token");

  useEffect(() => {
    if (!signIn || !setActive || !signInToken || user || loading) {
      return;
    }

    const createSignIn = async () => {
      setLoading(true);
      try {
        // Create the `SignIn` with the token
        const signInAttempt = await signIn.create({
          strategy: "ticket",
          ticket: signInToken as string,
        });

        // If the sign-in was successful, set the session to active
        if (signInAttempt.status === "complete") {
          setActive({
            session: signInAttempt.createdSessionId,
          });
        } else {
          // If the sign-in attempt is not complete, check why.
          // User may need to complete further steps.
          console.error(JSON.stringify(signInAttempt, null, 2));
        }
      } catch (err) {
        // See https://clerk.com/docs/custom-flows/error-handling
        // for more info on error handling
        console.error("Error:", JSON.stringify(err, null, 2));
      } finally {
        setLoading(false);
      }
    };

    createSignIn();
  }, [signIn, setActive, signInToken, user, loading]);

  if (!signInToken) {
    return <div>No token provided.</div>;
  }

  if (!user) {
    return null;
  }

  if (loading) {
    return <div>Signing you in...</div>;
  }

  return <div>Signed in as {user.id}</div>;
}

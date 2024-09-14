"use client";

import { useClerk } from "@clerk/nextjs";

export const CustomSignOutButton = () => {
  const { signOut } = useClerk();

  return (
    // Clicking on this button will sign out a user
    // and reroute them to the "/" (home) page.
    <button onClick={() => signOut({ redirectUrl: "/about" })}>Sign out</button>
  );
};

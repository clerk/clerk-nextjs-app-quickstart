import { SignInButton, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import "../globals.css";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <header>
        <SignedOut>
          <SignInButton />
        </SignedOut>
        <SignedIn>
          <UserButton />
        </SignedIn>
      </header>
      <div>{children}</div>
    </>
  );
}

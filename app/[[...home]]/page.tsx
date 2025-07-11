import Image from "next/image";
import Link from "next/link";
import {
  SignIn,
  SignInButton,
  SignUp,
  SignOutButton,
  SignedIn,
  SignedOut,
} from "@clerk/nextjs";
import { ClerkLogo } from "../components/clerk-logo";

export default function Page() {
  return (
    <main className="flex flex-col justify-center items-center min-h-full p-8 pb-20 gap-4 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <div className="inline-flex">
        <div className="[&_svg]:w-[50px] [&_svg]:h-[50px]">
          <ClerkLogo />
        </div>

        <h1 className="text-5xl font-bold tracking-tight text-[#131316]">
          Welcome to Clerk
        </h1>
      </div>

      <p className="pl-[50px] mb-2 text-center">
        Get started by signing up as your first user
      </p>

      <div className="flex gap-4 items-center flex-col sm:flex-row">
        <SignedOut>
          <SignUp />
        </SignedOut>

        <SignedIn>
          <SignedIn>
            <Link
              href="/dashboard"
              className="px-4 py-2 rounded-full bg-[#131316] text-white text-sm font-semibold"
            >
              Dashboard
            </Link>
          </SignedIn>
          <SignOutButton />
        </SignedIn>
      </div>
    </main>
  );
}

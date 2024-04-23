import { SignIn, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";

export default function Home() {
  return (
    <div className="h-screen">
      <SignedIn>
        <UserButton />
      </SignedIn>
    </div>
  )
}

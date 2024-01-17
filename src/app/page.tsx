import { SignInButton, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";

export default function Home() {
  return (
    <div className="h-screen">
      <SignedOut>
        <SignInButton />
        <p>This content is public. Only signed out users can see this.</p>
      </SignedOut>
      <SignedIn>
        <UserButton />
        <p>This content is private. Only signed in users can see this.</p>
      </SignedIn>
    </div>
  )
}

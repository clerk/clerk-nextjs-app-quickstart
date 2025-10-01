import { AuthenticateWithRedirectCallback } from '@clerk/nextjs'

export default function Page() {
  // Set the `continueSignUpUrl` to the route of your "Continue" page
  // Once a user authenticates with the OAuth provider, they will be redirected to that route
  return (
    <>
      {/* Required for sign-up flows
      Clerk's bot sign-up protection is enabled by default */}
      <div id="clerk-captcha" />
      <AuthenticateWithRedirectCallback continueSignUpUrl="/sign-in/continue" />
    </>
  )
}

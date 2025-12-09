# Clerk Next.js Library

The Clerk library for Next.js provides convenient helpers for authentication and session management using Clerk with Next.js App Router.

> Note: This library is intended for use with the Next.js App Router.

## Installation

Install the package with:

```bash
npm install @clerk/nextjs
```

or

```bash
yarn add @clerk/nextjs
```

## Video tutorial

YouTube tutorial: [Next.js App Router Authentication with Clerk](https://clerk.com/docs/quickstarts/nextjs)

## Pre-flight

Make sure the following values are present in your `.env.local` environment variables file. The Publishable Key and Secret Key can be found in the Clerk Dashboard.

```bash
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="pk_test_..." # retrieved from the Clerk Dashboard
CLERK_SECRET_KEY="sk_test_..." # retrieved from the Clerk Dashboard
```

## Getting started

### 1. Add `clerkMiddleware()` to your app

`clerkMiddleware()` grants you access to user authentication state throughout your app, on both the server and client side.

Create a `proxy.ts` file at the root of your project, or in your `src/` directory if you have one.

```tsx
// proxy.ts
import { clerkMiddleware } from '@clerk/nextjs/server'

export default clerkMiddleware()

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
}
```

By default, `clerkMiddleware()` will not protect any routes. All routes are public and you must opt-in to protection for routes.

### 2. Add `<ClerkProvider>` and Clerk components to your app

Clerk's `<ClerkProvider>` component provides session and user context to Clerk's hooks and components. Add it to your root layout:

```tsx
// app/layout.tsx
import { ClerkProvider, SignInButton, SignUpButton, SignedIn, SignedOut, UserButton } from '@clerk/nextjs'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body>
          <header>
            <SignedOut>
              <SignInButton />
              <SignUpButton />
            </SignedOut>
            <SignedIn>
              <UserButton />
            </SignedIn>
          </header>
          {children}
        </body>
      </html>
    </ClerkProvider>
  )
}
```

### 3. Use Clerk components in your pages

You can control which content signed-in and signed-out users can see with Clerk's prebuilt control components:

```tsx
// app/page.tsx
import { SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/nextjs'

export default function Home() {
  return (
    <div>
      <SignedOut>
        <p>You are signed out</p>
        <SignInButton />
      </SignedOut>
      <SignedIn>
        <p>You are signed in!</p>
        <UserButton />
      </SignedIn>
</div>
  )
}
```

## Protecting routes

To protect specific routes, you can use `clerkMiddleware()` with route matchers:

```tsx
// proxy.ts
import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'

const isProtectedRoute = createRouteMatcher([
  '/dashboard(.*)',
  '/admin(.*)',
])

export default clerkMiddleware((auth, req) => {
  if (isProtectedRoute(req)) auth().protect()
})

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
}
```

## Server-side authentication

### Get the current user

Use the `currentUser()` helper to access information about the current user in Server Components, Route Handlers, and Server Actions:

```tsx
import { currentUser } from '@clerk/nextjs/server'

export default async function Page() {
  const user = await currentUser()

  if (!user) return <div>Not signed in</div>

  return <div>Hello {user?.firstName}</div>
}
```

### Protect API routes

Use the `auth()` helper to protect API routes:

```tsx
// app/api/protected/route.ts
import { auth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'

export async function GET() {
  const { userId } = auth()

  if (!userId) {
    return new NextResponse('Unauthorized', { status: 401 })
  }

  return NextResponse.json({ message: 'Hello authenticated user!' })
}
```

## Client-side hooks

Clerk provides several React hooks for accessing authentication state on the client side:

### `useUser()`

Access the current user object:

```tsx
'use client'
import { useUser } from '@clerk/nextjs'

export default function Profile() {
  const { isSignedIn, user, isLoaded } = useUser()

  if (!isLoaded) return <div>Loading...</div>

  if (!isSignedIn) return <div>Not signed in</div>

  return <div>Hello {user.firstName}!</div>
}
```

### `useAuth()`

Access authentication state and helpers:

```tsx
'use client'
import { useAuth } from '@clerk/nextjs'

export default function SignOutButton() {
  const { isSignedIn, signOut } = useAuth()

  if (!isSignedIn) return null

  return <button onClick={() => signOut()}>Sign out</button>
}
```

## Customization

### Custom sign-in and sign-up pages

Create custom authentication pages by using Clerk's `<SignIn />` and `<SignUp />` components:

```tsx
// app/sign-in/[[...sign-in]]/page.tsx
import { SignIn } from '@clerk/nextjs'

export default function Page() {
  return <SignIn />
}
```

```tsx
// app/sign-up/[[...sign-up]]/page.tsx
import { SignUp } from '@clerk/nextjs'

export default function Page() {
  return <SignUp />
}
```

### Environment variables for redirects

Configure redirect URLs using environment variables:

```bash
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/dashboard
```

## Advanced usage

### Access tokens

Get access tokens for making authenticated requests to external APIs:

```tsx
import { auth } from '@clerk/nextjs/server'

export default async function Page() {
  const { getToken } = auth()

  const token = await getToken({ template: 'supabase' })

  // Use token to make authenticated requests
  const response = await fetch('https://api.example.com/data', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  return <div>Data loaded</div>
}
```

### Organizations

Clerk supports multi-tenant applications with organizations:

```tsx
'use client'
import { useOrganization } from '@clerk/nextjs'

export default function OrganizationProfile() {
  const { organization, isLoaded } = useOrganization()

  if (!isLoaded) return <div>Loading...</div>

  if (!organization) return <div>No organization selected</div>

  return <div>Welcome to {organization.name}</div>
}
```

## Troubleshooting

### Common issues

1. **Missing environment variables**: Ensure `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` and `CLERK_SECRET_KEY` are set in your `.env.local` file.

2. **Middleware not working**: Make sure your `proxy.ts` file is in the correct location (root or `src/` directory) and has the proper matcher configuration.

3. **Hydration errors**: Wrap client-side Clerk components in `<SignedIn>` and `<SignedOut>` to prevent hydration mismatches.

### Debug mode

Enable debug logs by setting the `CLERK_DEBUG` environment variable:

```bash
CLERK_DEBUG=true
```

### Session management

Clerk automatically handles session management, but you can customize session behavior:

```tsx
// app/layout.tsx
import { ClerkProvider } from '@clerk/nextjs'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ClerkProvider
      appearance={{
        baseTheme: 'dark', // or 'light'
        variables: {
          colorPrimary: '#000',
        },
      }}
    >
      <html lang="en">
        <body>{children}</body>
      </html>
    </ClerkProvider>
  )
}
```

### Multi-factor authentication

Enable MFA in your Clerk Dashboard and users can set up additional security:

```tsx
'use client'
import { useUser } from '@clerk/nextjs'

export default function SecuritySettings() {
  const { user } = useUser()

  const enableMFA = async () => {
    await user?.createTOTP()
  }

  return (
    <div>
      <button onClick={enableMFA}>
        Enable Two-Factor Authentication
      </button>
    </div>
  )
}
```

## Deploy

Easily deploy the template to Vercel with the button below. You will need to set the required environment variables in the Vercel dashboard.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fclerk%2Fclerk-nextjs-app-quickstart&env=NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY,CLERK_SECRET_KEY&envDescription=Clerk%20API%20keys&envLink=https%3A%2F%2Fclerk.com%2Fdocs%2Fquickstart%2Fnextjs&redirect-url=https%3A%2F%2Fclerk.com%2Fdocs%2Fquickstart%2Fnextjs)

## Running the template

```bash
git clone https://github.com/clerk/clerk-nextjs-app-quickstart
cd clerk-nextjs-app-quickstart
npm install
npm run dev
```

To run the example locally, you need to:

1. Clone the repository and navigate to the directory
2. Install dependencies with `npm install`
3. Create a `.env.local` file and add your Clerk keys
4. Run `npm run dev` to launch the development server
5. Visit `http://localhost:3000` and click "Sign in" to test authentication

## Learn more

To learn more about Clerk and Next.js, check out the following resources:

- [Quickstart: Get started with Next.js and Clerk](https://clerk.com/docs/quickstarts/nextjs?utm_source=DevRel&utm_medium=docs&utm_campaign=templates&utm_content=clerk-nextjs-app-quickstart)
- [Clerk Documentation](https://clerk.com/docs?utm_source=DevRel&utm_medium=docs&utm_campaign=templates&utm_content=clerk-nextjs-app-quickstart)
- [Next.js Documentation](https://nextjs.org/docs)
- [Clerk Components Reference](https://clerk.com/docs/reference/components/overview)
- [Clerk Hooks Reference](https://clerk.com/docs/reference/hooks/overview)

## Support

### Found an issue or want to leave feedback

Feel free to create a support thread on our [Discord](https://clerk.com/discord). Our support team will be happy to assist you in the `#support` channel.

### Connect with us

You can discuss ideas, ask questions, and meet others from the community in our [Discord](https://discord.com/invite/b5rXHjAg7A).

If you prefer, you can also find support through our [Twitter](https://twitter.com/ClerkDev), or you can [email](mailto:support@clerk.dev) us!

## About

The Clerk library for Next.js provides convenient helpers for authentication and session management using Clerk with Next.js.

### Resources

- [Documentation](https://clerk.com/docs)
- [Discord Community](https://clerk.com/discord)
- [Blog](https://clerk.com/blog)

### License

MIT License - see the [LICENSE](LICENSE) file for details.

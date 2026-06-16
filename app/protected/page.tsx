import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'

export default async function ProtectedPage() {
  // Use `auth()` to read the session on the server and protect this page.
  // Unlike the `<Show>` component, which only controls what renders, this is
  // the real access check: a signed-out user who navigates here is redirected.
  const { isAuthenticated, userId } = await auth()

  if (!isAuthenticated) {
    redirect('/')
  }

  return (
    <main className="grid min-h-screen place-items-center p-8">
      <p>
        Welcome! Your user ID is <code>{userId}</code>.
      </p>
    </main>
  )
}

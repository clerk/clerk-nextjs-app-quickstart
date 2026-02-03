import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'
import { NextRequest, NextResponse } from 'next/server'

const isProtectedRoute = createRouteMatcher(['/dashboard(.*)', '/forum(.*)'])

export default clerkMiddleware(async (auth, req: NextRequest) => {
  const { isAuthenticated, redirectToSignIn, sessionStatus } = await auth()

  // Send users with pending sessions to the /session-tasks page
  if (!isAuthenticated && sessionStatus === 'pending' && isProtectedRoute(req)) {
    // Add logic to handle pending users
    // This example redirects pending users to the /session-tasks page
    // so they can fulfill the session tasks
    const url = req.nextUrl.clone()
    url.pathname = '/session-tasks'
    return NextResponse.redirect(url)
  }

  // Send users who are not authenticated to the sign-in page
  if (!isAuthenticated && isProtectedRoute(req)) {
    return redirectToSignIn()
  }
})

import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isAdminRoute = createRouteMatcher(["/admin(.*)"]);

export default clerkMiddleware((auth, req) => {
  if (isAdminRoute(req) && auth().sessionClaims?.metadata.role !== "admin") {
    const url = new URL("/", req.url);
    return NextResponse.redirect(url);
  }
});

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};

// import { clerkMiddleware } from "@clerk/nextjs/server";

// // This Middleware does not protect any routes by default.
// // See https://clerk.com/docs/references/nextjs/clerk-middleware for more information about configuring your Middleware

// // const isPublicRoute = createRouteMatcher(["/sign-in(.*)", "/sign-up(.*)"]);

// export default clerkMiddleware((auth, req) => {
//   // if (!isPublicRoute(request)) {
//   //   auth().protect();
//   // }
//   (req: { nextUrl: { host: any } }) => ({
//     // Provide `domain` based on the request host
//     domain: req.nextUrl.host,
//   });
// });

// export const config = {
//   matcher: [
//     // Skip Next.js internals and all static files, unless found in search params
// "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
//     // Always run for API routes
//     "/(api|trpc)(.*)",
//   ],
// };

import { NextResponse } from "next/server";
import { currentUser, auth } from "@clerk/nextjs/server";

export async function GET() {
  // Get the userId from auth() -- if null, the user is not signed in
  const session = auth();

  console.log("session", session);

  if (!session.userId) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  // Get the Backend API User object when you need access to the user's information
  const user = await currentUser();

  // Perform your Route Handler's logic with the returned user object

  return NextResponse.json({ user, session }, { status: 200 });
}

// export async function GET() {
//   return Response.json({ message: "hi world" });
// }

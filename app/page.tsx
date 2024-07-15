import { auth } from "@clerk/nextjs/server";

export default function Home() {
  const { userId } = auth();
  console.log({ userId });
  return <div></div>;
}

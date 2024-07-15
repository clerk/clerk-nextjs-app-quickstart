"use client";

export default function Button({
  children,
  serverAction,
}: {
  children: any;
  serverAction: () => {};
}) {
  return <button onClick={() => serverAction()}>{children}</button>;
}

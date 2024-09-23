"use client";

import { notFound } from "next/navigation";
import { useEffect, useState } from "react";

export default function Home() {
  const [data, setData] = useState(null);

  useEffect(() => {
    async function fetchData() {
      const response = await fetch("/api/user");
      if (!response.ok) {
        notFound();
      }
      const result = await response.json();
      setData(result);
    }

    fetchData();
  }, []);

  if (!data) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <div>Home Page</div>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </>
  );
}

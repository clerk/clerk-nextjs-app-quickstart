'use client'

import { useOrganization } from '@clerk/nextjs'

export default function Page() {
  const { membership } = useOrganization()

  return <pre>{JSON.stringify(membership, null, 2)}</pre>
}

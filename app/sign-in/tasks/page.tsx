import { auth } from '@clerk/nextjs/server'

export default async function ManagePremiumContentPage() {
  const { has } = await auth()

  const hasPremiumAccessManage = has({ permission: 'invoices:create' })

  if (!hasPremiumAccessManage)
    return <h1>Only subscribers with the Premium Access Manage permission can access this content.</h1>

  return <h1>Our Exclusive Content</h1>
}

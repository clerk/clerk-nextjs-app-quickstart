'use client'

import { useState } from 'react'
import { useSignUp } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'

export default function Page() {
  const router = useRouter()
  // Use `useSignUp()` hook to access the `SignUp` object
  // `missing_requirements` and `missingFields` are only available on the `SignUp` object
  const { isLoaded, signUp, setActive } = useSignUp()
  const [formData, setFormData] = useState<Record<string, string>>({})

  if (!isLoaded) return <div>Loading…</div>
  if (!signUp.id) router.push('/sign-in')

  const status = signUp?.status
  const missingFields = signUp?.missingFields ?? []

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const res = await signUp?.update(formData)
      console.log(res)
      if (res?.status === 'complete') {
        await setActive({
          session: res.createdSessionId,
          navigate: async ({ session }) => {
            if (session?.currentTask) {
              // Check for tasks and navigate to custom UI to help users resolve them
              // See https://clerk.com/docs/guides/development/custom-flows/overview#session-tasks
              console.log(session?.currentTask)
              router.push('/sign-in/tasks')
              return
            }

            router.push('/')
          },
        })
      }
    } catch (err) {
      // See https://clerk.com/docs/guides/development/custom-flows/error-handling
      // for more info on error handling
      console.error(JSON.stringify(err, null, 2))
    }
  }

  if (status === 'missing_requirements') {
    // For simplicity, all missing fields in this example are text inputs.
    // In a real app, you might want to handle them differently:
    // - legal_accepted: checkbox
    // - username: text with validation
    // - phone_number: phone input, etc.
    return (
      <div>
        <h1>Continue sign-up</h1>
        <form onSubmit={handleSubmit}>
          {missingFields.map((field) => (
            <div key={field}>
              <label>
                {field}:
                <input
                  type="text"
                  value={formData[field] || ''}
                  onChange={(e) => handleChange(field, e.target.value)}
                />
              </label>
            </div>
          ))}
          <button type="submit">Submit</button>
          <div id="clerk-captcha" />
        </form>
      </div>
    )
  }

  // Handle other statuses if needed
  return (
    <>
      <div id="clerk-captcha" />
    </>
  )
}

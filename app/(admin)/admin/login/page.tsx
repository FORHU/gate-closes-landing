import { Suspense } from "react"
import { LoginForm } from "@/features/auth/components/LoginForm"

export const metadata = { title: "Admin login" }

export default function AdminLoginPage() {
  return (
    <div className="flex min-h-dvh items-center justify-center bg-muted/30 p-4">
      {/* LoginForm reads ?next=, which needs a Suspense boundary. */}
      <Suspense>
        <LoginForm />
      </Suspense>
    </div>
  )
}

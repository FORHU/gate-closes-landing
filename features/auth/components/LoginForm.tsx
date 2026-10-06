"use client"

import Image from "next/image"
import { useSearchParams } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Notice } from "@/shared/components/admin-ui"
import { LoginSchema, type LoginInput } from "../contracts/auth.contract"
import { useLogin } from "../hooks/useLogin"

/** Same account as the app; the role decides what the admin area shows. */
export function LoginForm() {
  const params = useSearchParams()
  const login = useLogin()
  const form = useForm<LoginInput>({
    resolver: zodResolver(LoginSchema),
    defaultValues: { email: "", password: "" },
  })

  // Only back to an admin page, never to an outside URL.
  const nextParam = params.get("next") ?? ""
  const next = nextParam.startsWith("/admin") ? nextParam : "/admin"

  function onSubmit(values: LoginInput) {
    login.mutate(values, { onSuccess: () => window.location.assign(next) })
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="w-full max-w-sm space-y-4 rounded-2xl border bg-background p-6 shadow-sm"
      >
        <div className="flex items-center gap-2.5">
          <Image src="/gate-closes-logo.svg" alt="" width={32} height={32} />
          <div>
            <h1 className="font-semibold">GateCloses Admin</h1>
            <p className="text-xs text-muted-foreground">Log in with your GateCloses account.</p>
          </div>
        </div>

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input type="email" autoComplete="email" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input type="password" autoComplete="current-password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {login.error && <Notice tone="error">{login.error.message}</Notice>}

        <Button type="submit" disabled={login.isPending} className="h-10 w-full">
          {login.isPending ? "Logging in…" : "Log in"}
        </Button>
      </form>
    </Form>
  )
}

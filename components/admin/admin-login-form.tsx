"use client"

import { useTransition } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"

import { login } from "@/app/fagc-admin-login/actions"
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
import { adminLoginSchema, type AdminLoginValues } from "@/lib/admin/login-schema"

const EASE = "ease-[cubic-bezier(0.32,0.72,0,1)]"

const labelClass = "text-[10px] font-medium tracking-[0.2em] text-white/45 uppercase"

const inputClass = `h-12 rounded-xl border-white/10 bg-white/[0.03] px-4 text-sm text-white placeholder:text-white/25 md:text-sm transition-[border-color,box-shadow,background-color] duration-500 ${EASE} hover:border-white/20 focus-visible:border-theme/60 focus-visible:bg-white/[0.05] focus-visible:ring-4 focus-visible:ring-theme/10`

function ArrowIcon() {
  return (
    <svg viewBox="0 0 16 16" fill="none" className="size-3.5" aria-hidden>
      <path d="M4.5 11.5l7-7M6 4.5h5.5V10" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function Spinner() {
  return (
    <svg viewBox="0 0 16 16" fill="none" className="size-3.5 animate-spin" aria-hidden>
      <circle cx="8" cy="8" r="6" stroke="currentColor" strokeOpacity="0.25" strokeWidth="1.25" />
      <path d="M14 8a6 6 0 0 0-6-6" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" />
    </svg>
  )
}

export function AdminLoginForm() {
  const [pending, startTransition] = useTransition()
  const form = useForm<AdminLoginValues>({
    resolver: zodResolver(adminLoginSchema),
    defaultValues: { email: "", password: "" },
  })

  function onSubmit(values: AdminLoginValues) {
    startTransition(async () => {
      // On success the action redirects to /admin and never returns.
      const result = await login(values)
      if (result?.error) form.setError("root", { message: result.error })
    })
  }

  const rootError = form.formState.errors.root?.message

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-6" noValidate>
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem className="gap-2.5">
              <FormLabel className={labelClass}>Email</FormLabel>
              <FormControl>
                <Input
                  type="email"
                  autoComplete="username"
                  placeholder="you@gatecloses.com"
                  className={inputClass}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem className="gap-2.5">
              <FormLabel className={labelClass}>Password</FormLabel>
              <FormControl>
                <Input
                  type="password"
                  autoComplete="current-password"
                  placeholder="••••••••"
                  className={inputClass}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {rootError && (
          <p
            role="alert"
            className="animate-rise rounded-full bg-destructive/10 px-4 py-2.5 text-xs text-red-300 ring-1 ring-destructive/30 motion-reduce:animate-none"
          >
            {rootError}
          </p>
        )}

        <Button
          type="submit"
          disabled={pending}
          className={`group mt-2 h-12 w-full justify-between rounded-full bg-theme pr-1.5 pl-6 text-sm font-semibold text-black transition-transform duration-500 ${EASE} hover:bg-theme active:scale-[0.98] disabled:opacity-80`}
        >
          {pending ? "Signing in" : "Sign in"}
          <span
            className={`flex size-9 items-center justify-center rounded-full bg-black text-theme transition-transform duration-500 ${EASE} group-hover:translate-x-0.5 group-hover:-translate-y-px group-hover:scale-105`}
          >
            {pending ? <Spinner /> : <ArrowIcon />}
          </span>
        </Button>
      </form>
    </Form>
  )
}

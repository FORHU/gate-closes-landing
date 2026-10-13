"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

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
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"
import { contactCopy } from "./contact-copy"

const contactFormSchema = z.object({
  name: z.string().min(2, "Enter your name."),
  email: z.string().email("Enter a valid email address."),
  message: z.string().min(10, "Tell us a bit more about what you need."),
})

type ContactFormValues = z.infer<typeof contactFormSchema>

// Taller, rounder fields than the shadcn defaults: 12px radius, 16px text so
// iOS doesn't zoom on focus.
const FIELD =
  "h-12 rounded-[12px] border-white/15 bg-white/[0.04] px-4 text-base text-white placeholder:text-white/35 focus-visible:border-theme focus-visible:ring-theme/25 md:text-base dark:bg-white/[0.04]"

function buildMailtoHref(values: ContactFormValues) {
  const subject = `Website inquiry from ${values.name}`
  const body = [
    `Name: ${values.name}`,
    `Email: ${values.email}`,
    "",
    values.message,
  ].join("\n")

  const params = new URLSearchParams({ subject, body })
  return `mailto:${contactCopy.recipientEmail}?${params.toString()}`
}

export function ContactForm() {
  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: { name: "", email: "", message: "" },
  })

  function onSubmit(values: ContactFormValues) {
    window.location.assign(buildMailtoHref(values))
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex h-full flex-col gap-5 px-7 py-10 sm:px-12 sm:py-14"
        noValidate
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm text-white/75">Name</FormLabel>
              <FormControl>
                <Input autoComplete="name" className={FIELD} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm text-white/75">Email</FormLabel>
              <FormControl>
                <Input type="email" autoComplete="email" placeholder="you@example.com" className={FIELD} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="message"
          render={({ field }) => (
            <FormItem className="flex-1">
              <FormLabel className="text-sm text-white/75">Message</FormLabel>
              <FormControl>
                <Textarea placeholder="How can we help?" className={cn(FIELD, "h-auto min-h-36 py-3")} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          type="submit"
          className="h-13 self-start rounded-full bg-theme px-8 text-[0.95rem] font-semibold text-[#11140a] hover:bg-theme/90 max-sm:w-full"
        >
          Send message
        </Button>
      </form>
    </Form>
  )
}

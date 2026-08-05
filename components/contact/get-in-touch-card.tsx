import { Card } from "@/components/ui/card"
import { ContactForm } from "./contact-form"
import { IntroPanel } from "./intro-panel"

export function GetInTouchCard() {
  return (
    <Card className="mx-auto max-w-5xl gap-0 overflow-hidden p-0 [--card-spacing:0px] md:grid md:grid-cols-[auto_1fr]">
      <IntroPanel />
      <ContactForm />
    </Card>
  )
}

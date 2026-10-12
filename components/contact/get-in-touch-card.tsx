import { ContactForm } from "./contact-form"
import { IntroPanel } from "./intro-panel"

export function GetInTouchCard() {
  return (
    <div className="mx-auto grid max-w-5xl overflow-hidden rounded-[28px] bg-night-raised ring-1 ring-white/[0.08] md:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)]">
      <IntroPanel />
      <ContactForm />
    </div>
  )
}

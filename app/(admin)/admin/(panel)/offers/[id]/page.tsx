import { OfferEditorScreen } from "@/app/(admin)/admin/_screens/offers-screens"

export const metadata = { title: "Edit offer" }

export default async function EditOfferPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  return <OfferEditorScreen id={id} />
}

import { PanelShell } from "@/app/(admin)/admin/_screens/panel-shell"

/** Every admin page except login. */
export default function AdminPanelLayout({ children }: { children: React.ReactNode }) {
  return <PanelShell>{children}</PanelShell>
}

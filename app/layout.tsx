import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Will Azure Bill Me?",
  description: "A quick checklist for Azure free-tier traps.",
  openGraph: { title: "Will Azure Bill Me?", description: "Tick what you use. See which Azure free-tier traps might cost you.", type: "website" },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}

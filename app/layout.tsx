import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Agent Card Builder",
  description: "Turn a rough AI agent idea into a practical Agent Card with workflow, tools, risks, and MVP steps."
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

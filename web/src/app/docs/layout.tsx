import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Docs | Lakon",
  description: "Learn how Lakon compresses prompts using LLM attention research.",
};

export default function DocsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

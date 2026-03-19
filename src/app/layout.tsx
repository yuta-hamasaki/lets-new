import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { AppShell } from "@/components/app/app-shell";
import { ClerkProvider } from "@clerk/nextjs";

export const metadata: Metadata = {
  title: "Campus Board",
  description: "大学認証ベースの学生掲示板・サークル・チャット",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja" className="h-full antialiased">
      <body className="min-h-full flex flex-col">
        <ClerkProvider>
          <AppShell>{children}</AppShell>
          <Toaster richColors />
        </ClerkProvider>
      </body>
    </html>
  );
}

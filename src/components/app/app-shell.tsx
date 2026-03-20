import Link from "next/link";

import { LinkButton } from "@/components/app/link-button";
import { AuthNav } from "@/components/app/auth-nav";

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-dvh flex flex-col bg-gradient-to-b from-white to-blue-50/40">
      <header className="sticky top-0 z-40 border-b bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-3 px-4 py-3 sm:px-6">
          <Link href="/" className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-xl bg-blue-600" aria-hidden />
            <div className="leading-tight">
              <div className="text-sm font-semibold tracking-tight">
               LETS
              </div>
              <div className="text-xs text-muted-foreground">
                大学生のための掲示板・サークル・チャットプラットフォーム
              </div>
            </div>
          </Link>
          <nav className="flex items-center gap-2">
            <LinkButton
              href="/boards"
              variant="ghost"
              className="hidden sm:inline-flex"
            >
              掲示板
            </LinkButton>
            <LinkButton
              href="/messages"
              variant="ghost"
              className="hidden sm:inline-flex"
            >
              メッセージ
            </LinkButton>
            <LinkButton
              href="/circles"
              variant="ghost"
              className="hidden sm:inline-flex"
            >
              サークル
            </LinkButton>
            <LinkButton
              href="/jobs"
              variant="ghost"
              className="hidden sm:inline-flex"
            >
              求人
            </LinkButton>
            <AuthNav />
          </nav>
        </div>
      </header>
      <main className="flex-1">
        <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6">
          {children}
        </div>
      </main>
      <footer className="border-t bg-white">
        <div className="mx-auto w-full max-w-6xl px-4 py-6 text-xs text-muted-foreground sm:px-6">
          © {new Date().getFullYear()} LETS
        </div>
      </footer>
    </div>
  );
}


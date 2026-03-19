"use client";

import { UserButton, useUser } from "@clerk/nextjs";

import { LinkButton } from "@/components/app/link-button";

export function AuthNav() {
  const { isLoaded, isSignedIn } = useUser();

  if (!isLoaded) return null;

  return (
    <div className="flex items-center gap-2">
      {!isSignedIn ? (
        <LinkButton href="/sign-in" className="bg-blue-600 hover:bg-blue-700">
          ログイン
        </LinkButton>
      ) : (
        <>
          <LinkButton
            href="/profile"
            variant="ghost"
            className="hidden sm:inline-flex"
          >
            プロフィール
          </LinkButton>
        <UserButton
          appearance={{
            elements: {
              userButtonAvatarBox: "h-8 w-8",
            },
          }}
        />
        </>
      )}
    </div>
  );
}


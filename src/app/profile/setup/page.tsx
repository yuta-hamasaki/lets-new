import { redirect } from "next/navigation";
import { currentUser } from "@clerk/nextjs/server";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ProfileForm } from "@/app/profile/setup/profile-form";
import { prisma } from "@/lib/prisma";

function getEmailDomain(email: string) {
  const at = email.lastIndexOf("@");
  if (at === -1) return "";
  return email.slice(at + 1).trim().toLowerCase();
}

export default async function ProfileSetupPage() {
  const user = await currentUser();
  if (!user) redirect("/sign-in");

  const email = user.emailAddresses?.[0]?.emailAddress ?? "";
  const domain = getEmailDomain(email);
  const meta = (user.unsafeMetadata ?? {}) as Record<string, unknown>;
  const expectedDomain =
    typeof meta.universityDomain === "string" ? meta.universityDomain : null;

  const ok = expectedDomain ? domain === expectedDomain.toLowerCase() : false;

  const existing = ok
    ? await prisma.profile.findUnique({
        where: { clerkUserId: user.id },
        select: {
          realName: true,
          studentId: true,
          grade: true,
          major: true,
          affiliation: true,
          title: true,
          bio: true,
          instagram: true,
          x: true,
          tiktok: true,
          website: true,
        },
      })
    : null;

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold tracking-tight">
        プロフィール作成
      </h1>
      <Card>
        <CardHeader>
          <CardTitle>大学メール認証チェック</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          <div>
            <div className="text-muted-foreground">ログインメール</div>
            <div className="font-medium">{email || "—"}</div>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant={ok ? "secondary" : "destructive"}>
              {ok ? "ドメインOK" : "ドメイン不一致"}
            </Badge>
            <div className="text-muted-foreground">
              {expectedDomain
                ? `必要: @${expectedDomain}`
                : "登録時メタデータが未設定です（サインアップからやり直してください）。"}
            </div>
          </div>
          {!ok ? (
            <div className="text-muted-foreground">
              まずは `/sign-up` から大学ドメインを選択して登録してください。
            </div>
          ) : (
            <div className="text-muted-foreground">
              この次に掲示板・サークル・メッセージ機能を有効化します。
            </div>
          )}
        </CardContent>
      </Card>

      <ProfileForm
        disabled={!ok}
        defaultValues={{
          realName: existing?.realName ?? "",
          studentId: existing?.studentId ?? "",
          grade: existing?.grade ?? "",
          major: existing?.major ?? "",
          affiliation: existing?.affiliation ?? "",
          title: existing?.title ?? "",
          bio: existing?.bio ?? "",
          instagram: existing?.instagram ?? "",
          x: existing?.x ?? "",
          tiktok: existing?.tiktok ?? "",
          website: existing?.website ?? "",
        }}
      />
    </div>
  );
}


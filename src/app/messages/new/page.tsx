import { redirect } from "next/navigation";
import { currentUser } from "@clerk/nextjs/server";

import { prisma } from "@/lib/prisma";
import { NewConversationForm } from "@/app/messages/new/new-conversation-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const dynamic = "force-dynamic";

export default async function NewMessagePage() {
  const user = await currentUser();
  if (!user) redirect("/sign-in");

  const me = await prisma.profile.findUnique({
    where: { clerkUserId: user.id },
    select: {
      id: true,
      universityId: true,
      university: { select: { name: true } },
    },
  });
  if (!me) redirect("/profile/setup");

  const candidates = await prisma.profile.findMany({
    where: { universityId: me.universityId, NOT: { id: me.id } },
    orderBy: { createdAt: "desc" },
    take: 200,
    select: { id: true, realName: true },
  });

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold tracking-tight">新規メッセージ</h1>
      <Card>
        <CardHeader>
          <CardTitle className="text-base">
            同じ大学のユーザーに送れます（{me.university.name}）
          </CardTitle>
        </CardHeader>
        <CardContent>
          <NewConversationForm candidates={candidates} />
        </CardContent>
      </Card>
    </div>
  );
}


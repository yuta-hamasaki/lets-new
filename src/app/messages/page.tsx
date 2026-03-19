import Link from "next/link";
import { redirect } from "next/navigation";
import { currentUser } from "@clerk/nextjs/server";

import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { LinkButton } from "@/components/app/link-button";

export const dynamic = "force-dynamic";

export default async function MessagesPage() {
  const user = await currentUser();
  if (!user) redirect("/sign-in");

  const me = await prisma.profile.findUnique({
    where: { clerkUserId: user.id },
    select: { id: true },
  });
  if (!me) redirect("/profile/setup");

  const conversations = await prisma.conversation.findMany({
    where: { participants: { some: { profileId: me.id } } },
    orderBy: { updatedAt: "desc" },
    take: 50,
    select: {
      id: true,
      type: true,
      title: true,
      updatedAt: true,
      participants: {
        select: { profile: { select: { id: true, realName: true, university: { select: { name: true } } } } },
      },
      messages: {
        orderBy: { createdAt: "desc" },
        take: 1,
        select: { body: true, createdAt: true },
      },
    },
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <h1 className="text-2xl font-semibold tracking-tight">メッセージ</h1>
        <LinkButton href="/messages/new" className="bg-blue-600 hover:bg-blue-700">
          新規
        </LinkButton>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {conversations.map((c) => {
          const others = c.participants
            .map((p) => p.profile)
            .filter((p) => p.id !== me.id);
          const title =
            c.type === "DIRECT"
              ? others[0]?.realName ?? "DM"
              : c.title ?? "グループ";
          const subtitle =
            c.type === "DIRECT"
              ? others[0]?.university.name ?? ""
              : `${c.participants.length}人`;

          const last = c.messages[0];
          return (
            <Card key={c.id} className="hover:bg-blue-50/30 transition-colors">
              <CardHeader className="space-y-1">
                <CardTitle className="text-base flex items-center justify-between gap-2">
                  <span className="truncate">{title}</span>
                  <Badge variant="outline">{c.type}</Badge>
                </CardTitle>
                <div className="text-xs text-muted-foreground">
                  {subtitle} ・ {c.updatedAt.toLocaleString("ja-JP")}
                </div>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="text-sm text-muted-foreground line-clamp-2">
                  {last?.body || "まだメッセージがありません。"}
                </div>
                <Link
                  href={`/messages/${c.id}`}
                  className="text-sm text-blue-700 hover:underline"
                >
                  開く
                </Link>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}


import { redirect } from "next/navigation";
import { currentUser } from "@clerk/nextjs/server";

import { prisma } from "@/lib/prisma";
import { MessageComposer } from "@/app/messages/[conversationId]/message-composer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export const dynamic = "force-dynamic";

export default async function ConversationPage({
  params,
}: {
  params: Promise<{ conversationId: string }>;
}) {
  const { conversationId } = await params;
  const user = await currentUser();
  if (!user) redirect("/sign-in");

  const me = await prisma.profile.findUnique({
    where: { clerkUserId: user.id },
    select: { id: true },
  });
  if (!me) redirect("/profile/setup");

  const conv = await prisma.conversation.findUnique({
    where: { id: conversationId },
    select: {
      id: true,
      type: true,
      title: true,
      participants: {
        select: {
          profile: { select: { id: true, realName: true, university: { select: { name: true } } } },
        },
      },
      messages: {
        orderBy: { createdAt: "asc" },
        take: 200,
        select: {
          id: true,
          body: true,
          mediaUrl: true,
          createdAt: true,
          sender: { select: { id: true, realName: true, university: { select: { name: true } } } },
        },
      },
    },
  });
  if (!conv) redirect("/messages");

  const isParticipant = conv.participants.some((p) => p.profile.id === me.id);
  if (!isParticipant) redirect("/messages");

  const others = conv.participants.map((p) => p.profile).filter((p) => p.id !== me.id);
  const title =
    conv.type === "DIRECT" ? others[0]?.realName ?? "DM" : conv.title ?? "グループ";

  return (
    <div className="space-y-4">
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
        <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
          <Badge variant="outline">{conv.type}</Badge>
          <span>
            {conv.participants.length}人：
            {conv.participants.map((p) => p.profile.realName).join("、")}
          </span>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">メッセージ</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="max-h-[55vh] space-y-2 overflow-auto rounded-lg border bg-white p-3">
            {conv.messages.length === 0 ? (
              <div className="text-sm text-muted-foreground">まだメッセージがありません。</div>
            ) : (
              conv.messages.map((m) => (
                <div
                  key={m.id}
                  className={
                    m.sender.id === me.id
                      ? "rounded-lg bg-blue-50/70 p-2"
                      : "rounded-lg bg-muted/30 p-2"
                  }
                >
                  <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                    <Badge variant="secondary" className="bg-blue-50 text-blue-700">
                      {m.sender.university.name}
                    </Badge>
                    <span>{m.sender.realName}</span>
                    <span>・</span>
                    <span>{m.createdAt.toLocaleString("ja-JP")}</span>
                  </div>
                  <div className="mt-1 whitespace-pre-wrap text-sm leading-6">
                    {m.body}
                  </div>
                  {m.mediaUrl ? (
                    <div className="mt-2 text-xs text-blue-700">添付: {m.mediaUrl}</div>
                  ) : null}
                </div>
              ))
            )}
          </div>

          <MessageComposer conversationId={conv.id} />
        </CardContent>
      </Card>
    </div>
  );
}


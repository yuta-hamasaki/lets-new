import { redirect } from "next/navigation";
import { currentUser } from "@clerk/nextjs/server";

import { prisma } from "@/lib/prisma";
import { CircleChat } from "@/app/circles/[circleId]/realtime-chat";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { JoinCircleButton } from "@/app/circles/[circleId]/join-circle-button";

export const dynamic = "force-dynamic";

export default async function CirclePage({
  params,
}: {
  params: Promise<{ circleId: string }>;
}) {
  const { circleId } = await params;
  const user = await currentUser();
  if (!user) redirect("/sign-in");

  const profile = await prisma.profile.findUnique({
    where: { clerkUserId: user.id },
    select: { id: true },
  });
  if (!profile) redirect("/profile/setup");

  const circle = await prisma.circle.findUnique({
    where: { id: circleId },
    select: {
      id: true,
      name: true,
      description: true,
      university: { select: { name: true } },
      members: { select: { profileId: true } },
      messages: {
        orderBy: { createdAt: "asc" },
        take: 100,
        select: {
          id: true,
          body: true,
          mediaUrl: true,
          createdAt: true,
          sender: { select: { realName: true, university: { select: { name: true } } } },
        },
      },
    },
  });
  if (!circle) redirect("/circles");

  const isMember = circle.members.some((m) => m.profileId === profile.id);

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold tracking-tight">{circle.name}</h1>
          <div className="text-sm text-muted-foreground">
            {circle.university ? (
              <Badge variant="secondary" className="bg-blue-50 text-blue-700">
                {circle.university.name}
              </Badge>
            ) : null}{" "}
            {circle.description || ""}
          </div>
        </div>
        {!isMember ? (
          <JoinCircleButton circleId={circle.id} />
        ) : (
          <Badge variant="secondary" className="bg-blue-50 text-blue-700">
            参加中
          </Badge>
        )}
      </div>

      {!isMember ? (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">このサークルに参加するとチャットできます</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            上の「参加する」から参加してください。
          </CardContent>
        </Card>
      ) : (
        <CircleChat circleId={circle.id} initialMessages={circle.messages as any} />
      )}
    </div>
  );
}


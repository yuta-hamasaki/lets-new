import Link from "next/link";
import { redirect } from "next/navigation";
import { currentUser } from "@clerk/nextjs/server";

import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CreateCircleDialog } from "@/app/circles/_components/create-circle-dialog";

export default function CirclesPage() {
  return <CirclesPageInner />;
}

async function CirclesPageInner() {
  const user = await currentUser();
  if (!user) redirect("/sign-in");

  const profile = await prisma.profile.findUnique({
    where: { clerkUserId: user.id },
    select: { universityId: true, university: { select: { name: true } } },
  });
  if (!profile) redirect("/profile/setup");

  const circles = await prisma.circle.findMany({
    where: { isPublic: true, universityId: profile.universityId },
    orderBy: { createdAt: "desc" },
    take: 50,
    select: {
      id: true,
      name: true,
      description: true,
      createdAt: true,
      members: { select: { id: true } },
    },
  });

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold tracking-tight">サークル</h1>
          <div className="text-sm text-muted-foreground">
            <Badge variant="secondary" className="bg-blue-50 text-blue-700">
              {profile.university.name}
            </Badge>{" "}
            の公開サークル
          </div>
        </div>
        <CreateCircleDialog />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {circles.map((c) => (
          <Card key={c.id} className="hover:bg-blue-50/30 transition-colors">
            <CardHeader className="space-y-1">
              <CardTitle className="text-base">{c.name}</CardTitle>
              <div className="text-xs text-muted-foreground">
                メンバー {c.members.length} ・ {c.createdAt.toLocaleDateString("ja-JP")}
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="text-sm text-muted-foreground line-clamp-3">
                {c.description || "—"}
              </div>
              <Link
                href={`/circles/${c.id}`}
                className="text-sm text-blue-700 hover:underline"
              >
                開く
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}


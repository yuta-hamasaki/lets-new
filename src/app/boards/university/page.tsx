import { redirect } from "next/navigation";
import { currentUser } from "@clerk/nextjs/server";

import { prisma } from "@/lib/prisma";
import { PostComposer } from "@/app/boards/_components/post-composer";
import { PostCard } from "@/components/boards/post-card";

export const dynamic = "force-dynamic";

export default async function UniversityBoardPage() {
  const user = await currentUser();
  if (!user) redirect("/sign-in");

  const profile = await prisma.profile.findUnique({
    where: { clerkUserId: user.id },
    select: { universityId: true, university: { select: { name: true } } },
  });
  if (!profile) redirect("/profile/setup");

  const posts = await prisma.boardPost.findMany({
    where: { scope: "UNIVERSITY", universityId: profile.universityId },
    orderBy: { createdAt: "desc" },
    take: 30,
    select: {
      id: true,
      content: true,
      createdAt: true,
      category: true,
      scope: true,
      author: {
        select: {
          realName: true,
          university: { select: { name: true } },
        },
      },
    },
  });

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold tracking-tight">
        大学別掲示板（{profile.university.name}）
      </h1>
      <PostComposer scope="UNIVERSITY" />
      <div className="space-y-3">
        {posts.map((p) => (
          <PostCard key={p.id} post={p as any} href={`/boards/posts/${p.id}`} />
        ))}
      </div>
    </div>
  );
}


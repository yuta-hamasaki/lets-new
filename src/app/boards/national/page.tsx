import { prisma } from "@/lib/prisma";
import { PostComposer } from "@/app/boards/_components/post-composer";
import { PostCard } from "@/components/boards/post-card";

export const dynamic = "force-dynamic";

export default async function NationalBoardPage() {
  const posts = await prisma.boardPost.findMany({
    where: { scope: "NATIONAL" },
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
      <h1 className="text-2xl font-semibold tracking-tight">全国掲示板</h1>
      <PostComposer scope="NATIONAL" />
      <div className="space-y-3">
        {posts.map((p) => (
          <PostCard key={p.id} post={p as any} href={`/boards/posts/${p.id}`} />
        ))}
      </div>
    </div>
  );
}


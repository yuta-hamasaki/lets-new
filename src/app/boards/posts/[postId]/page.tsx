import { redirect } from "next/navigation";
import { currentUser } from "@clerk/nextjs/server";

import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ReplyComposer } from "@/app/boards/posts/[postId]/reply-composer";

export const dynamic = "force-dynamic";

export default async function PostDetailPage({
  params,
}: {
  params: Promise<{ postId: string }>;
}) {
  const { postId } = await params;
  const user = await currentUser();
  if (!user) redirect("/sign-in");

  const post = await prisma.boardPost.findUnique({
    where: { id: postId },
    select: {
      id: true,
      content: true,
      createdAt: true,
      category: true,
      scope: true,
      author: { select: { realName: true, university: { select: { name: true } } } },
      replies: {
        orderBy: { createdAt: "asc" },
        select: {
          id: true,
          content: true,
          createdAt: true,
          author: { select: { realName: true, university: { select: { name: true } } } },
        },
      },
    },
  });

  if (!post) redirect("/boards");

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold tracking-tight">投稿</h1>

      <Card>
        <CardHeader className="space-y-2">
          <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
            <Badge variant="secondary" className="bg-blue-50 text-blue-700">
              {post.author.university.name}
            </Badge>
            <span>{post.author.realName}</span>
            <span>・</span>
            <span>{post.createdAt.toLocaleString("ja-JP")}</span>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline">{post.scope}</Badge>
            <Badge variant="outline">{post.category}</Badge>
          </div>
          <CardTitle className="text-base leading-7">{post.content}</CardTitle>
        </CardHeader>
        <CardContent />
      </Card>

      <ReplyComposer postId={post.id} />

      <div className="space-y-3">
        {post.replies.map((r) => (
          <Card key={r.id}>
            <CardHeader className="space-y-2">
              <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                <Badge variant="secondary" className="bg-blue-50 text-blue-700">
                  {r.author.university.name}
                </Badge>
                <span>{r.author.realName}</span>
                <span>・</span>
                <span>{r.createdAt.toLocaleString("ja-JP")}</span>
              </div>
              <div className="text-sm leading-6">{r.content}</div>
            </CardHeader>
          </Card>
        ))}
      </div>
    </div>
  );
}


import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export function PostCard({
  post,
  href,
}: {
  post: {
    id: string;
    content: string;
    createdAt: Date;
    category: string;
    scope: string;
    author: { realName: string; university: { name: string } };
  };
  href: string;
}) {
  return (
    <Card className="hover:bg-blue-50/30 transition-colors">
      <CardHeader className="flex-row items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
            <Badge variant="secondary" className="bg-blue-50 text-blue-700">
              {post.author.university.name}
            </Badge>
            <span>{post.author.realName}</span>
            <span>・</span>
            <span>{post.createdAt.toLocaleString("ja-JP")}</span>
          </div>
        </div>
        <div className="flex items-center gap-2 text-xs">
          <Badge variant="outline">{post.scope}</Badge>
          <Badge variant="outline">{post.category}</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-2">
        <Link href={href} className="block text-sm leading-6">
          {post.content}
        </Link>
      </CardContent>
    </Card>
  );
}


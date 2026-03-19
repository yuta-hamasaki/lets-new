import Link from "next/link";

import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { LinkButton } from "@/components/app/link-button";

export const dynamic = "force-dynamic";

export default async function JobsPage() {
  const jobs = await prisma.jobPost.findMany({
    orderBy: { createdAt: "desc" },
    take: 50,
    select: {
      id: true,
      company: true,
      title: true,
      location: true,
      createdAt: true,
      url: true,
    },
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <h1 className="text-2xl font-semibold tracking-tight">企業インターン・求人</h1>
        <LinkButton href="/jobs/new" className="bg-blue-600 hover:bg-blue-700">
          掲載する
        </LinkButton>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {jobs.map((j) => (
          <Card key={j.id} className="hover:bg-blue-50/30 transition-colors">
            <CardHeader className="space-y-1">
              <CardTitle className="text-base">{j.title}</CardTitle>
              <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                <Badge variant="secondary" className="bg-blue-50 text-blue-700">
                  {j.company}
                </Badge>
                {j.location ? <span>{j.location}</span> : null}
                <span>・</span>
                <span>{j.createdAt.toLocaleDateString("ja-JP")}</span>
              </div>
            </CardHeader>
            <CardContent className="space-y-2">
              <Link href={`/jobs/${j.id}`} className="text-sm text-blue-700 hover:underline">
                詳細を見る
              </Link>
              {j.url ? (
                <Link href={j.url} target="_blank" className="block text-xs text-muted-foreground hover:underline">
                  公式URL
                </Link>
              ) : null}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}


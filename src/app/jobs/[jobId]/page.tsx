import Link from "next/link";
import { redirect } from "next/navigation";

import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

export const dynamic = "force-dynamic";

export default async function JobDetailPage({
  params,
}: {
  params: Promise<{ jobId: string }>;
}) {
  const { jobId } = await params;
  const job = await prisma.jobPost.findUnique({
    where: { id: jobId },
    select: {
      id: true,
      company: true,
      title: true,
      description: true,
      url: true,
      location: true,
      createdAt: true,
    },
  });
  if (!job) redirect("/jobs");

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold tracking-tight">求人詳細</h1>
      <Card>
        <CardHeader className="space-y-2">
          <CardTitle className="text-base">{job.title}</CardTitle>
          <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
            <Badge variant="secondary" className="bg-blue-50 text-blue-700">
              {job.company}
            </Badge>
            {job.location ? <span>{job.location}</span> : null}
            <span>・</span>
            <span>{job.createdAt.toLocaleDateString("ja-JP")}</span>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="whitespace-pre-wrap text-sm leading-6">
            {job.description}
          </div>
          <Separator />
          {job.url ? (
            <Link href={job.url} target="_blank" className="text-sm text-blue-700 hover:underline">
              公式URLを開く
            </Link>
          ) : (
            <div className="text-sm text-muted-foreground">URLは未設定です。</div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}


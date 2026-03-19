import Link from "next/link";
import { Instagram, Link as LinkIcon, Twitter } from "lucide-react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { LinkButton } from "@/components/app/link-button";

export function ProfileCard({
  profile,
}: {
  profile: {
    realName: string;
    grade: string | null;
    major: string | null;
    affiliation: string | null;
    title: string | null;
    bio: string | null;
    instagram: string | null;
    x: string | null;
    tiktok: string | null;
    website: string | null;
    university: { name: string; slug: string };
  };
}) {
  const initials = profile.realName
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((s) => s[0]?.toUpperCase())
    .join("");

  return (
    <Card className="overflow-hidden">
      <div className="h-2 bg-blue-600" aria-hidden />
      <CardHeader className="gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <Avatar className="h-12 w-12">
            <AvatarFallback className="bg-blue-50 text-blue-700">
              {initials || "U"}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0">
            <div className="truncate text-lg font-semibold tracking-tight">
              {profile.realName}
            </div>
            <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
              <Badge variant="secondary" className="bg-blue-50 text-blue-700">
                {profile.university.name}
              </Badge>
              {profile.grade ? <span>{profile.grade}</span> : null}
              {profile.major ? <span>・{profile.major}</span> : null}
            </div>
          </div>
        </div>

        <LinkButton href="/profile/setup" variant="outline">
          編集
        </LinkButton>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="grid gap-2 text-sm sm:grid-cols-2">
          <div>
            <div className="text-xs text-muted-foreground">所属</div>
            <div className="font-medium">{profile.affiliation || "—"}</div>
          </div>
          <div>
            <div className="text-xs text-muted-foreground">肩書き</div>
            <div className="font-medium">{profile.title || "—"}</div>
          </div>
        </div>

        {profile.bio ? (
          <div className="rounded-lg bg-blue-50/60 p-3 text-sm text-foreground">
            {profile.bio}
          </div>
        ) : null}

        <Separator />

        <div className="flex flex-wrap gap-2">
          {profile.instagram ? (
            <Link
              href={profile.instagram}
              target="_blank"
              className="inline-flex items-center gap-1 rounded-full border bg-white px-3 py-1 text-xs hover:bg-blue-50"
            >
              <Instagram className="h-3.5 w-3.5" />
              Instagram
            </Link>
          ) : null}
          {profile.x ? (
            <Link
              href={profile.x}
              target="_blank"
              className="inline-flex items-center gap-1 rounded-full border bg-white px-3 py-1 text-xs hover:bg-blue-50"
            >
              <Twitter className="h-3.5 w-3.5" />
              X
            </Link>
          ) : null}
          {profile.tiktok ? (
            <Link
              href={profile.tiktok}
              target="_blank"
              className="inline-flex items-center gap-1 rounded-full border bg-white px-3 py-1 text-xs hover:bg-blue-50"
            >
              <LinkIcon className="h-3.5 w-3.5" />
              TikTok
            </Link>
          ) : null}
          {profile.website ? (
            <Link
              href={profile.website}
              target="_blank"
              className="inline-flex items-center gap-1 rounded-full border bg-white px-3 py-1 text-xs hover:bg-blue-50"
            >
              <LinkIcon className="h-3.5 w-3.5" />
              Web
            </Link>
          ) : null}
        </div>
      </CardContent>
    </Card>
  );
}


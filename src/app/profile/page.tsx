import { redirect } from "next/navigation";
import { currentUser } from "@clerk/nextjs/server";

import { prisma } from "@/lib/prisma";
import { ProfileCard } from "@/components/profile/profile-card";

export default async function ProfilePage() {
  const user = await currentUser();
  if (!user) redirect("/sign-in");

  const profile = await prisma.profile.findUnique({
    where: { clerkUserId: user.id },
    select: {
      realName: true,
      grade: true,
      major: true,
      affiliation: true,
      title: true,
      bio: true,
      instagram: true,
      x: true,
      tiktok: true,
      website: true,
      university: { select: { name: true, slug: true } },
    },
  });
  if (!profile) redirect("/profile/setup");

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold tracking-tight">プロフィール</h1>
      <ProfileCard profile={profile} />
    </div>
  );
}


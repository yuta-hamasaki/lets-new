"use server";

import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

import { prisma } from "@/lib/prisma";

export async function upsertProfile(input: {
  realName: string;
  studentId?: string;
  grade?: string;
  major?: string;
  affiliation?: string;
  title?: string;
  bio?: string;
  instagram?: string;
  x?: string;
  tiktok?: string;
  website?: string;
}) {
  const user = await currentUser();
  if (!user) redirect("/sign-in");

  const meta = (user.unsafeMetadata ?? {}) as Record<string, unknown>;
  const universitySlug =
    typeof meta.universitySlug === "string" ? meta.universitySlug : null;
  if (!universitySlug) {
    throw new Error("universitySlug is missing on user.unsafeMetadata");
  }

  const university = await prisma.university.findUnique({
    where: { slug: universitySlug },
  });
  if (!university) {
    throw new Error(
      `University not found for slug=${universitySlug}. Run db:seed.`
    );
  }

  const realName = input.realName.trim();
  if (!realName) throw new Error("realName is required");

  await prisma.profile.upsert({
    where: { clerkUserId: user.id },
    update: {
      realName,
      studentId: input.studentId?.trim() || null,
      grade: input.grade?.trim() || null,
      major: input.major?.trim() || null,
      affiliation: input.affiliation?.trim() || null,
      title: input.title?.trim() || null,
      bio: input.bio?.trim() || null,
      instagram: input.instagram?.trim() || null,
      x: input.x?.trim() || null,
      tiktok: input.tiktok?.trim() || null,
      website: input.website?.trim() || null,
      universityId: university.id,
    },
    create: {
      clerkUserId: user.id,
      universityId: university.id,
      realName,
      studentId: input.studentId?.trim() || null,
      grade: input.grade?.trim() || null,
      major: input.major?.trim() || null,
      affiliation: input.affiliation?.trim() || null,
      title: input.title?.trim() || null,
      bio: input.bio?.trim() || null,
      instagram: input.instagram?.trim() || null,
      x: input.x?.trim() || null,
      tiktok: input.tiktok?.trim() || null,
      website: input.website?.trim() || null,
    },
  });

  redirect("/profile");
}


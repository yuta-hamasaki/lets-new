"use server";

import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

import { prisma } from "@/lib/prisma";

function toCategory(value: string) {
  const allowed = [
    "CONSULT",
    "RECRUIT",
    "QUESTION",
    "TWEET",
    "ANNOUNCEMENT",
  ] as const;
  if ((allowed as readonly string[]).includes(value)) return value as any;
  return "QUESTION" as any;
}

function toScope(value: string) {
  const allowed = ["UNIVERSITY", "NATIONAL"] as const;
  if ((allowed as readonly string[]).includes(value)) return value as any;
  return "UNIVERSITY" as any;
}

export async function createPost(input: {
  content: string;
  scope: "UNIVERSITY" | "NATIONAL";
  category: string;
}) {
  const user = await currentUser();
  if (!user) redirect("/sign-in");

  const profile = await prisma.profile.findUnique({
    where: { clerkUserId: user.id },
    select: { id: true, universityId: true },
  });
  if (!profile) redirect("/profile/setup");

  const content = input.content.trim();
  if (!content) throw new Error("content is required");

  const scope = toScope(input.scope);
  const category = toCategory(input.category);
  const universityId = scope === "UNIVERSITY" ? profile.universityId : null;

  await prisma.boardPost.create({
    data: {
      content,
      scope,
      category,
      universityId,
      authorProfileId: profile.id,
    },
  });
}

export async function createReply(input: { postId: string; content: string }) {
  const user = await currentUser();
  if (!user) redirect("/sign-in");

  const profile = await prisma.profile.findUnique({
    where: { clerkUserId: user.id },
    select: { id: true },
  });
  if (!profile) redirect("/profile/setup");

  const content = input.content.trim();
  if (!content) throw new Error("content is required");

  await prisma.boardReply.create({
    data: {
      postId: input.postId,
      content,
      authorProfileId: profile.id,
    },
  });
}


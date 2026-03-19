"use server";

import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

import { prisma } from "@/lib/prisma";

async function requireProfile() {
  const user = await currentUser();
  if (!user) redirect("/sign-in");
  const profile = await prisma.profile.findUnique({
    where: { clerkUserId: user.id },
    select: { id: true, universityId: true },
  });
  if (!profile) redirect("/profile/setup");
  return profile;
}

export async function createCircle(input: {
  name: string;
  description?: string;
  isPublic?: boolean;
}) {
  const profile = await requireProfile();
  const name = input.name.trim();
  if (!name) throw new Error("name is required");

  const circle = await prisma.circle.create({
    data: {
      name,
      description: input.description?.trim() || null,
      isPublic: input.isPublic ?? true,
      universityId: profile.universityId,
      members: {
        create: {
          profileId: profile.id,
          role: "ADMIN",
        },
      },
    },
    select: { id: true },
  });

  return circle.id;
}

export async function joinCircle(circleId: string) {
  const profile = await requireProfile();
  await prisma.circleMember.upsert({
    where: { circleId_profileId: { circleId, profileId: profile.id } },
    update: {},
    create: { circleId, profileId: profile.id, role: "MEMBER" },
  });
}

export async function sendCircleMessage(input: {
  circleId: string;
  body: string;
  mediaUrl?: string;
}) {
  const profile = await requireProfile();
  const body = input.body.trim();
  if (!body && !input.mediaUrl) throw new Error("body or mediaUrl is required");

  const member = await prisma.circleMember.findUnique({
    where: { circleId_profileId: { circleId: input.circleId, profileId: profile.id } },
    select: { id: true },
  });
  if (!member) throw new Error("not a member");

  await prisma.circleMessage.create({
    data: {
      circleId: input.circleId,
      body,
      mediaUrl: input.mediaUrl?.trim() || null,
      senderProfileId: profile.id,
    },
  });
}


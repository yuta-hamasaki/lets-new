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

export async function createConversation(input: {
  type: "DIRECT" | "GROUP";
  title?: string;
  participantProfileIds: string[];
}) {
  const me = await requireProfile();
  const participantIds = Array.from(
    new Set([me.id, ...input.participantProfileIds.filter(Boolean)])
  );
  if (input.type === "DIRECT" && participantIds.length !== 2) {
    throw new Error("DIRECT must have exactly 2 participants");
  }
  if (input.type === "GROUP" && participantIds.length < 2) {
    throw new Error("GROUP must have 2+ participants");
  }

  const conv = await prisma.conversation.create({
    data: {
      type: input.type,
      title: input.type === "GROUP" ? (input.title?.trim() || "グループ") : null,
      participants: {
        create: participantIds.map((profileId) => ({ profileId })),
      },
    },
    select: { id: true },
  });

  return conv.id;
}

export async function sendMessage(input: {
  conversationId: string;
  body: string;
  mediaUrl?: string;
}) {
  const me = await requireProfile();
  const body = input.body.trim();
  if (!body && !input.mediaUrl) throw new Error("body or mediaUrl is required");

  const isParticipant = await prisma.conversationParticipant.findUnique({
    where: {
      conversationId_profileId: {
        conversationId: input.conversationId,
        profileId: me.id,
      },
    },
    select: { id: true },
  });
  if (!isParticipant) throw new Error("not a participant");

  await prisma.message.create({
    data: {
      conversationId: input.conversationId,
      body,
      mediaUrl: input.mediaUrl?.trim() || null,
      senderProfileId: me.id,
    },
  });
}


"use server";

import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

import { prisma } from "@/lib/prisma";

async function requireSignedIn() {
  const user = await currentUser();
  if (!user) redirect("/sign-in");
  return user;
}

export async function createJob(input: {
  company: string;
  title: string;
  description: string;
  url?: string;
  location?: string;
}) {
  await requireSignedIn();

  const company = input.company.trim();
  const title = input.title.trim();
  const description = input.description.trim();
  if (!company || !title || !description) throw new Error("missing fields");

  const job = await prisma.jobPost.create({
    data: {
      company,
      title,
      description,
      url: input.url?.trim() || null,
      location: input.location?.trim() || null,
    },
    select: { id: true },
  });
  return job.id;
}


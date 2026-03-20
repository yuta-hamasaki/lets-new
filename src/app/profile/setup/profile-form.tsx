"use client";

import { useState } from "react";
import { toast } from "sonner";

import { upsertProfile } from "./actions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { LoadingSpinner } from "@/components/app/loading-spinner";

export function ProfileForm({
  defaultValues,
  disabled,
}: {
  defaultValues?: Partial<{
    realName: string;
    studentId: string;
    grade: string;
    major: string;
    affiliation: string;
    title: string;
    bio: string;
    instagram: string;
    x: string;
    tiktok: string;
    website: string;
  }>;
  disabled?: boolean;
}) {
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    realName: defaultValues?.realName ?? "",
    studentId: defaultValues?.studentId ?? "",
    grade: defaultValues?.grade ?? "",
    major: defaultValues?.major ?? "",
    affiliation: defaultValues?.affiliation ?? "",
    title: defaultValues?.title ?? "",
    bio: defaultValues?.bio ?? "",
    instagram: defaultValues?.instagram ?? "",
    x: defaultValues?.x ?? "",
    tiktok: defaultValues?.tiktok ?? "",
    website: defaultValues?.website ?? "",
  });

  async function onSubmit() {
    if (!form.realName.trim()) {
      toast.error("氏名（実名）を入力してください。");
      return;
    }
    setSubmitting(true);
    try {
      await upsertProfile(form);
    } catch (e: unknown) {
  const message = e instanceof Error ? e.message : String(e);

  if (message.includes("NEXT_REDIRECT")) {
    return;
  }

  console.error(e);
  toast.error("保存に失敗しました。DB設定を確認してください。");
  setSubmitting(false);
}
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>プロフィール</CardTitle>
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="realName">氏名（実名）*</Label>
            <Input
              id="realName"
              value={form.realName}
              onChange={(e) => setForm((p) => ({ ...p, realName: e.target.value }))}
              disabled={disabled || submitting}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="studentId">学籍</Label>
            <Input
              id="studentId"
              value={form.studentId}
              onChange={(e) => setForm((p) => ({ ...p, studentId: e.target.value }))}
              disabled={disabled || submitting}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="grade">学年</Label>
            <Input
              id="grade"
              value={form.grade}
              onChange={(e) => setForm((p) => ({ ...p, grade: e.target.value }))}
              disabled={disabled || submitting}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="major">専攻</Label>
            <Input
              id="major"
              value={form.major}
              onChange={(e) => setForm((p) => ({ ...p, major: e.target.value }))}
              disabled={disabled || submitting}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="affiliation">所属</Label>
            <Input
              id="affiliation"
              value={form.affiliation}
              onChange={(e) =>
                setForm((p) => ({ ...p, affiliation: e.target.value }))
              }
              disabled={disabled || submitting}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="title">肩書き</Label>
            <Input
              id="title"
              value={form.title}
              onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
              disabled={disabled || submitting}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="bio">ひとこと</Label>
          <Textarea
            id="bio"
            value={form.bio}
            onChange={(e) => setForm((p) => ({ ...p, bio: e.target.value }))}
            disabled={disabled || submitting}
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="instagram">Instagram</Label>
            <Input
              id="instagram"
              placeholder="https://instagram.com/..."
              value={form.instagram}
              onChange={(e) =>
                setForm((p) => ({ ...p, instagram: e.target.value }))
              }
              disabled={disabled || submitting}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="x">X</Label>
            <Input
              id="x"
              placeholder="https://x.com/..."
              value={form.x}
              onChange={(e) => setForm((p) => ({ ...p, x: e.target.value }))}
              disabled={disabled || submitting}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="tiktok">TikTok</Label>
            <Input
              id="tiktok"
              placeholder="https://tiktok.com/@..."
              value={form.tiktok}
              onChange={(e) =>
                setForm((p) => ({ ...p, tiktok: e.target.value }))
              }
              disabled={disabled || submitting}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="website">Web</Label>
            <Input
              id="website"
              placeholder="https://..."
              value={form.website}
              onChange={(e) =>
                setForm((p) => ({ ...p, website: e.target.value }))
              }
              disabled={disabled || submitting}
            />
          </div>
        </div>

        <div className="flex items-center justify-between gap-3">
          <div className="text-xs text-muted-foreground">
            {submitting ? <LoadingSpinner label="保存中…" /> : null}
          </div>
          <Button
            onClick={onSubmit}
            disabled={disabled || submitting}
            className="bg-blue-600 hover:bg-blue-700"
          >
            保存
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}


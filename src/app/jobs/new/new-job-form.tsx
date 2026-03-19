"use client";

import { useState } from "react";
import { toast } from "sonner";

import { createJob } from "@/app/jobs/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { LoadingSpinner } from "@/components/app/loading-spinner";

export function NewJobForm() {
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    company: "",
    title: "",
    description: "",
    url: "",
    location: "",
  });

  async function onSubmit() {
    if (!form.company.trim() || !form.title.trim() || !form.description.trim()) {
      toast.error("会社名・タイトル・説明は必須です。");
      return;
    }
    setSubmitting(true);
    try {
      const id = await createJob(form);
      toast.success("掲載しました。");
      window.location.href = `/jobs/${id}`;
    } catch (e: unknown) {
      console.error(e);
      toast.error("掲載に失敗しました。ログインしているか確認してください。");
      setSubmitting(false);
    }
  }

  return (
    <div className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="company">会社名*</Label>
          <Input
            id="company"
            value={form.company}
            onChange={(e) => setForm((p) => ({ ...p, company: e.target.value }))}
            disabled={submitting}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="title">タイトル*</Label>
          <Input
            id="title"
            value={form.title}
            onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
            disabled={submitting}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="location">勤務地</Label>
          <Input
            id="location"
            value={form.location}
            onChange={(e) => setForm((p) => ({ ...p, location: e.target.value }))}
            disabled={submitting}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="url">URL</Label>
          <Input
            id="url"
            value={form.url}
            onChange={(e) => setForm((p) => ({ ...p, url: e.target.value }))}
            disabled={submitting}
            placeholder="https://..."
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">説明*</Label>
        <Textarea
          id="description"
          value={form.description}
          onChange={(e) =>
            setForm((p) => ({ ...p, description: e.target.value }))
          }
          disabled={submitting}
        />
      </div>

      <div className="flex items-center justify-between gap-3">
        {submitting ? <LoadingSpinner label="掲載中…" /> : <div />}
        <Button
          onClick={onSubmit}
          disabled={submitting}
          className="bg-blue-600 hover:bg-blue-700"
        >
          掲載
        </Button>
      </div>
    </div>
  );
}


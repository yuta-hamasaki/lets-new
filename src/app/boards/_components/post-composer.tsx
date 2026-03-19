"use client";

import { useState } from "react";
import { toast } from "sonner";

import { createPost } from "@/app/boards/actions";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { LoadingSpinner } from "@/components/app/loading-spinner";

const CATEGORIES = [
  { value: "CONSULT", label: "相談" },
  { value: "RECRUIT", label: "募集" },
  { value: "QUESTION", label: "質問" },
  { value: "TWEET", label: "つぶやき" },
  { value: "ANNOUNCEMENT", label: "告知" },
];

export function PostComposer({
  scope,
}: {
  scope: "UNIVERSITY" | "NATIONAL";
}) {
  const [content, setContent] = useState("");
  const [category, setCategory] = useState<string>("QUESTION");
  const [submitting, setSubmitting] = useState(false);

  async function onSubmit() {
    if (!content.trim()) {
      toast.error("内容を入力してください。");
      return;
    }
    setSubmitting(true);
    try {
      await createPost({ content, scope, category });
      setContent("");
      toast.success("投稿しました。");
      // RSC再取得のためにフルリロード（簡易MVP）。後でrouter.refreshに最適化。
      window.location.reload();
    } catch (e: unknown) {
      console.error(e);
      toast.error("投稿に失敗しました。");
      setSubmitting(false);
    }
  }

  return (
    <div className="rounded-xl border bg-white p-4 space-y-3">
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="space-y-2">
          <Label>カテゴリ</Label>
          <Select value={category} onValueChange={(v) => setCategory(v ?? "QUESTION")}>
            <SelectTrigger>
              <SelectValue placeholder="カテゴリ" />
            </SelectTrigger>
            <SelectContent>
              {CATEGORIES.map((c) => (
                <SelectItem key={c.value} value={c.value}>
                  {c.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-end justify-end">
          {submitting ? <LoadingSpinner label="投稿中…" /> : null}
        </div>
      </div>

      <Textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="相談・募集・質問・つぶやき・告知など。健全な交流を心がけましょう。"
        disabled={submitting}
      />
      <div className="flex justify-end">
        <Button
          onClick={onSubmit}
          disabled={submitting}
          className="bg-blue-600 hover:bg-blue-700"
        >
          投稿
        </Button>
      </div>
    </div>
  );
}


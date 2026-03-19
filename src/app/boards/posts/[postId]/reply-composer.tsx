"use client";

import { useState } from "react";
import { toast } from "sonner";

import { createReply } from "@/app/boards/actions";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { LoadingSpinner } from "@/components/app/loading-spinner";

export function ReplyComposer({ postId }: { postId: string }) {
  const [content, setContent] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function onSubmit() {
    if (!content.trim()) {
      toast.error("返信内容を入力してください。");
      return;
    }
    setSubmitting(true);
    try {
      await createReply({ postId, content });
      setContent("");
      toast.success("返信しました。");
      window.location.reload();
    } catch (e: unknown) {
      console.error(e);
      toast.error("返信に失敗しました。");
      setSubmitting(false);
    }
  }

  return (
    <div className="rounded-xl border bg-white p-4 space-y-3">
      <div className="flex items-center justify-between gap-3">
        <div className="text-sm font-medium">リプライ</div>
        {submitting ? <LoadingSpinner label="送信中…" /> : null}
      </div>
      <Textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="返信を書く"
        disabled={submitting}
      />
      <div className="flex justify-end">
        <Button
          onClick={onSubmit}
          disabled={submitting}
          className="bg-blue-600 hover:bg-blue-700"
        >
          返信
        </Button>
      </div>
    </div>
  );
}


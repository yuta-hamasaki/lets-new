"use client";

import { useState } from "react";
import { toast } from "sonner";

import { sendMessage } from "@/app/messages/actions";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { LoadingSpinner } from "@/components/app/loading-spinner";

export function MessageComposer({ conversationId }: { conversationId: string }) {
  const [body, setBody] = useState("");
  const [sending, setSending] = useState(false);

  async function onSend() {
    if (!body.trim()) {
      toast.error("メッセージを入力してください。");
      return;
    }
    setSending(true);
    try {
      await sendMessage({ conversationId, body });
      setBody("");
      window.location.reload();
    } catch (e: unknown) {
      console.error(e);
      toast.error("送信に失敗しました。");
      setSending(false);
    }
  }

  return (
    <div className="rounded-xl border bg-white p-4 space-y-3">
      <div className="flex items-center justify-between gap-3">
        <div className="text-sm font-medium">送信</div>
        {sending ? <LoadingSpinner label="送信中…" /> : null}
      </div>
      <Textarea
        value={body}
        onChange={(e) => setBody(e.target.value)}
        placeholder="メッセージを書く"
        disabled={sending}
      />
      <div className="flex justify-end">
        <Button onClick={onSend} disabled={sending} className="bg-blue-600 hover:bg-blue-700">
          送信
        </Button>
      </div>
    </div>
  );
}


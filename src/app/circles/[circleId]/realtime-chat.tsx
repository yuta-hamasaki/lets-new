"use client";

import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

import { sendCircleMessage } from "@/app/circles/actions";
import { getSupabaseBrowser } from "@/lib/supabase-browser";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { LoadingSpinner } from "@/components/app/loading-spinner";

type CircleMessageVM = {
  id: string;
  body: string;
  mediaUrl: string | null;
  createdAt: string | Date;
  sender: { realName: string; university: { name: string } };
};

export function CircleChat({
  circleId,
  initialMessages,
}: {
  circleId: string;
  initialMessages: CircleMessageVM[];
}) {
  const [messages, setMessages] = useState<CircleMessageVM[]>(initialMessages);
  const [body, setBody] = useState("");
  const [sending, setSending] = useState(false);

  const supabase = useMemo(() => getSupabaseBrowser(), []);

  useEffect(() => {
    if (!supabase) return;
    const channel = supabase
      .channel(`circle:${circleId}`)
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "CircleMessage", filter: `circleId=eq.${circleId}` },
        () => {
          // 簡易: 新規メッセージが来たらリロード（RLS/Select構成を崩さず安全に動く）
          window.location.reload();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [circleId, supabase]);

  async function onSend() {
    if (!body.trim()) {
      toast.error("メッセージを入力してください。");
      return;
    }
    setSending(true);
    try {
      await sendCircleMessage({ circleId, body });
      setBody("");
      toast.success("送信しました。");
      window.location.reload();
    } catch (e: unknown) {
      console.error(e);
      toast.error("送信に失敗しました。");
      setSending(false);
    }
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="flex-row items-center justify-between">
          <CardTitle className="text-base">チャット</CardTitle>
          <Badge variant="secondary" className="bg-blue-50 text-blue-700">
            {supabase ? "Realtime: ON" : "Realtime: OFF"}
          </Badge>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="max-h-[55vh] space-y-2 overflow-auto rounded-lg border bg-white p-3">
            {messages.length === 0 ? (
              <div className="text-sm text-muted-foreground">まだメッセージがありません。</div>
            ) : (
              messages.map((m) => (
                <div key={m.id} className="rounded-lg bg-blue-50/40 p-2">
                  <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                    <Badge variant="secondary" className="bg-blue-50 text-blue-700">
                      {m.sender.university.name}
                    </Badge>
                    <span>{m.sender.realName}</span>
                    <span>・</span>
                    <span>
                      {new Date(m.createdAt).toLocaleString("ja-JP")}
                    </span>
                  </div>
                  <div className="mt-1 whitespace-pre-wrap text-sm leading-6">{m.body}</div>
                  {m.mediaUrl ? (
                    <div className="mt-2 text-xs text-blue-700">
                      添付: {m.mediaUrl}
                    </div>
                  ) : null}
                </div>
              ))
            )}
          </div>

          <div className="space-y-2">
            <Textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder="メッセージを書く"
              disabled={sending}
            />
            <div className="flex items-center justify-between gap-3">
              {sending ? <LoadingSpinner label="送信中…" /> : <div />}
              <Button
                onClick={onSend}
                disabled={sending}
                className="bg-blue-600 hover:bg-blue-700"
              >
                送信
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}


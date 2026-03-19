"use client";

import { useMemo, useState } from "react";
import { toast } from "sonner";

import { createConversation } from "@/app/messages/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LoadingSpinner } from "@/components/app/loading-spinner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type Candidate = { id: string; realName: string };

export function NewConversationForm({ candidates }: { candidates: Candidate[] }) {
  const [type, setType] = useState<"DIRECT" | "GROUP">("DIRECT");
  const [title, setTitle] = useState("");
  const [picked, setPicked] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);

  const remaining = useMemo(
    () => candidates.filter((c) => !picked.includes(c.id)),
    [candidates, picked]
  );

  async function onCreate() {
    const participantProfileIds = picked;
    if (type === "DIRECT" && participantProfileIds.length !== 1) {
      toast.error("DMは相手を1人選んでください。");
      return;
    }
    if (type === "GROUP" && participantProfileIds.length < 1) {
      toast.error("グループは相手を1人以上選んでください。");
      return;
    }
    setSubmitting(true);
    try {
      const id = await createConversation({
        type,
        title: type === "GROUP" ? title : undefined,
        participantProfileIds,
      });
      window.location.href = `/messages/${id}`;
    } catch (e: unknown) {
      console.error(e);
      toast.error("作成に失敗しました。");
      setSubmitting(false);
    }
  }

  return (
    <div className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label>種別</Label>
          <Select value={type} onValueChange={(v) => setType((v ?? "DIRECT") as any)}>
            <SelectTrigger>
              <SelectValue placeholder="種別" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="DIRECT">個人（DM）</SelectItem>
              <SelectItem value="GROUP">グループ</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>グループ名（任意）</Label>
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            disabled={type !== "GROUP" || submitting}
            placeholder="例: ゼミ相談"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label>相手（追加）</Label>
        <Select
          value={""}
          onValueChange={(v) => {
            const id = v ?? "";
            if (!id) return;
            setPicked((p) => (p.includes(id) ? p : [...p, id]));
          }}
        >
          <SelectTrigger>
            <SelectValue placeholder="ユーザーを選択" />
          </SelectTrigger>
          <SelectContent>
            {remaining.map((c) => (
              <SelectItem key={c.id} value={c.id}>
                {c.realName}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {picked.length ? (
        <div className="flex flex-wrap gap-2">
          {picked.map((id) => {
            const c = candidates.find((x) => x.id === id);
            return (
              <button
                key={id}
                type="button"
                onClick={() => setPicked((p) => p.filter((x) => x !== id))}
                className="rounded-full border bg-white px-3 py-1 text-xs hover:bg-blue-50"
                disabled={submitting}
              >
                {c?.realName ?? id}（外す）
              </button>
            );
          })}
        </div>
      ) : null}

      <div className="flex items-center justify-between">
        {submitting ? <LoadingSpinner label="作成中…" /> : <div />}
        <Button onClick={onCreate} disabled={submitting} className="bg-blue-600 hover:bg-blue-700">
          作成
        </Button>
      </div>
    </div>
  );
}


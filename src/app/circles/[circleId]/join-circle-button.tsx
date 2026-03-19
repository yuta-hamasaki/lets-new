"use client";

import { useState } from "react";
import { toast } from "sonner";

import { joinCircle } from "@/app/circles/actions";
import { Button } from "@/components/ui/button";
import { LoadingSpinner } from "@/components/app/loading-spinner";

export function JoinCircleButton({ circleId }: { circleId: string }) {
  const [joining, setJoining] = useState(false);

  async function onJoin() {
    setJoining(true);
    try {
      await joinCircle(circleId);
      toast.success("参加しました。");
      window.location.reload();
    } catch (e: unknown) {
      console.error(e);
      toast.error("参加に失敗しました。");
      setJoining(false);
    }
  }

  return (
    <div className="flex items-center gap-2">
      {joining ? <LoadingSpinner label="参加中…" /> : null}
      <Button
        onClick={onJoin}
        disabled={joining}
        className="bg-blue-600 hover:bg-blue-700"
      >
        参加する
      </Button>
    </div>
  );
}


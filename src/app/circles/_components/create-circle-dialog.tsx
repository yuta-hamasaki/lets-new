"use client";

import { useState } from "react";
import { toast } from "sonner";

import { createCircle } from "@/app/circles/actions";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { LoadingSpinner } from "@/components/app/loading-spinner";

export function CreateCircleDialog() {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function onCreate() {
    if (!name.trim()) {
      toast.error("サークル名を入力してください。");
      return;
    }
    setSubmitting(true);
    try {
      const id = await createCircle({ name, description, isPublic: true });
      toast.success("作成しました。");
      setOpen(false);
      window.location.href = `/circles/${id}`;
    } catch (e: unknown) {
      console.error(e);
      toast.error("作成に失敗しました。");
      setSubmitting(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <Button className="bg-blue-600 hover:bg-blue-700">サークル作成</Button>
        }
      />
      <DialogContent>
        <DialogHeader>
          <DialogTitle>サークル作成（公開）</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="circleName">サークル名</Label>
            <Input
              id="circleName"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={submitting}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="circleDesc">説明</Label>
            <Textarea
              id="circleDesc"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              disabled={submitting}
            />
          </div>
          <div className="flex items-center justify-between">
            {submitting ? <LoadingSpinner label="作成中…" /> : <div />}
            <Button onClick={onCreate} disabled={submitting} className="bg-blue-600 hover:bg-blue-700">
              作成
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}


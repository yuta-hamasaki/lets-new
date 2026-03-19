"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useSignUp } from "@clerk/nextjs/legacy";
import { toast } from "sonner";

import { UNIVERSITIES, findUniversityBySlug } from "@/lib/universities";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type Step = "form" | "verify";

function getEmailDomain(email: string) {
  const at = email.lastIndexOf("@");
  if (at === -1) return "";
  return email.slice(at + 1).trim().toLowerCase();
}

export function SignUpFlow() {
  const router = useRouter();
  const { isLoaded, signUp, setActive } = useSignUp();

  const [step, setStep] = useState<Step>("form");
  const [universitySlug, setUniversitySlug] = useState<string>("");
  const university = useMemo(
    () => findUniversityBySlug(universitySlug),
    [universitySlug]
  );

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function startSignUp() {
    if (!isLoaded) return;
    if (!university) {
      toast.error("大学ドメインを選択してください。");
      return;
    }
    const domain = getEmailDomain(email);
    if (!domain || domain !== university.emailDomain.toLowerCase()) {
      toast.error(
        `メールアドレスのドメインが一致しません（必要: @${university.emailDomain}）。`
      );
      return;
    }
    if (password.length < 8) {
      toast.error("パスワードは8文字以上にしてください。");
      return;
    }

    setSubmitting(true);
    try {
      await signUp.create({
        emailAddress: email,
        password,
        unsafeMetadata: {
          universitySlug: university.slug,
          universityDomain: university.emailDomain,
        },
      });
      await signUp.prepareEmailAddressVerification({ strategy: "email_code" });
      setStep("verify");
      toast.message("確認コードをメールに送信しました。");
    } catch (e: unknown) {
      console.error(e);
      toast.error("登録を開始できませんでした。入力内容をご確認ください。");
    } finally {
      setSubmitting(false);
    }
  }

  async function verifyCode() {
    if (!isLoaded) return;
    if (!code.trim()) {
      toast.error("確認コードを入力してください。");
      return;
    }

    setSubmitting(true);
    try {
      const result = await signUp.attemptEmailAddressVerification({
        code: code.trim(),
      });
      if (result.status !== "complete") {
        toast.error("確認が完了しませんでした。コードをご確認ください。");
        return;
      }
      await setActive({ session: result.createdSessionId });
      router.replace("/profile/setup");
    } catch (e: unknown) {
      console.error(e);
      toast.error("確認コードが正しくありません。");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="mx-auto w-full max-w-md">
      <Card>
        <CardHeader>
          <CardTitle>学生登録（大学メール認証）</CardTitle>
        </CardHeader>
        <CardContent className="space-y-5">
          {step === "form" ? (
            <>
              <div className="space-y-2">
                <Label>大学ドメイン</Label>
                <Select
                  value={universitySlug}
                  onValueChange={(v) => setUniversitySlug(v ?? "")}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="大学を選択" />
                  </SelectTrigger>
                  <SelectContent>
                    {UNIVERSITIES.map((u) => (
                      <SelectItem key={u.slug} value={u.slug}>
                        {u.name}（@{u.emailDomain}）
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">大学メールアドレス</Label>
                <Input
                  id="email"
                  type="email"
                  inputMode="email"
                  placeholder={
                    university ? `you@${university.emailDomain}` : "you@univ.ac.jp"
                  }
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">パスワード</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="new-password"
                />
              </div>

              <Button
                className="w-full bg-blue-600 hover:bg-blue-700"
                onClick={startSignUp}
                disabled={submitting || !isLoaded}
              >
                確認コードを送信
              </Button>
            </>
          ) : (
            <>
              <div className="space-y-1">
                <div className="text-sm font-medium">確認コード</div>
                <div className="text-sm text-muted-foreground">
                  {email} に送信したコードを入力してください。
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="code">コード</Label>
                <Input
                  id="code"
                  inputMode="numeric"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  autoComplete="one-time-code"
                />
              </div>
              <Button
                className="w-full bg-blue-600 hover:bg-blue-700"
                onClick={verifyCode}
                disabled={submitting || !isLoaded}
              >
                認証して続行
              </Button>
              <Button
                className="w-full"
                variant="outline"
                onClick={() => setStep("form")}
                disabled={submitting}
              >
                戻る
              </Button>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}


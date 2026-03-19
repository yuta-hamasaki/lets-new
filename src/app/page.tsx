import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LinkButton } from "@/components/app/link-button";

export default function Home() {
  return (
    <div className="space-y-8">
      <section className="space-y-3">
        <Badge variant="secondary" className="bg-blue-50 text-blue-700">
          実名・大学認証ユーザーのみ投稿可
        </Badge>
        <h1 className="text-balance text-3xl font-semibold tracking-tight sm:text-4xl">
          大学別・全国別の掲示板と、サークルの安全な交流
        </h1>
        <p className="max-w-2xl text-pretty text-muted-foreground">
          大学メール認証＋プロフィール登録で、相談・募集・質問・つぶやきを健全に。
          掲示板・サークル・チャット・求人をひとつのアプリで。
        </p>
        <div className="flex flex-col gap-2 sm:flex-row">
          <LinkButton
            href="/sign-up"
            className="bg-blue-600 hover:bg-blue-700"
          >
            学生として始める
          </LinkButton>
          <LinkButton href="/boards" variant="outline">
            掲示板を見る
          </LinkButton>
        </div>
      </section>

      <Tabs defaultValue="boards" className="w-full">
        <TabsList className="grid w-full grid-cols-3 bg-white">
          <TabsTrigger value="boards">掲示板</TabsTrigger>
          <TabsTrigger value="circles">サークル</TabsTrigger>
          <TabsTrigger value="jobs">求人</TabsTrigger>
        </TabsList>
        <TabsContent value="boards" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>掲示板</CardTitle>
              <CardDescription>
                大学別・全国別・カテゴリ別。投稿にリプライできます。
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-2 sm:flex-row">
              <LinkButton href="/boards/university" variant="outline">
                大学別
              </LinkButton>
              <LinkButton href="/boards/national" variant="outline">
                全国
              </LinkButton>
              <LinkButton href="/boards/categories" variant="outline">
                カテゴリ
              </LinkButton>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="circles" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>サークル</CardTitle>
              <CardDescription>
                公開サークルは誰でも参加可能。リアルタイムチャット対応。
              </CardDescription>
            </CardHeader>
            <CardContent>
              <LinkButton href="/circles" variant="outline">
                サークル一覧
              </LinkButton>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="jobs" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>企業インターン・求人</CardTitle>
              <CardDescription>
                学生掲示板とは別タブで安全に情報収集。
              </CardDescription>
            </CardHeader>
            <CardContent>
              <LinkButton href="/jobs" variant="outline">
                求人を見る
              </LinkButton>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

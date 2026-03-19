import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LinkButton } from "@/components/app/link-button";

export default function BoardsPage() {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold tracking-tight">掲示板</h1>
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>大学別</CardTitle>
          </CardHeader>
          <CardContent>
            <LinkButton href="/boards/university" variant="outline" className="w-full">
              開く
            </LinkButton>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>全国</CardTitle>
          </CardHeader>
          <CardContent>
            <LinkButton href="/boards/national" variant="outline" className="w-full">
              開く
            </LinkButton>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>カテゴリ</CardTitle>
          </CardHeader>
          <CardContent>
            <LinkButton href="/boards/categories" variant="outline" className="w-full">
              開く
            </LinkButton>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}


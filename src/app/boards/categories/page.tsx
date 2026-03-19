import Link from "next/link";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const CATEGORIES = [
  { key: "CONSULT", label: "相談" },
  { key: "RECRUIT", label: "募集" },
  { key: "QUESTION", label: "質問" },
  { key: "TWEET", label: "つぶやき" },
  { key: "ANNOUNCEMENT", label: "告知" },
];

export default function CategoriesPage() {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold tracking-tight">カテゴリ別</h1>
      <div className="grid gap-4 md:grid-cols-2">
        {CATEGORIES.map((c) => (
          <Card key={c.key} className="hover:bg-blue-50/30 transition-colors">
            <CardHeader className="flex-row items-center justify-between">
              <CardTitle className="text-base">{c.label}</CardTitle>
              <Badge variant="outline">{c.key}</Badge>
            </CardHeader>
            <CardContent>
              <Link
                href={`/boards/categories/${c.key}`}
                className="text-sm text-blue-700 hover:underline"
              >
                このカテゴリを見る
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}


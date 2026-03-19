import { Loader2 } from "lucide-react";

import { cn } from "@/lib/utils";

export function LoadingSpinner({
  className,
  label = "読み込み中…",
}: {
  className?: string;
  label?: string;
}) {
  return (
    <div className={cn("flex items-center justify-center gap-2", className)}>
      <Loader2 className="h-4 w-4 animate-spin text-blue-600" />
      <span className="text-sm text-muted-foreground">{label}</span>
    </div>
  );
}


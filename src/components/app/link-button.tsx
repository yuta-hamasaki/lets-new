"use client";

import Link from "next/link";
import type { ComponentProps } from "react";
import type { VariantProps } from "class-variance-authority";

import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function LinkButton({
  className,
  variant,
  size,
  ...props
}: ComponentProps<typeof Link> & {
  variant?: VariantProps<typeof buttonVariants>["variant"];
  size?: VariantProps<typeof buttonVariants>["size"];
}) {
  return (
    <Link
      {...props}
      className={cn(buttonVariants({ variant, size }), className)}
    />
  );
}


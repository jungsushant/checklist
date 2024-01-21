"use-client";

import Link from "next/link";
import { Button } from "../ui/button";

interface BackButtonProps {
  href: string;
  label: string;
}
export const BackButton = ({ href, label }: BackButtonProps) => {
  return (
    <Button size="lg" variant="link" className="w-full" asChild>
      <Link href={href}>{label}</Link>
    </Button>
  );
};

"use client";

import { Logo } from "./logo";
import { Button } from "./ui/button";
import { BookOpenIcon } from "lucide-react";
import { useVideoProjectStore } from "@/data/store";

export default function Header() {
  const openPromptNotebook = useVideoProjectStore((s) => s.openPromptNotebook);

  return (
    <header className="px-4 py-2 flex justify-between items-center border-b border-border">
      <h1 className="text-lg font-medium">
        <Logo />
      </h1>
      <Button
        variant="ghost"
        size="sm"
        onClick={openPromptNotebook}
        className="flex items-center gap-2"
      >
        <BookOpenIcon className="w-4 h-4" />
        Prompt Notebook
      </Button>
    </header>
  );
}

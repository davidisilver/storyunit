"use client";

import { Button } from "./ui/button";
import { BookOpenIcon } from "lucide-react";
import { useVideoProjectStore } from "@/data/store";

export function PromptNotebookButton() {
  const openPromptNotebook = useVideoProjectStore((s) => s.openPromptNotebook);

  return (
    <Button
      variant="secondary"
      size="icon"
      onClick={openPromptNotebook}
      className="fixed bottom-4 left-4 w-12 h-12 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 z-40"
    >
      <BookOpenIcon className="w-5 h-5" />
    </Button>
  );
} 
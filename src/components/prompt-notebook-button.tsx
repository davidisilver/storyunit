"use client";

import { Button } from "./ui/button";
import { BookOpenIcon } from "lucide-react";
import { useVideoProjectStore } from "@/data/store";

export function PromptNotebookButton() {
  const promptNotebookOpen = useVideoProjectStore((s) => s.promptNotebookOpen);
  const openPromptNotebook = useVideoProjectStore((s) => s.openPromptNotebook);
  const closePromptNotebook = useVideoProjectStore((s) => s.closePromptNotebook);

  const handleClick = () => {
    if (promptNotebookOpen) {
      closePromptNotebook();
    } else {
      openPromptNotebook();
    }
  };

  return (
    <Button
      variant="secondary"
      size="icon"
      onClick={handleClick}
      className="fixed bottom-4 right-4 w-12 h-12 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 z-40"
    >
      <BookOpenIcon className="w-5 h-5" />
    </Button>
  );
}

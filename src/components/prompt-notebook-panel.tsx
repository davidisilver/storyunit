"use client";

import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Label } from "./ui/label";
import {
  BookOpenIcon,
  PlusIcon,
  TrashIcon,
  PencilIcon,
  CheckIcon,
  XIcon,
  ChevronUpIcon,
} from "lucide-react";
import { useProjectSavedPrompts } from "@/data/queries";
import {
  useSavedPromptCreator,
  useSavedPromptUpdater,
  useSavedPromptDeleter,
} from "@/data/mutations";
import { useProjectId } from "@/data/store";
import { type SavedPrompt } from "@/data/schema";
import { toast } from "@/hooks/use-toast";
import { formatDistanceToNow } from "date-fns";
import { cn } from "@/lib/utils";

interface PromptNotebookPanelProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  currentPrompt: string;
  mediaType: string;
  onPromptSelect: (prompt: string) => void;
}

export function PromptNotebookPanel({
  isOpen,
  onOpenChange,
  currentPrompt,
  mediaType,
  onPromptSelect,
}: PromptNotebookPanelProps) {
  const projectId = useProjectId();
  const { data: savedPrompts = [] } = useProjectSavedPrompts(projectId);
  const createPrompt = useSavedPromptCreator(projectId);
  const updatePrompt = useSavedPromptUpdater(projectId);
  const deletePrompt = useSavedPromptDeleter(projectId);

  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newPrompt, setNewPrompt] = useState("");
  const [newTitle, setNewTitle] = useState("");
  const [newDescription, setNewDescription] = useState("");

  const handleSavePrompt = async () => {
    if (!newPrompt.trim()) {
      toast({
        title: "Prompt required",
        description: "Please enter a prompt to save.",
      });
      return;
    }

    try {
      await createPrompt.mutateAsync({
        prompt: newPrompt,
        mediaType: mediaType as any,
      });

      setNewPrompt("");
      setNewTitle("");
      setNewDescription("");
      setIsAdding(false);

      toast({
        title: "Prompt saved",
        description: "Your prompt has been saved to the notebook.",
      });
    } catch (error) {
      toast({
        title: "Failed to save prompt",
        description: "Please try again.",
      });
    }
  };

  const handleUpdatePrompt = async (id: string, updates: Partial<SavedPrompt>) => {
    try {
      await updatePrompt.mutateAsync({ id, prompt: updates });
      setEditingId(null);
      toast({
        title: "Prompt updated",
        description: "Your prompt has been updated.",
      });
    } catch (error) {
      toast({
        title: "Failed to update prompt",
        description: "Please try again.",
      });
    }
  };

  const handleDeletePrompt = async (id: string) => {
    try {
      await deletePrompt.mutateAsync(id);
      toast({
        title: "Prompt deleted",
        description: "Your prompt has been removed from the notebook.",
      });
    } catch (error) {
      toast({
        title: "Failed to delete prompt",
        description: "Please try again.",
      });
    }
  };

  const filteredPrompts = savedPrompts.filter(
    (prompt) => prompt.mediaType === mediaType
  );

  return (
    <div
      className={cn(
        "fixed bottom-0 right-0 w-[450px] h-[600px] bg-background border-l border-t border-border z-50 transition-transform duration-300 ease-in-out",
        isOpen ? "translate-y-0" : "translate-y-full"
      )}
    >
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          <div className="flex items-center gap-2">
            <BookOpenIcon className="w-5 h-5" />
            <h2 className="text-lg font-semibold">Prompt Notebook</h2>
            {filteredPrompts.length > 0 && (
              <span className="text-xs bg-muted px-2 py-1 rounded-full">
                {filteredPrompts.length}
              </span>
            )}
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onOpenChange(false)}
          >
            <XIcon className="w-5 h-5" />
          </Button>
        </div>

        {/* Content */}
        <div className="flex-1 p-4 overflow-y-auto space-y-4">
          {/* Save Current Prompt Section */}
          <div className="space-y-3">
            {!isAdding && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsAdding(true)}
                className="w-full"
              >
                <PlusIcon className="w-4 h-4 mr-2" />
                Save Current Prompt
              </Button>
            )}

            {isAdding && (
              <div className="space-y-3 p-3 border rounded-lg">
                <div className="space-y-2">
                  <Label htmlFor="new-prompt">Prompt</Label>
                  <Textarea
                    id="new-prompt"
                    placeholder="Enter your prompt..."
                    value={newPrompt}
                    onChange={(e) => setNewPrompt(e.target.value)}
                    rows={3}
                  />
                </div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    onClick={handleSavePrompt}
                    disabled={createPrompt.isPending}
                  >
                    <CheckIcon className="w-4 h-4 mr-2" />
                    Save
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setIsAdding(false);
                      setNewPrompt("");
                      setNewTitle("");
                      setNewDescription("");
                    }}
                  >
                    <XIcon className="w-4 h-4 mr-2" />
                    Cancel
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* Saved Prompts */}
          <div className="space-y-3">
            <h3 className="text-sm font-medium text-muted-foreground">
              Saved Prompts ({filteredPrompts.length})
            </h3>

            {filteredPrompts.length === 0 && !isAdding && (
              <p className="text-sm text-muted-foreground text-center py-8">
                No saved prompts yet. Save your first prompt to get started!
              </p>
            )}

            {filteredPrompts.map((prompt) => (
              <div
                key={prompt.id}
                className="p-3 border rounded-lg space-y-2 hover:bg-muted/50 transition-colors"
              >
                {editingId === prompt.id ? (
                  <div className="space-y-2">
                    <Textarea
                      placeholder="Prompt..."
                      value={prompt.prompt}
                      onChange={(e) =>
                        handleUpdatePrompt(prompt.id, { prompt: e.target.value })
                      }
                      rows={3}
                    />
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        onClick={() => setEditingId(null)}
                      >
                        <CheckIcon className="w-4 h-4 mr-2" />
                        Done
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setEditingId(null)}
                      >
                        <XIcon className="w-4 h-4 mr-2" />
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm line-clamp-3">
                          {prompt.prompt}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {formatDistanceToNow(prompt.createdAt, {
                            addSuffix: true,
                          })}
                        </p>
                      </div>
                      <div className="flex gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onPromptSelect(prompt.prompt)}
                          className="h-8 w-8 p-0"
                        >
                          <BookOpenIcon className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setEditingId(prompt.id)}
                          className="h-8 w-8 p-0"
                        >
                          <PencilIcon className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeletePrompt(prompt.id)}
                          className="h-8 w-8 p-0 text-destructive"
                        >
                          <TrashIcon className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
} 
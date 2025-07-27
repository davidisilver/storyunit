"use client";

import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Label } from "./ui/label";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "./ui/collapsible";
import {
  BookOpenIcon,
  PlusIcon,
  TrashIcon,
  PencilIcon,
  CheckIcon,
  XIcon,
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

interface PromptNotebookProps {
  currentPrompt: string;
  mediaType: string;
  onPromptSelect: (prompt: string) => void;
}

export function PromptNotebook({
  currentPrompt,
  mediaType,
  onPromptSelect,
}: PromptNotebookProps) {
  const projectId = useProjectId();
  const { data: savedPrompts = [] } = useProjectSavedPrompts(projectId);
  const createPrompt = useSavedPromptCreator(projectId);
  const updatePrompt = useSavedPromptUpdater(projectId);
  const deletePrompt = useSavedPromptDeleter(projectId);

  const [isOpen, setIsOpen] = useState(false);
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
        title: newTitle.trim() || undefined,
        description: newDescription.trim() || undefined,
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

  const handleUpdatePrompt = async (
    id: string,
    updates: Partial<SavedPrompt>,
  ) => {
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
    (prompt) => prompt.mediaType === mediaType,
  );

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <CollapsibleTrigger asChild>
        <Button
          variant="ghost"
          className="w-full justify-between text-sm font-medium"
        >
          <div className="flex items-center gap-2">
            <BookOpenIcon className="w-4 h-4" />
            Prompt Notebook
            {filteredPrompts.length > 0 && (
              <span className="text-xs bg-muted px-2 py-1 rounded-full">
                {filteredPrompts.length}
              </span>
            )}
          </div>
        </Button>
      </CollapsibleTrigger>
      <CollapsibleContent className="space-y-4">
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
                <Label htmlFor="new-title">Title (optional)</Label>
                <Input
                  id="new-title"
                  placeholder="Enter a title for this prompt..."
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="new-description">Description (optional)</Label>
                <Input
                  id="new-description"
                  placeholder="Enter a description..."
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                />
              </div>
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

          {filteredPrompts.length === 0 && !isAdding && (
            <p className="text-sm text-muted-foreground text-center py-4">
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
                  <Input
                    placeholder="Title..."
                    value={prompt.title || ""}
                    onChange={(e) =>
                      handleUpdatePrompt(prompt.id, { title: e.target.value })
                    }
                  />
                  <Input
                    placeholder="Description..."
                    value={prompt.description || ""}
                    onChange={(e) =>
                      handleUpdatePrompt(prompt.id, {
                        description: e.target.value,
                      })
                    }
                  />
                  <Textarea
                    placeholder="Prompt..."
                    value={prompt.prompt}
                    onChange={(e) =>
                      handleUpdatePrompt(prompt.id, { prompt: e.target.value })
                    }
                    rows={2}
                  />
                  <div className="flex gap-2">
                    <Button size="sm" onClick={() => setEditingId(null)}>
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
                      {prompt.title && (
                        <h4 className="font-medium text-sm truncate">
                          {prompt.title}
                        </h4>
                      )}
                      {prompt.description && (
                        <p className="text-xs text-muted-foreground truncate">
                          {prompt.description}
                        </p>
                      )}
                      <p className="text-sm mt-1 line-clamp-2">
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
      </CollapsibleContent>
    </Collapsible>
  );
}

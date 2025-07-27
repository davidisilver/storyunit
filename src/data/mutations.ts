import { fal } from "@/lib/fal";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { db } from "./db";
import { queryKeys } from "./queries";
import type { VideoProject, SavedPrompt } from "./schema";

export const useProjectUpdater = (projectId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (project: Partial<VideoProject>) =>
      db.projects.update(projectId, project),
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.project(projectId) });
    },
  });
};

export const useProjectCreator = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (project: Omit<VideoProject, "id">) =>
      db.projects.create(project),
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.projects });
    },
  });
};

type JobCreatorParams = {
  projectId: string;
  endpointId: string;
  mediaType: "video" | "image" | "voiceover" | "music" | "text";
  input: Record<string, any>;
};

export const useJobCreator = ({
  projectId,
  endpointId,
  mediaType,
  input,
}: JobCreatorParams) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () =>
      fal.queue.submit(endpointId, {
        input,
      }),
    onSuccess: async (data) => {
      await db.media.create({
        projectId,
        createdAt: Date.now(),
        mediaType,
        kind: "generated",
        endpointId,
        requestId: data.request_id,
        status: "pending",
        input,
      });

      await queryClient.invalidateQueries({
        queryKey: queryKeys.projectMediaItems(projectId),
      });
    },
  });
};

export const useSavedPromptCreator = (projectId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (
      prompt: Omit<SavedPrompt, "id" | "projectId" | "createdAt">,
    ) => {
      try {
        console.log("Creating saved prompt:", { ...prompt, projectId });
        const result = await db.savedPrompts.create({
          ...prompt,
          projectId,
          createdAt: Date.now(),
        });
        console.log("Saved prompt created:", result);
        return result;
      } catch (error) {
        console.error("Error creating saved prompt:", error);
        throw error;
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.projectSavedPrompts(projectId),
      });
    },
  });
};

export const useSavedPromptUpdater = (projectId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      prompt,
    }: {
      id: string;
      prompt: Partial<SavedPrompt>;
    }) => db.savedPrompts.update(id, prompt),
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.projectSavedPrompts(projectId),
      });
    },
  });
};

export const useSavedPromptDeleter = (projectId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => db.savedPrompts.delete(id),
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.projectSavedPrompts(projectId),
      });
    },
  });
};

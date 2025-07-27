import { useMutation } from "@tanstack/react-query";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { cn, resolveMediaUrl } from "@/lib/utils";
import {
  EMPTY_VIDEO_COMPOSITION,
  useProject,
  useVideoComposition,
} from "@/data/queries";
import { fal } from "@/lib/fal";
import { Button } from "./ui/button";
import { useProjectId, useVideoProjectStore } from "@/data/store";
import { LoadingIcon } from "./ui/icons";
import {
  CopyIcon,
  DownloadIcon,
  Share2Icon as ShareIcon,
  FilmIcon,
} from "lucide-react";
import { Input } from "./ui/input";
import type { ShareVideoParams } from "@/lib/share";
import { PROJECT_PLACEHOLDER } from "@/data/schema";
import { useRouter } from "next/navigation";

type ExportDialogProps = {} & Parameters<typeof Dialog>[0];

type ShareResult = {
  video_url: string;
  thumbnail_url: string;
};

export function ExportDialog({ onOpenChange, ...props }: ExportDialogProps) {
  const projectId = useProjectId();
  const { data: composition = EMPTY_VIDEO_COMPOSITION } =
    useVideoComposition(projectId);
  const router = useRouter();
  const exportVideo = useMutation({
    mutationFn: async () => {
      // Trigger GitHub Actions workflow for rendering
      const response = await fetch("/api/render", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ projectId }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to trigger GitHub Actions workflow");
      }

      const result = await response.json();
      return result;
    },
  });
  const setExportDialogOpen = useVideoProjectStore(
    (s) => s.setExportDialogOpen,
  );
  const handleOnOpenChange = (open: boolean) => {
    setExportDialogOpen(open);
    onOpenChange?.(open);
  };

  const { data: project = PROJECT_PLACEHOLDER } = useProject(projectId);
  const share = useMutation({
    mutationFn: async () => {
      if (!exportVideo.data) {
        throw new Error("No video to share");
      }
      const videoInfo = exportVideo.data;
      const response = await fetch("/api/share", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: project.title,
          description: project.description ?? "",
          videoUrl: videoInfo.video_url,
          thumbnailUrl: videoInfo.thumbnail_url,
          createdAt: Date.now(),
          // TODO parametrize this
          width: 1920,
          height: 1080,
        } satisfies ShareVideoParams),
      });
      if (!response.ok) {
        throw new Error("Failed to share video");
      }
      return response.json();
    },
  });

  const handleOnShare = async () => {
    const { id } = await share.mutateAsync();
    router.push(`/share/${id}`);
  };

  const actionsDisabled = exportVideo.isPending || share.isPending;

  return (
    <Dialog onOpenChange={handleOnOpenChange} {...props}>
      <DialogContent className="sm:max-w-4xl max-w-full">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FilmIcon className="w-6 h-6 opacity-50" />
            Export video
          </DialogTitle>
          <DialogDescription />
        </DialogHeader>
        <div className="text-muted-foreground">
          {exportVideo.isPending ? (
            <div className="space-y-4">
              <p className="font-semibold text-green-600 dark:text-green-400">
                🚀 Triggering GitHub Actions workflow...
              </p>
              <div className="p-4 bg-green-50 dark:bg-green-950 rounded-lg">
                <p className="text-sm">
                  Your video is being queued for rendering with text overlays!
                </p>
              </div>
            </div>
          ) : exportVideo.data ? (
            <div className="space-y-4">
              <p className="font-semibold text-green-600 dark:text-green-400">
                ✅ GitHub Actions workflow triggered successfully!
              </p>
              {exportVideo.data.projectInfo && (
                <div className="p-4 bg-blue-50 dark:bg-blue-950 rounded-lg">
                  <h4 className="font-semibold mb-2">Project Details:</h4>
                  <ul className="text-sm space-y-1">
                    <li>📁 Project: {exportVideo.data.projectInfo.title}</li>
                    <li>🎬 Tracks: {exportVideo.data.projectInfo.tracks}</li>
                    <li>📁 Media Items: {exportVideo.data.projectInfo.mediaItems}</li>
                    {exportVideo.data.projectInfo.hasTextTracks && (
                      <li className="text-orange-600 dark:text-orange-400">
                        ✨ Includes text overlays!
                      </li>
                    )}
                  </ul>
                </div>
              )}
              <div className="p-4 bg-blue-50 dark:bg-blue-950 rounded-lg">
                <h4 className="font-semibold mb-2">Next Steps:</h4>
                <ol className="list-decimal list-inside space-y-1 text-sm">
                  <li>Go to the Actions tab in your repository</li>
                  <li>Find the "Render Video" workflow run</li>
                  <li>Wait for it to complete (usually 2-5 minutes)</li>
                  <li>Download the video from artifacts</li>
                </ol>
                {exportVideo.data.actionsUrl && (
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="mt-3"
                    onClick={() => window.open(exportVideo.data.actionsUrl, '_blank')}
                  >
                    Open Actions Tab
                  </Button>
                )}
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <p>
                Click "Export" to trigger GitHub Actions rendering with text overlays!
              </p>
              <div className="p-4 bg-blue-50 dark:bg-blue-950 rounded-lg">
                <h4 className="font-semibold mb-2">What happens:</h4>
                <ul className="list-disc list-inside space-y-1 text-sm">
                  <li>Your project data will be automatically exported</li>
                  <li>GitHub Actions will render the complete video</li>
                  <li>Text overlays will be included in the final video</li>
                  <li>You'll get a high-quality 1080p H.264 video</li>
                </ul>
              </div>
            </div>
          )}
        </div>
        <div
          className={cn(
            "w-full max-h-[500px] mx-auto max-w-full",
            project?.aspectRatio === "16:9" ? "aspect-[16/9]" : "aspect-[9/16]",
          )}
        >
          <div
            className={cn(
              "bg-accent/30 flex flex-col items-center justify-center w-full h-full rounded-lg",
            )}
          >
            {exportVideo.isPending ? (
              <div className="text-center space-y-4">
                <LoadingIcon className="w-16 h-16 mx-auto" />
                <p className="text-sm text-muted-foreground">
                  Triggering GitHub Actions workflow...
                </p>
              </div>
            ) : exportVideo.data ? (
              <div className="text-center space-y-4 p-6">
                <div className="w-16 h-16 mx-auto bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
                  <FilmIcon className="w-8 h-8 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <p className="font-semibold text-green-600 dark:text-green-400">
                    Workflow Triggered!
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Video will be available in GitHub Actions
                  </p>
                </div>
              </div>
            ) : (
              <div className="text-center space-y-4 p-6">
                <FilmIcon className="w-16 h-16 mx-auto opacity-50" />
                <p className="text-sm text-muted-foreground">
                  Click Export to start rendering
                </p>
              </div>
            )}
          </div>
        </div>
        <DialogFooter>
          {exportVideo.data?.actionsUrl && (
            <Button
              variant="secondary"
              onClick={() => window.open(exportVideo.data.actionsUrl, '_blank')}
              disabled={actionsDisabled}
            >
              <ShareIcon className="w-4 h-4 opacity-50" />
              View in Actions
            </Button>
          )}
          <Button
            onClick={() => exportVideo.mutate()}
            disabled={actionsDisabled}
          >
            {exportVideo.isPending ? "Triggering..." : "Export with GitHub Actions"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

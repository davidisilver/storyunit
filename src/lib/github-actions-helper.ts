import { db } from "@/data/db";

export interface CompositionData {
  project: any;
  tracks: any[];
  frames: Record<string, any[]>;
  mediaItems: Record<string, any>;
}

export async function exportCompositionData(projectId: string): Promise<CompositionData> {
  try {
    // Get project data
    const project = await db.projects.find(projectId);
    if (!project) {
      throw new Error(`Project not found: ${projectId}`);
    }

    // Get composition data
    const tracks = await db.tracks.tracksByProject(projectId);
    const frames = (
      await Promise.all(
        tracks.map((track) => db.keyFrames.keyFramesByTrack(track.id)),
      )
    ).flatMap((f) => f);
    const mediaItems = await db.media.mediaByProject(projectId);

    const composition = {
      project,
      tracks,
      frames: Object.fromEntries(
        tracks.map((track) => [
          track.id,
          frames.filter((f) => f.trackId === track.id),
        ]),
      ),
      mediaItems: Object.fromEntries(mediaItems.map((item) => [item.id, item])),
    };

    return composition;
  } catch (error) {
    console.error("Error exporting composition data:", error);
    throw error;
  }
}

export async function triggerGitHubActionsRender(projectId: string, compositionData: CompositionData): Promise<any> {
  const githubToken = process.env.GITHUB_TOKEN;
  const repository = process.env.GITHUB_REPOSITORY;

  if (!githubToken || !repository) {
    throw new Error("GitHub configuration missing");
  }

  // Trigger GitHub Actions workflow
  const workflowId = "render-video.yml";
  const apiUrl = `https://api.github.com/repos/${repository}/actions/workflows/${workflowId}/dispatches`;

  const response = await fetch(apiUrl, {
    method: "POST",
    headers: {
      "Authorization": `token ${githubToken}`,
      "Accept": "application/vnd.github.v3+json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      ref: "main",
      inputs: {
        project_id: projectId,
        composition_data: JSON.stringify(compositionData)
      }
    })
  });

  if (!response.ok) {
    const errorData = await response.text();
    throw new Error(`GitHub API error: ${response.status} - ${errorData}`);
  }

  return response.json();
} 
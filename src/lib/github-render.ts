import { db } from "@/data/db";

export interface CompositionData {
  project: any;
  tracks: any[];
  frames: Record<string, any[]>;
  mediaItems: Record<string, any>;
}

export async function exportCompositionData(projectId: string): Promise<CompositionData | null> {
  try {
    // Get project data
    const project = await db.projects.find(projectId);
    if (!project) {
      console.error("Project not found:", projectId);
      return null;
    }

    // Get composition data
    const tracks = await db.tracks.tracksByProject(projectId);
    const frames = (await Promise.all(
      tracks.map((track) => db.keyFrames.keyFramesByTrack(track.id))
    )).flatMap((f) => f);
    const mediaItems = await db.media.mediaByProject(projectId);

    const composition = {
      project,
      tracks,
      frames: Object.fromEntries(
        tracks.map((track) => [
          track.id,
          frames.filter((f) => f.trackId === track.id),
        ])
      ),
      mediaItems: Object.fromEntries(
        mediaItems.map((item) => [item.id, item])
      ),
    };

    return composition;
  } catch (error) {
    console.error("Error exporting composition data:", error);
    return null;
  }
}

export async function triggerGitHubActionsRender(projectId: string, compositionData: CompositionData): Promise<boolean> {
  try {
    const githubToken = process.env.GITHUB_TOKEN;
    if (!githubToken) {
      console.error("GitHub token not configured");
      return false;
    }

    const repoOwner = process.env.GITHUB_REPOSITORY?.split('/')[0] || 'your-username';
    const repoName = process.env.GITHUB_REPOSITORY?.split('/')[1] || 'storyunit-main';

    const response = await fetch(`https://api.github.com/repos/${repoOwner}/${repoName}/dispatches`, {
      method: 'POST',
      headers: {
        'Authorization': `token ${githubToken}`,
        'Accept': 'application/vnd.github.v3+json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        event_type: 'render-video',
        client_payload: {
          project_id: projectId,
          composition_data: JSON.stringify(compositionData),
        },
      }),
    });

    if (!response.ok) {
      console.error('Failed to trigger GitHub Actions:', response.statusText);
      return false;
    }

    console.log('GitHub Actions workflow triggered successfully');
    return true;
  } catch (error) {
    console.error('Error triggering GitHub Actions:', error);
    return false;
  }
} 
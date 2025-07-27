import { db } from "@/data/db";

export interface CompositionData {
  project: any;
  tracks: any[];
  frames: Record<string, any[]>;
  mediaItems: Record<string, any>;
}

export async function exportCompositionDataFromBrowser(projectId: string): Promise<CompositionData> {
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

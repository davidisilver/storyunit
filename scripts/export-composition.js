#!/usr/bin/env node

/**
 * Script to export composition data for GitHub Actions rendering
 * Usage: node scripts/export-composition.js <project-id>
 */

const { db } = require('../src/data/db');

async function exportComposition(projectId) {
  try {
    console.log(`Exporting composition data for project: ${projectId}`);
    
    // Get project data
    const project = await db.projects.find(projectId);
    if (!project) {
      console.error("Project not found:", projectId);
      process.exit(1);
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

    // Save to file
    const fs = require('fs');
    const outputPath = `composition-${projectId}.json`;
    fs.writeFileSync(outputPath, JSON.stringify(composition, null, 2));
    
    console.log(`✅ Composition data exported to: ${outputPath}`);
    console.log(`📊 Project: ${project.title || projectId}`);
    console.log(`🎬 Tracks: ${tracks.length}`);
    console.log(`🎯 Frames: ${frames.length}`);
    console.log(`📁 Media items: ${mediaItems.length}`);
    
    // Check for text tracks
    const textTracks = tracks.filter(track => track.type === 'text');
    if (textTracks.length > 0) {
      console.log(`📝 Text tracks found: ${textTracks.length}`);
      console.log(`✨ This composition includes text overlays!`);
    }
    
    console.log(`\n🚀 Next steps:`);
    console.log(`1. Go to GitHub Actions tab in this repository`);
    console.log(`2. Click "Render Video" workflow`);
    console.log(`3. Enter project ID: ${projectId}`);
    console.log(`4. Copy the contents of ${outputPath} as composition data`);
    console.log(`5. Run the workflow and download the video!`);
    
  } catch (error) {
    console.error("Error exporting composition:", error);
    process.exit(1);
  }
}

// Get project ID from command line arguments
const projectId = process.argv[2];
if (!projectId) {
  console.error("Usage: node scripts/export-composition.js <project-id>");
  process.exit(1);
}

exportComposition(projectId); 
#!/usr/bin/env node

/**
 * Script to help export composition data for GitHub Actions rendering
 * Usage: node scripts/export-composition.js <project-id>
 */

const fs = require("fs");

function showExportInstructions(projectId) {
  console.log(`🎬 Export Instructions for Project: ${projectId}\n`);

  console.log(`📋 Manual Export Steps:`);
  console.log(`1. Open your browser's Developer Tools (F12)`);
  console.log(`2. Go to the Application/Storage tab`);
  console.log(`3. Find IndexedDB → storyunit → projects`);
  console.log(`4. Look for your project data`);
  console.log(`5. Copy the project, tracks, frames, and media items\n`);

  console.log(`🔧 Alternative: Use Browser Console`);
  console.log(`1. Open browser console on your project page`);
  console.log(`2. Run this command:`);
  console.log(`   copy(JSON.stringify(window.__STORYUNIT_DATA__, null, 2))`);
  console.log(`3. Paste the data into a file named: composition-${projectId}.json\n`);

  console.log(`🚀 GitHub Actions Steps:`);
  console.log(`1. Go to: https://github.com/davidisilver/storyunit/actions`);
  console.log(`2. Click "Render Video" workflow`);
  console.log(`3. Click "Run workflow"`);
  console.log(`4. Enter Project ID: ${projectId}`);
  console.log(`5. Paste your composition JSON data`);
  console.log(`6. Click "Run workflow"`);
  console.log(`7. Download the video from artifacts\n`);

  console.log(`📝 Sample Composition Structure:`);
  const sampleStructure = {
    project: {
      id: projectId,
      title: "Your Project Title",
      // ... other project data
    },
    tracks: [
      {
        id: "track-1",
        type: "video",
        // ... track data
      }
    ],
    frames: {
      "track-1": [
        {
          id: "frame-1",
          trackId: "track-1",
          timestamp: 0,
          duration: 5000,
          data: { mediaId: "media-1" }
        }
      ]
    },
    mediaItems: {
      "media-1": {
        id: "media-1",
        mediaType: "video",
        url: "https://...",
        // ... media data
      }
    }
  };

  console.log(JSON.stringify(sampleStructure, null, 2));
  console.log(`\n💡 Tip: Make sure to include all text tracks for text overlay rendering!`);
}

// Get project ID from command line arguments
const projectId = process.argv[2];
if (!projectId) {
  console.error("Usage: node scripts/export-composition.js <project-id>");
  console.error("Example: node scripts/export-composition.js my-project-123");
  process.exit(1);
}

showExportInstructions(projectId);

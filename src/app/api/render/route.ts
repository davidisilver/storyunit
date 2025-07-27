import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { projectId } = await request.json();

    if (!projectId) {
      return NextResponse.json({ error: "Project ID is required" }, { status: 400 });
    }

    // For now, let's use a simpler approach that doesn't require IndexedDB
    // We'll trigger GitHub Actions for rendering with text overlays
    
    // Check if we have the GitHub token
    const githubToken = process.env.GITHUB_TOKEN;
    if (!githubToken) {
      return NextResponse.json({ 
        error: "GitHub Actions not configured",
        message: "Please set up GITHUB_TOKEN environment variable"
      }, { status: 500 });
    }

    // For now, return a message about GitHub Actions rendering
    return NextResponse.json({ 
      success: true, 
      message: "GitHub Actions rendering is set up! Use the Actions tab to render videos with text overlays.",
      note: "This will render the complete video including text overlays using Remotion in a proper Node.js environment.",
      nextSteps: [
        "1. Go to the Actions tab in this repository",
        "2. Click 'Render Video' workflow",
        "3. Enter your project ID and composition data",
        "4. Download the rendered video from artifacts"
      ]
    });

  } catch (error) {
    console.error("Error in render API:", error);
    return NextResponse.json(
      { error: "Failed to process render request", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
} 
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { projectId, compositionData } = await request.json();

    if (!projectId) {
      return NextResponse.json(
        { error: "Project ID is required" },
        { status: 400 },
      );
    }

    if (!compositionData) {
      return NextResponse.json(
        { error: "Composition data is required" },
        { status: 400 },
      );
    }

    // Check if we have the GitHub token
    const githubToken = process.env.GITHUB_TOKEN;
    const repository = process.env.GITHUB_REPOSITORY;

    if (!githubToken) {
      return NextResponse.json(
        {
          error: "GitHub Actions not configured",
          message: "Please set up GITHUB_TOKEN environment variable",
        },
        { status: 500 },
      );
    }

    if (!repository) {
      return NextResponse.json(
        {
          error: "Repository not configured",
          message: "Please set up GITHUB_REPOSITORY environment variable",
        },
        { status: 500 },
      );
    }

    // Trigger GitHub Actions workflow
    const workflowId = "render-video.yml";
    const apiUrl = `https://api.github.com/repos/${repository}/actions/workflows/${workflowId}/dispatches`;

    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        Authorization: `token ${githubToken}`,
        Accept: "application/vnd.github.v3+json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ref: "main",
        inputs: {
          project_id: projectId,
          composition_data: JSON.stringify(compositionData),
        },
      }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error("GitHub API error:", response.status, errorData);
      return NextResponse.json(
        {
          error: "Failed to trigger GitHub Actions workflow",
          details: `GitHub API returned ${response.status}: ${errorData}`,
        },
        { status: 500 },
      );
    }

    // Get the workflow run ID
    const workflowRunsUrl = `https://api.github.com/repos/${repository}/actions/runs?workflow_id=${workflowId}&per_page=1`;
    const runsResponse = await fetch(workflowRunsUrl, {
      headers: {
        Authorization: `token ${githubToken}`,
        Accept: "application/vnd.github.v3+json",
      },
    });

    let workflowRunId = null;
    if (runsResponse.ok) {
      const runsData = await runsResponse.json();
      if (runsData.workflow_runs && runsData.workflow_runs.length > 0) {
        workflowRunId = runsData.workflow_runs[0].id;
      }
    }

    return NextResponse.json({
      success: true,
      message: "GitHub Actions workflow triggered successfully!",
      workflowRunId,
      projectInfo: {
        title: compositionData.project?.title || projectId,
        tracks: compositionData.tracks?.length || 0,
        mediaItems: Object.keys(compositionData.mediaItems || {}).length,
        hasTextTracks:
          compositionData.tracks?.some((track) => track.type === "text") ||
          false,
      },
      nextSteps: [
        "1. Go to the Actions tab in your repository",
        "2. Find the 'Render Video' workflow run",
        "3. Wait for it to complete",
        "4. Download the video from artifacts",
      ],
      actionsUrl: `https://github.com/${repository}/actions`,
    });
  } catch (error) {
    console.error("Error in render API:", error);
    return NextResponse.json(
      {
        error: "Failed to process render request",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}

import { registerRoot, Composition, AbsoluteFill } from "remotion";
import { VideoComposition } from "./components/video-preview";

// Get composition data from environment variables
const getCompositionData = () => {
  if (typeof process !== 'undefined' && process.env.COMPOSITION_DATA && process.env.COMPOSITION_DATA !== 'auto-triggered') {
    try {
      return JSON.parse(process.env.COMPOSITION_DATA);
    } catch (e) {
      console.log('Could not parse composition data from environment');
    }
  }
  
  // Fallback to sample data for testing
  return {
    project: {
      id: 'test-project',
      title: 'Test Project',
      createdAt: Date.now()
    },
    tracks: [],
    frames: {},
    mediaItems: {}
  };
};

// Main composition component that uses the actual VideoComposition
const MainComposition = () => {
  const compositionData = getCompositionData();
  
  console.log('MainComposition rendering with data:', {
    projectId: compositionData.project?.id,
    tracksCount: compositionData.tracks?.length || 0,
    framesCount: Object.keys(compositionData.frames || {}).length,
    mediaItemsCount: Object.keys(compositionData.mediaItems || {}).length
  });
  
  try {
    return (
      <VideoComposition
        project={compositionData.project}
        tracks={compositionData.tracks}
        frames={compositionData.frames}
        mediaItems={compositionData.mediaItems}
      />
    );
  } catch (error) {
    console.error('Error rendering VideoComposition:', error);
    return (
      <AbsoluteFill
        style={{
          backgroundColor: "purple",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "white",
          fontSize: "60px",
        }}
      >
        ERROR: {error instanceof Error ? error.message : String(error)}
      </AbsoluteFill>
    );
  }
};

// Register the root component
registerRoot(() => {
  return (
    <Composition
      id="test-composition"
      component={MainComposition}
      durationInFrames={150}
      fps={30}
      width={1920}
      height={1080}
    />
  );
});

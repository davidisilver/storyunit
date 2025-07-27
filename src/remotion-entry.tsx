import {
  registerRoot,
  Composition,
  AbsoluteFill,
  Sequence,
  Video,
  Img,
} from "remotion";

// Get composition data from input props or fallback to sample data
const getCompositionData = (inputProps: any = {}) => {
  // Try to get composition data from input props first
  if (inputProps.compositionData) {
    try {
      return inputProps.compositionData;
    } catch (e) {
      console.log("Could not parse composition data from input props");
    }
  }

  // Fallback to sample data for testing
  return {
    project: {
      id: "test-project",
      title: "Test Project",
      createdAt: Date.now(),
    },
    tracks: [],
    frames: {},
    mediaItems: {},
  };
};

// Simplified text overlay component
const TextOverlay = ({
  text,
  fontSize = 48,
  fontFamily = "Arial",
  fontWeight = "bold",
  color = "white",
  backgroundColor = "rgba(0, 0, 0, 0.7)",
  textAlign = "center" as const,
  position = "bottom" as const,
}: {
  text: string;
  fontSize?: number;
  fontFamily?: string;
  fontWeight?: string;
  color?: string;
  backgroundColor?: string;
  textAlign?: "left" | "center" | "right";
  position?: "top" | "center" | "bottom";
}) => {
  const finalFontSize = fontSize || 48;

  const getPositionStyle = () => {
    switch (position) {
      case "top":
        return { top: 20, bottom: "auto" };
      case "center":
        return { top: "50%", transform: "translateY(-50%)" };
      case "bottom":
      default:
        return { bottom: 20, top: "auto" };
    }
  };

  return (
    <div
      style={{
        position: "absolute",
        left: 20,
        right: 20,
        padding: "10px 20px",
        backgroundColor,
        borderRadius: "8px",
        fontSize: finalFontSize,
        fontFamily,
        fontWeight,
        color,
        textAlign,
        ...getPositionStyle(),
      }}
    >
      {text}
    </div>
  );
};

// Main composition component with simplified rendering
const MainComposition = (props: any) => {
  const compositionData = getCompositionData(props);

  console.log("MainComposition is being executed!");
  console.log("MainComposition rendering with data:", {
    projectId: compositionData.project?.id,
    tracksCount: compositionData.tracks?.length || 0,
    framesCount: Object.keys(compositionData.frames || {}).length,
    mediaItemsCount: Object.keys(compositionData.mediaItems || {}).length,
  });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "green",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "white",
        fontSize: "80px",
        fontWeight: "bold",
      }}
    >
      <div>
        <div>MAIN COMPOSITION</div>
        <div style={{ fontSize: "40px", marginTop: "20px" }}>
          This should be visible!
        </div>
        <div style={{ fontSize: "24px", marginTop: "10px" }}>
          Tracks: {compositionData.tracks?.length || 0}
        </div>
        <div style={{ fontSize: "24px" }}>
          Media: {Object.keys(compositionData.mediaItems || {}).length}
        </div>
      </div>
    </AbsoluteFill>
  );
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

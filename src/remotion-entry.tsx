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
  console.log("getCompositionData called with inputProps:", inputProps);

  // Try to get composition data from input props first
  if (inputProps.compositionData) {
    console.log(
      "Found compositionData in inputProps:",
      inputProps.compositionData,
    );
    try {
      return inputProps.compositionData;
    } catch (e) {
      console.log("Could not parse composition data from input props");
    }
  } else {
    console.log("No compositionData found in inputProps, using fallback");
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

// Super simple test component
const MainComposition = () => {
  console.log("MainComposition is being executed!");
  console.log("This is a test log from the Remotion component!");

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "purple",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "white",
        fontSize: "80px",
        fontWeight: "bold",
      }}
    >
      <div>
        <div>PURPLE TEST</div>
        <div style={{ fontSize: "40px", marginTop: "20px" }}>
          Component is working!
        </div>
      </div>
    </AbsoluteFill>
  );
};

// Export the component as named export
export { MainComposition };

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

const React = require("react");
const {
  registerRoot,
  Composition,
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
} = require("remotion");

// Main video composition component
const MainComposition = ({ compositionData }) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  console.log("MainComposition is being executed!");
  console.log("Composition data type:", typeof compositionData);
  console.log("Composition data:", compositionData);
  console.log("Current frame:", frame);
  console.log("FPS:", fps);
  console.log("Duration in frames:", durationInFrames);

  // If no composition data, show a placeholder
  if (!compositionData) {
    console.log("No composition data provided - showing placeholder");
    return React.createElement(
      AbsoluteFill,
      {
        style: {
          backgroundColor: "#1a1a1a",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "white",
          fontSize: "60px",
          fontWeight: "bold",
        },
      },
      React.createElement("div", {}, "No composition data provided"),
    );
  }

  // Log the structure of composition data
  console.log("Composition data structure:");
  console.log("- project:", compositionData.project);
  console.log("- tracks:", compositionData.tracks);
  console.log("- frames keys:", Object.keys(compositionData.frames || {}));
  console.log("- mediaItems keys:", Object.keys(compositionData.mediaItems || {}));

  // Calculate current time in milliseconds
  const currentTimeMs = (frame / fps) * 1000;

  console.log(`Current time: ${currentTimeMs}ms (frame ${frame})`);

  // Find active frames at current time
  const activeFrames = [];

  for (const [trackId, trackFrames] of Object.entries(compositionData.frames)) {
    for (const frameData of trackFrames) {
      const frameStart = frameData.timestamp;
      const frameEnd = frameData.timestamp + frameData.duration;

      console.log(`Checking frame ${frameData.id}: ${frameStart}ms - ${frameEnd}ms`);

      if (currentTimeMs >= frameStart && currentTimeMs < frameEnd) {
        console.log(`Frame ${frameData.id} is active at time ${currentTimeMs}ms`);
        activeFrames.push({
          trackId,
          frameData,
          mediaItem: compositionData.mediaItems[frameData.data.mediaId],
        });
      }
    }
  }

  console.log("Active frames at current time:", activeFrames);

  // Render the composition
  return React.createElement(
    AbsoluteFill,
    {
      style: {
        backgroundColor: "#000000",
        position: "relative",
        overflow: "hidden",
      },
    },
    // Render background
    React.createElement("div", {
      style: {
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        backgroundColor: "#1a1a1a",
      },
    }),

    // Render active frames
    ...activeFrames.map(({ frameData, mediaItem }, index) => {
      console.log(`Rendering frame ${frameData.id}, mediaItem:`, mediaItem);
      
      if (mediaItem?.mediaType === "video" && mediaItem?.output?.video?.url) {
        console.log(`Rendering video: ${mediaItem.output.video.url}`);
        // Render video
        return React.createElement("video", {
          key: `${frameData.id}-${index}`,
          src: mediaItem.output.video.url,
          style: {
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
          },
          autoPlay: true,
          muted: true,
          loop: true,
        });
      } else if (mediaItem?.mediaType === "text" && mediaItem?.input?.text) {
        console.log(`Rendering text: ${mediaItem.input.text}`);
        // Render text overlay
        const textStyle = {
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          color: mediaItem.input.color || "white",
          fontSize: `${mediaItem.input.fontSize || 48}px`,
          fontFamily: mediaItem.input.fontFamily || "Arial",
          fontWeight: mediaItem.input.fontWeight || "normal",
          textAlign: mediaItem.input.textAlign || "center",
          backgroundColor: mediaItem.input.backgroundColor || "transparent",
          padding: "20px",
          borderRadius: "10px",
          zIndex: 10,
        };

        return React.createElement(
          "div",
          {
            key: `${frameData.id}-${index}`,
            style: textStyle,
          },
          mediaItem.input.text,
        );
      } else {
        console.log(`No valid media item found for frame ${frameData.id}:`, mediaItem);
      }

      return null;
    }),

    // Render debug info (only in development)
    process.env.NODE_ENV === "development"
      ? React.createElement(
          "div",
          {
            style: {
              position: "absolute",
              top: "10px",
              left: "10px",
              color: "white",
              fontSize: "16px",
              backgroundColor: "rgba(0,0,0,0.7)",
              padding: "10px",
              borderRadius: "5px",
              zIndex: 100,
            },
          },
          React.createElement("div", {}, `Frame: ${frame}`),
          React.createElement(
            "div",
            {},
            `Time: ${(currentTimeMs / 1000).toFixed(2)}s`,
          ),
          React.createElement("div", {}, `Active: ${activeFrames.length}`),
        )
      : null,
  );
};

// Export the component as default export
module.exports = MainComposition;

// Register the root component
registerRoot(() => {
  return React.createElement(Composition, {
    id: "test-composition",
    component: MainComposition,
    durationInFrames: 150,
    fps: 30,
    width: 1920,
    height: 1080,
  });
});

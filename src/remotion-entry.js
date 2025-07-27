const React = require("react");
const {
  registerRoot,
  Composition,
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
} = require("remotion");

// Simple test composition that will definitely work
const TestComposition = (props) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  console.log("=== TEST COMPOSITION DEBUG ===");
  console.log("Frame:", frame);
  console.log("FPS:", fps);
  console.log("Duration:", durationInFrames);
  console.log("All props:", props);
  console.log("Composition data:", props.compositionData);
  console.log("==============================");

  // Always show something, even if no data
  return React.createElement(
    AbsoluteFill,
    {
      style: {
        backgroundColor: "#000000",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "white",
        fontSize: "48px",
        fontWeight: "bold",
        textAlign: "center",
      },
    },
    React.createElement(
      "div",
      {},
      React.createElement("div", {}, `Frame: ${frame}`),
      React.createElement("div", {}, `Time: ${(frame / fps).toFixed(2)}s`),
      React.createElement(
        "div",
        {},
        `Props: ${JSON.stringify(props, null, 2)}`,
      ),
      props.compositionData
        ? React.createElement("div", {}, "✅ Composition data received!")
        : React.createElement("div", {}, "❌ No composition data"),
    ),
  );
};

// Register the composition
registerRoot(() => {
  return React.createElement(Composition, {
    id: "test-composition",
    component: TestComposition,
    durationInFrames: 150,
    fps: 30,
    width: 1920,
    height: 1080,
    defaultProps: {
      compositionData: null,
    },
  });
});

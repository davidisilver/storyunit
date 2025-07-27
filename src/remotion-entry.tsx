import { registerRoot, Composition, AbsoluteFill } from "remotion";

// Simple test component
const TestComponent = () => (
  <AbsoluteFill style={{ backgroundColor: "red" }} />
);

// Register the root component
registerRoot(() => {
  return (
    <Composition
      id="test-composition"
      component={TestComponent}
      durationInFrames={30}
      fps={30}
      width={1920}
      height={1080}
    />
  );
});

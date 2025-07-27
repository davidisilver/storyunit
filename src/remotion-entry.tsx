import { Composition, AbsoluteFill } from "remotion";

// Simplest possible component
const TestComponent = () => (
  <AbsoluteFill style={{ backgroundColor: "red" }} />
);

// Simple Remotion entry point
export const RemotionRoot = () => {
  return (
    <Composition
      id="test"
      component={TestComponent}
      durationInFrames={30}
      fps={30}
      width={1920}
      height={1080}
    />
  );
};

import { Composition, AbsoluteFill } from "remotion";

// Minimal test component to isolate the delayRender issue
const MinimalTestComponent: React.FC = () => {
  return (
    <AbsoluteFill
      style={{
        backgroundColor: "black",
        color: "white",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: "48px",
        fontWeight: "bold",
      }}
    >
      Hello World!
    </AbsoluteFill>
  );
};

// Simple Remotion entry point for testing
export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="video-composition"
        component={MinimalTestComponent}
        durationInFrames={150} // 5 seconds at 30fps
        fps={30}
        width={1024}
        height={576}
      />
    </>
  );
};

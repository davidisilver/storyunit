import { Composition } from "remotion";
import { MainComposition } from "./components/video-preview";

// Simple Remotion entry point for server-side rendering
export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="video-composition"
        component={MainComposition}
        durationInFrames={150} // 5 seconds at 30fps
        fps={30}
        width={1024}
        height={576}
        defaultProps={{
          project: {
            id: "default-project",
            title: "Default Project",
            aspectRatio: "16:9",
            createdAt: Date.now(),
          },
          tracks: [],
          frames: {},
          mediaItems: {},
        }}
      />
    </>
  );
};

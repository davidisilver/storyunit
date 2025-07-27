import { registerRoot, Composition, AbsoluteFill, Sequence, Video, Img } from "remotion";
import { fitText } from "@remotion/layout-utils";

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

// Simplified text overlay component
const TextOverlay = ({ text, fontSize = 48, fontFamily = "Arial", fontWeight = "bold", color = "white", backgroundColor = "rgba(0, 0, 0, 0.7)", textAlign = "center" as const, position = "bottom" as const }: {
  text: string;
  fontSize?: number;
  fontFamily?: string;
  fontWeight?: string;
  color?: string;
  backgroundColor?: string;
  textAlign?: "left" | "center" | "right";
  position?: "top" | "center" | "bottom";
}) => {
  const { fontSize: fittedFontSize } = fitText({
    text,
    withinWidth: 800,
    fontFamily,
    fontWeight,
  });

  const finalFontSize = fontSize || fittedFontSize;

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
const MainComposition = () => {
  const compositionData = getCompositionData();
  
  console.log('MainComposition rendering with data:', {
    projectId: compositionData.project?.id,
    tracksCount: compositionData.tracks?.length || 0,
    framesCount: Object.keys(compositionData.frames || {}).length,
    mediaItemsCount: Object.keys(compositionData.mediaItems || {}).length
  });
  
  try {
    const tracks = compositionData.tracks || [];
    const frames = compositionData.frames || {};
    const mediaItems = compositionData.mediaItems || {};
    
    return (
      <AbsoluteFill>
        {tracks.map((track: any) => {
          const trackFrames = frames[track.id] || [];
          
          return trackFrames.map((frame: any) => {
            const duration = frame.duration || 5000;
            const durationInFrames = Math.floor(duration / (1000 / 30)); // 30fps
            const startFrame = Math.floor(frame.timestamp / (1000 / 30));
            
            if (track.type === "video" && frame.data.mediaId) {
              const mediaItem = mediaItems[frame.data.mediaId];
              if (mediaItem && mediaItem.url) {
                return (
                  <Sequence key={frame.id} from={startFrame} durationInFrames={durationInFrames}>
                    <Video src={mediaItem.url} />
                  </Sequence>
                );
              }
            }
            
            if (track.type === "text" && frame.data.type === "text") {
              const textData = frame.data;
              return (
                <Sequence key={frame.id} from={startFrame} durationInFrames={durationInFrames}>
                  <TextOverlay
                    text={textData.text}
                    fontSize={textData.fontSize}
                    fontFamily={textData.fontFamily}
                    fontWeight={textData.fontWeight}
                    color={textData.color}
                    backgroundColor={textData.backgroundColor}
                    textAlign={textData.textAlign}
                    position={textData.position}
                  />
                </Sequence>
              );
            }
            
            return null;
          });
        })}
      </AbsoluteFill>
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

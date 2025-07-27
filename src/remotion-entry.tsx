import { Composition, AbsoluteFill, Sequence, Video, Audio, Img } from "remotion";

// Standalone types for Remotion rendering
interface MediaItem {
  id: string;
  mediaType: "video" | "image" | "audio" | "music" | "voiceover" | "text";
  status: "completed" | "pending" | "running" | "failed";
  url?: string;
  text?: string;
  fontSize?: number;
  fontFamily?: string;
  fontWeight?: string;
  color?: string;
  backgroundColor?: string;
  textAlign?: "left" | "center" | "right";
  position?: "top" | "center" | "bottom";
}

interface VideoKeyFrame {
  id: string;
  trackId: string;
  timestamp: number;
  duration: number;
  data: { mediaId: string };
}

interface VideoTrack {
  id: string;
  type: "video" | "audio" | "music" | "voiceover" | "text";
  projectId: string;
}

interface VideoProject {
  id: string;
  title: string;
  aspectRatio?: "16:9" | "9:16" | "1:1";
  createdAt: number;
}

interface VideoCompositionProps {
  project: VideoProject;
  tracks: VideoTrack[];
  frames: Record<string, VideoKeyFrame[]>;
  mediaItems: Record<string, MediaItem>;
}

const FPS = 30;

// Simple media URL resolver
const resolveMediaUrl = (media: MediaItem): string | null => {
  if (media.url) return media.url;
  if (media.mediaType === "text") return null;
  return null;
};

// Simple duration resolver
const resolveDuration = (media: MediaItem): number => {
  // Default 5 seconds for most media types
  return 5000;
};

// Standalone video track sequence
const VideoTrackSequence: React.FC<{
  frames: VideoKeyFrame[];
  mediaItems: Record<string, MediaItem>;
}> = ({ frames, mediaItems }) => {
  return (
    <AbsoluteFill>
      {frames.map((frame) => {
        const media = mediaItems[frame.data.mediaId];
        if (!media || media.status !== "completed") return null;

        const mediaUrl = resolveMediaUrl(media);
        if (!mediaUrl) return null;

        const duration = frame.duration || resolveDuration(media) || 5000;
        const durationInFrames = Math.floor(duration / (1000 / FPS));

        return (
          <Sequence
            key={frame.id}
            from={Math.floor(frame.timestamp / (1000 / FPS))}
            durationInFrames={durationInFrames}
          >
            {media.mediaType === "video" && <Video src={mediaUrl} />}
            {media.mediaType === "image" && (
              <Img src={mediaUrl} style={{ objectFit: "cover" }} />
            )}
          </Sequence>
        );
      })}
    </AbsoluteFill>
  );
};

// Standalone audio track sequence
const AudioTrackSequence: React.FC<{
  frames: VideoKeyFrame[];
  mediaItems: Record<string, MediaItem>;
}> = ({ frames, mediaItems }) => {
  return (
    <>
      {frames.map((frame) => {
        const media = mediaItems[frame.data.mediaId];
        if (!media || media.status !== "completed") return null;

        const audioUrl = resolveMediaUrl(media);
        if (!audioUrl) return null;

        const duration = frame.duration || resolveDuration(media) || 5000;
        const durationInFrames = Math.floor(duration / (1000 / FPS));

        return (
          <Sequence
            key={frame.id}
            from={Math.floor(frame.timestamp / (1000 / FPS))}
            durationInFrames={durationInFrames}
          >
            <Audio src={audioUrl} />
          </Sequence>
        );
      })}
    </>
  );
};

// Standalone text overlay component
const TextOverlay: React.FC<{
  text: string;
  fontSize?: number;
  fontFamily?: string;
  fontWeight?: string;
  color?: string;
  backgroundColor?: string;
  textAlign?: "left" | "center" | "right";
  position?: "top" | "center" | "bottom";
}> = ({
  text,
  fontSize = 48,
  fontFamily = "Arial",
  fontWeight = "bold",
  color = "white",
  backgroundColor = "rgba(0, 0, 0, 0.7)",
  textAlign = "center",
  position = "bottom",
}) => {
  const getPositionStyle = () => {
    switch (position) {
      case "top":
        return { top: 20, left: 20, right: 20 };
      case "center":
        return { top: "50%", left: 20, right: 20, transform: "translateY(-50%)" };
      case "bottom":
      default:
        return { bottom: 20, left: 20, right: 20 };
    }
  };

  return (
    <div
      style={{
        position: "absolute",
        padding: "10px 20px",
        backgroundColor,
        color,
        fontSize,
        fontFamily,
        fontWeight,
        textAlign,
        borderRadius: "8px",
        ...getPositionStyle(),
      }}
    >
      {text}
    </div>
  );
};

// Standalone text track sequence
const TextTrackSequence: React.FC<{
  frames: VideoKeyFrame[];
  mediaItems: Record<string, MediaItem>;
}> = ({ frames, mediaItems }) => {
  return (
    <AbsoluteFill>
      {frames.map((frame) => {
        const media = mediaItems[frame.data.mediaId];
        if (!media || media.status !== "completed" || media.mediaType !== "text") return null;

        const duration = frame.duration || 5000;
        const durationInFrames = Math.floor(duration / (1000 / FPS));

        return (
          <Sequence
            key={frame.id}
            from={Math.floor(frame.timestamp / (1000 / FPS))}
            durationInFrames={durationInFrames}
          >
            <TextOverlay
              text={media.text || ""}
              fontSize={media.fontSize}
              fontFamily={media.fontFamily}
              fontWeight={media.fontWeight}
              color={media.color}
              backgroundColor={media.backgroundColor}
              textAlign={media.textAlign}
              position={media.position}
            />
          </Sequence>
        );
      })}
    </AbsoluteFill>
  );
};

// Standalone main composition
const StandaloneMainComposition: React.FC<VideoCompositionProps> = ({
  tracks,
  frames,
  mediaItems,
}) => {
  return (
    <AbsoluteFill>
      {tracks.map((track) => (
        <Sequence key={track.id}>
          {track.type === "video" && (
            <VideoTrackSequence
              frames={frames[track.id] || []}
              mediaItems={mediaItems}
            />
          )}
          {(track.type === "music" || track.type === "voiceover") && (
            <AudioTrackSequence
              frames={frames[track.id] || []}
              mediaItems={mediaItems}
            />
          )}
          {track.type === "text" && (
            <TextTrackSequence
              frames={frames[track.id] || []}
              mediaItems={mediaItems}
            />
          )}
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};

// Simple Remotion entry point for server-side rendering
export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="video-composition"
        component={StandaloneMainComposition as any}
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

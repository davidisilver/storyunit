"use client";

import { createFalClient } from "@fal-ai/client";

export const fal = createFalClient({
  credentials: process.env.NEXT_PUBLIC_FAL_KEY || (() => {
    // Fallback to localStorage if no environment variable
    if (typeof window !== "undefined") {
      return localStorage?.getItem("falKey") as string;
    }
    return undefined;
  }),
  proxyUrl: "/api/fal",
});

export type InputAsset =
  | "video"
  | "image"
  | "audio"
  | {
      type: "video" | "image" | "audio";
      key: string;
    };

export type ApiInfo = {
  endpointId: string;
  label: string;
  description: string;
  cost: string;
  inferenceTime?: string;
  inputMap?: Record<string, string>;
  inputAsset?: InputAsset[];
  initialInput?: Record<string, unknown>;
  cameraControl?: boolean;
  imageForFrame?: boolean;
  category: "image" | "video" | "music" | "voiceover";
  prompt?: boolean;
};

export const AVAILABLE_ENDPOINTS: ApiInfo[] = [
  {
    endpointId: "fal-ai/flux/dev",
    label: "Flux Dev",
    description: "Generate a video from a text prompt",
    cost: "",
    category: "image",
  },
  {
    endpointId: "fal-ai/flux/schnell",
    label: "Flux Schnell",
    description: "Generate a video from a text prompt",
    cost: "",
    category: "image",
  },
  {
    endpointId: "fal-ai/flux-pro/v1.1-ultra",
    label: "Flux Pro 1.1 Ultra",
    description: "Generate a video from a text prompt",
    cost: "",
    category: "image",
  },
  {
    endpointId: "fal-ai/stable-diffusion-v35-large",
    label: "Stable Diffusion 3.5 Large",
    description: "Image quality, typography, complex prompt understanding",
    cost: "",
    category: "image",
  },

  {
    endpointId: "fal-ai/minimax-music",
    label: "Minimax Music",
    description:
      "Advanced AI techniques to create high-quality, diverse musical compositions",
    cost: "",
    category: "music",
    inputAsset: [
      {
        type: "audio",
        key: "reference_audio_url",
      },
    ],
  },
  {
    endpointId: "fal-ai/mmaudio-v2",
    label: "MMAudio V2",
    description:
      "MMAudio generates synchronized audio given video and/or text inputs. It can be combined with video models to get videos with audio.",
    cost: "",
    inputAsset: ["video"],
    category: "video",
  },
  {
    endpointId: "fal-ai/sync-lipsync",
    label: "sync.so -- lipsync 1.8.0",
    description:
      "Generate realistic lipsync animations from audio using advanced algorithms for high-quality synchronization.",
    cost: "",
    inputAsset: ["video", "audio"],
    category: "video",
  },
  {
    endpointId: "fal-ai/stable-audio",
    label: "Stable Audio",
    description: "Stable Diffusion music creation with high-quality tracks",
    cost: "",
    category: "music",
  },
  {
    endpointId: "fal-ai/playht/tts/v3",
    label: "PlayHT TTS v3",
    description: "Fluent and faithful speech with flow matching",
    cost: "",
    category: "voiceover",
    initialInput: {
      voice: "Dexter (English (US)/American)",
    },
  },
  {
    endpointId: "fal-ai/playai/tts/dialog",
    label: "PlayAI Text-to-Speech Dialog",
    description:
      "Generate natural-sounding multi-speaker dialogues. Perfect for expressive outputs, storytelling, games, animations, and interactive media.",
    cost: "",
    category: "voiceover",
    inputMap: {
      prompt: "input",
    },
    initialInput: {
      voices: [
        {
          voice: "Jennifer (English (US)/American)",
          turn_prefix: "Speaker 1: ",
        },
        {
          voice: "Furio (English (IT)/Italian)",
          turn_prefix: "Speaker 2: ",
        },
      ],
    },
  },
  {
    endpointId: "fal-ai/f5-tts",
    label: "F5 TTS",
    description: "Fluent and faithful speech with flow matching",
    cost: "",
    category: "voiceover",
    initialInput: {
      ref_audio_url:
        "https://github.com/SWivid/F5-TTS/raw/21900ba97d5020a5a70bcc9a0575dc7dec5021cb/tests/ref_audio/test_en_1_ref_short.wav",
      ref_text: "Some call me nature, others call me mother nature.",
      model_type: "F5-TTS",
      remove_silence: true,
    },
  },
  {
    endpointId: "fal-ai/bytedance/seedance/v1/pro/text-to-video",
    label: "Seedance 1.0 Pro",
    description: "High quality video generation model developed by Bytedance",
    cost: "",
    category: "video",
    initialInput: {
      aspect_ratio: "16:9",
      resolution: "1080p",
      duration: "5",
      camera_fixed: false,
    },
  },
  {
    endpointId: "fal-ai/topaz/upscale/video",
    label: "Topaz Video Upscale",
    description:
      "Professional-grade video upscaling using Topaz technology. Enhance your videos with high-quality upscaling.",
    cost: "",
    category: "video",
    prompt: false,
    inputAsset: ["video"],
  },
];

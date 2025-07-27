const { bundle } = require('@remotion/bundler');
const { getCompositions, renderMedia } = require('@remotion/renderer');
const path = require('path');

// Test composition data
const testCompositionData = {
  project: {
    id: "test-project",
    title: "Test Project",
    aspectRatio: "16:9"
  },
  tracks: [
    {
      id: "test-track-1",
      type: "video",
      projectId: "test-project"
    },
    {
      id: "test-track-2", 
      type: "text",
      projectId: "test-project"
    }
  ],
  frames: {
    "test-track-1": [
      {
        id: "test-frame-1",
        trackId: "test-track-1",
        timestamp: 0,
        duration: 5000,
        data: { mediaId: "test-video" }
      }
    ],
    "test-track-2": [
      {
        id: "test-frame-2",
        trackId: "test-track-2", 
        timestamp: 0,
        duration: 5000,
        data: { mediaId: "test-text" }
      }
    ]
  },
  mediaItems: {
    "test-video": {
      id: "test-video",
      mediaType: "video",
      output: {
        video: {
          url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
        }
      }
    },
    "test-text": {
      id: "test-text",
      mediaType: "text",
      input: {
        text: "Test Text",
        fontSize: 48,
        color: "white",
        backgroundColor: "red"
      }
    }
  }
};

async function testComposition() {
  try {
    console.log('Testing composition with data:', JSON.stringify(testCompositionData, null, 2));
    
    // Bundle the video composition
    const bundled = await bundle({
      entryPoint: path.join(process.cwd(), 'src/remotion-entry.js'),
      webpackOverride: (config) => {
        config.resolve.alias = {
          ...config.resolve.alias,
          '@': path.resolve(process.cwd(), 'src'),
        };
        return config;
      },
      ignoreRegisterRootWarning: true,
    });

    // Get the composition
    const compositions = await getCompositions(bundled);
    console.log('Available compositions:', compositions.map(c => c.id));

    const compositionToRender = compositions.find((c) => c.id === 'test-composition');
    if (!compositionToRender) {
      throw new Error('Composition "test-composition" not found');
    }

    console.log('Found composition:', compositionToRender.id);
    console.log('Duration:', compositionToRender.durationInFrames);
    console.log('Width:', compositionToRender.width);
    console.log('Height:', compositionToRender.height);

    // Render a short test video
    const outputPath = path.join(process.cwd(), 'test-output.mp4');
    
    console.log('Rendering test video...');
    await renderMedia({
      composition: compositionToRender,
      serveUrl: bundled,
      codec: 'h264',
      outputLocation: outputPath,
      inputProps: {
        compositionData: testCompositionData,
      },
    });

    console.log('Test video rendered successfully:', outputPath);
    
  } catch (error) {
    console.error('Error in test:', error);
    process.exit(1);
  }
}

testComposition(); 
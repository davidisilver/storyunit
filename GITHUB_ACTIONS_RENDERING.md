# GitHub Actions Video Rendering

This project uses GitHub Actions to render videos with text overlays using Remotion in a proper Node.js environment.

## 🎬 How It Works

1. **Local Development**: Create your video composition with text tracks in the browser
2. **Export Data**: Export your composition data using the provided script
3. **GitHub Actions**: Trigger a workflow that renders the complete video with text overlays
4. **Download**: Get your rendered video from the Actions artifacts

## 🚀 Quick Start

### Step 1: Create Your Video
1. Open the application at `http://localhost:3001`
2. Create a project and add video/audio content
3. Add text tracks using the "Text" button in the right panel
4. Arrange everything on the timeline

### Step 2: Export Composition Data
```bash
# Export your composition data
node scripts/export-composition.js <your-project-id>
```

This will create a `composition-<project-id>.json` file with all your project data.

### Step 3: Render with GitHub Actions
1. Go to the **Actions** tab in this repository
2. Click on **"Render Video"** workflow
3. Click **"Run workflow"**
4. Enter your project ID and paste the composition data
5. Click **"Run workflow"**

### Step 4: Download Your Video
1. Wait for the workflow to complete (usually 2-5 minutes)
2. Click on the completed workflow run
3. Scroll down to **"Artifacts"**
4. Download the `rendered-video` artifact

## 🔧 Setup Requirements

### Environment Variables
Add these to your `.env.local` file:
```bash
GITHUB_TOKEN=your_github_personal_access_token
GITHUB_REPOSITORY=your-username/storyunit-main
```

### GitHub Token Setup
1. Go to GitHub Settings → Developer settings → Personal access tokens
2. Create a new token with `repo` permissions
3. Add the token to your environment variables

## 📝 Features

- ✅ **Text Overlays**: Full support for text tracks with styling
- ✅ **All Media Types**: Video, audio, images, and text
- ✅ **High Quality**: 1080p rendering with H.264 codec
- ✅ **Proper Timing**: Accurate frame timing and synchronization
- ✅ **Cloud Rendering**: No local resource usage

## 🎯 Benefits

- **No IndexedDB Issues**: Runs in proper Node.js environment
- **Full Remotion Support**: All Remotion features work correctly
- **Text Overlays**: Complete text rendering with fonts, colors, positioning
- **Scalable**: Can handle complex compositions
- **Reliable**: GitHub Actions provides stable rendering environment

## 🔍 Troubleshooting

### Workflow Fails
- Check that your composition data is valid JSON
- Ensure all media URLs are accessible
- Verify project ID exists

### No Text in Output
- Make sure text tracks are properly configured
- Check that text content is not empty
- Verify font files are accessible

### Slow Rendering
- Complex compositions take longer
- GitHub Actions has resource limits
- Consider breaking large projects into smaller parts

## 📊 Example Workflow

```bash
# 1. Create a project with text
# 2. Export the data
node scripts/export-composition.js abc123

# 3. Copy the generated JSON
cat composition-abc123.json

# 4. Use in GitHub Actions
# - Go to Actions tab
# - Run "Render Video" workflow
# - Enter project ID: abc123
# - Paste the JSON data
# - Download the video
```

## 🎨 Text Track Features

The GitHub Actions renderer supports all text track features:
- **Font Family**: Arial, Helvetica, Times New Roman, etc.
- **Font Size**: Customizable from 12px to 200px
- **Colors**: Any CSS color value
- **Background**: Semi-transparent backgrounds
- **Positioning**: Top, center, bottom positioning
- **Alignment**: Left, center, right text alignment

## 🔄 Future Improvements

- [ ] Automatic workflow triggering from the UI
- [ ] Real-time rendering progress updates
- [ ] Multiple output formats (MP4, WebM, GIF)
- [ ] Custom resolution options
- [ ] Batch rendering for multiple projects 
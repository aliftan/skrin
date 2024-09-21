# Skrin

Skrin is an advanced screen recording application built with Electron, offering a user-friendly interface and powerful features for capturing and editing screen content.

## Features

- Screen recording with audio capture
- Mouse tracking and zoom effect during playback
- User-friendly interface built with Bootstrap
- Cross-platform compatibility (Windows, macOS, Linux)

## Prerequisites

Before you begin, ensure you have met the following requirements:

- Node.js (v14.0.0 or later)
- npm (v6.0.0 or later)

## Installing Skrin

To install Skrin, follow these steps:

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/skrin.git
   ```
2. Navigate to the project directory:
   ```
   cd skrin
   ```
3. Install the dependencies:
   ```
   npm install
   ```

## Using Skrin

To use Skrin, follow these steps:

1. Start the application:
   ```
   npm start
   ```
2. Click the "Start Recording" button to begin capturing your screen.
3. Click the "Stop Recording" button when you're done.
4. Your recording will automatically play back with the zoom effect applied.

## Development Roadmap

1. Enhance Recording Features
   - Add option to select specific window or application for recording
   - Implement audio source selection (system audio, microphone, or both)
   - Add recording time limit option

2. Improve Video Playback
   - Implement video trimming functionality
   - Add speed control for playback (0.5x, 1x, 1.5x, 2x)
   - Implement frame-by-frame navigation

3. Expand Zoom Effect Capabilities
   - Allow user to adjust zoom level
   - Add option to toggle zoom effect on/off
   - Implement smooth transitions for zoom effect

4. File Management
   - Add ability to save recordings to user-specified locations
   - Implement a simple file browser for saved recordings
   - Add option to export recordings in different formats (MP4, GIF)

5. User Interface Improvements
   - Create a settings page for user preferences
   - Implement dark mode toggle
   - Add tooltips and help text for better user guidance

6. Performance Optimizations
   - Optimize video encoding for smaller file sizes
   - Implement efficient handling of long recordings

7. Keyboard Shortcuts
   - Add customizable keyboard shortcuts for main actions

8. Annotation Features
   - Implement basic drawing tools for video annotation
   - Add text overlay capability

9. Automatic Updates
   - Implement an auto-update system for the application

10. Analytics and Error Reporting
    - Add anonymous usage analytics (opt-in)
    - Implement error logging and reporting system

11. Localization
    - Prepare the app for internationalization
    - Implement multi-language support

12. Advanced Effects
    - Add more video effects (e.g., highlight clicks, keypress visualization)
    - Implement chroma key (green screen) effect for webcam overlay

13. Collaboration Features
    - Add ability to generate shareable links for recordings
    - Implement basic commenting system on shared recordings

## Contributing to Skrin

To contribute to Skrin, follow these steps:

1. Fork this repository.
2. Create a branch: `git checkout -b <branch_name>`.
3. Make your changes and commit them: `git commit -m '<commit_message>'`
4. Push to the original branch: `git push origin <project_name>/<location>`
5. Create the pull request.

Alternatively, see the GitHub documentation on [creating a pull request](https://help.github.com/en/github/collaborating-with-issues-and-pull-requests/creating-a-pull-request).

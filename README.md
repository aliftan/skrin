# Skrin

Skrin is an advanced screen recording application built with Electron, offering a user-friendly interface and powerful features for capturing screen content.

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
   git clone https://github.com/aliftan/skrin.git
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
Bugs
- fileManager: 
   generateFilename not works correctly

Enhance Recording Features
- Add option to select specific window or application for recording
- Implement audio source selection (system audio, microphone, or both)
- Add recording time limit option

Expand Zoom Effect Capabilities
- Allow user to adjust zoom level
- Add option to toggle zoom effect on/off
- Implement smooth transitions for zoom effect

File Management
- Add ability to save recordings to user-specified locations
- Implement a simple file browser for saved recordings
- Add option to export recordings in different formats (MP4, GIF)

User Interface Improvements
- App icon

Performance Optimizations
- Optimize video encoding for smaller file sizes
- Implement efficient handling of long recordings

Advanced Effects 
- Add more video effects (e.g., highlight clicks, keypress visualization) 
- Implement chroma key (green screen) effect for webcam overlay

## Contributing to Skrin

To contribute to Skrin, follow these steps:

1. Fork this repository.
2. Create a branch: `git checkout -b <branch_name>`.
3. Make your changes and commit them: `git commit -m '<commit_message>'`
4. Push to the original branch: `git push origin <project_name>/<location>`
5. Create the pull request.

Alternatively, see the GitHub documentation on [creating a pull request](https://help.github.com/en/github/collaborating-with-issues-and-pull-requests/creating-a-pull-request).

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


## Bugs

- cursorHighlight: 
   cursor highlight not working properly
   cursor location is not updated correctly

## Development Roadmap

User Interface Improvements
- Migrate to Tailwind
- App icon

Enhance Recording Features
- Implement webcam overlay
   custom position: top right, top left, bottom left, bottom right
- Able to choose cursor highlighter color
- Magnify effect config
   Implement smooth transitions for zoom effect

File Management
- Add option to export recordings in different formats (MP4, GIF)

Performance Optimizations
- Optimize video encoding for smaller file sizes
- Implement efficient handling of long recordings

Advanced Effects 
- Add more video effects (e.g., highlight clicks, keypress visualization) 

## Using Skrin

To use Skrin, follow these steps:

1. Start the application:
   ```
   npm start
   ```
2. Click the "Start Recording" button to begin capturing your screen.
3. Click the "Stop Recording" button when you're done.
4. Your recording will automatically play back with the zoom effect applied.

// pages/api/media.js
import fs from 'fs';
import path from 'path';

export default function handler(req, res) {
  const imageDirectory = path.join(process.cwd(), 'public', 'memes', 'images');
  const videoDirectory = path.join(process.cwd(), 'public', 'memes', 'videos');

  try {
    const imageFiles = fs.readdirSync(imageDirectory).map(file => `/memes/images/${file}`);
    const videoFiles = fs.readdirSync(videoDirectory)
      .filter(file => file.endsWith('.mp4') || file.endsWith('.MP4') || file.endsWith('.MOV') )
      .map(file => `/memes/videos/${file}`);

    res.status(200).json({ imageFiles, videoFiles });
  } catch (error) {
    res.status(500).json({ error: "Failed to read memes directories" });
  }
}

require("dotenv").config();
const express = require("express");
const cors = require("cors");
const yt_dlp = require("yt-dlp-exec");
const ffmpeg = require("fluent-ffmpeg");
const fs = require("fs");
const path = require("path");

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 8080;
const DOWNLOAD_FOLDER = "/tmp"; // Utilisé sur Render

app.get("/convert", async (req, res) => {
  try {
    const videoUrl = req.query.url;
    if (!videoUrl) return res.status(400).send("❌ Aucun lien fourni !");

    // Télécharger l'audio
    const outputFile = path.join(DOWNLOAD_FOLDER, "audio.webm");
    await yt_dlp(videoUrl, {
      output: outputFile,
      format: "bestaudio",
    });

    // Convertir en MP3
    const mp3File = path.join(DOWNLOAD_FOLDER, "converted.mp3");
    ffmpeg(outputFile)
      .audioCodec("libmp3lame")
      .audioBitrate("192k")
      .save(mp3File)
      .on("end", () => {
        res.download(mp3File, "audio.mp3", () => {
          fs.unlinkSync(outputFile);
          fs.unlinkSync(mp3File);
        });
      });
  } catch (error) {
    console.error("❌ Erreur :", error);
    res.status(500).send("Erreur interne !");
  }
});

app.listen(PORT, () =>
  console.log(`✅ Serveur actif sur http://localhost:${PORT}`)
);

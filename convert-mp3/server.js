const express = require("express");
const fs = require("fs");
const path = require("path");
const yt_dlp = require("yt-dlp");
const app = express();
const port = 3000;

app.use(express.json());

// Fonction pour télécharger et convertir la vidéo en MP3
const downloadAndConvert = async (videoLink, outputPath) => {
  const ydl_opts = {
    format: "bestaudio/best", // Télécharger uniquement l'audio
    outtmpl: outputPath, // Chemin du fichier de sortie
  };

  return new Promise((resolve, reject) => {
    yt_dlp.exec([videoLink], ydl_opts, (err, output) => {
      if (err) {
        reject(err);
      } else {
        resolve(output);
      }
    });
  });
};

// Endpoint pour démarrer la conversion
app.post("/convert", async (req, res) => {
  const { videoLink, format } = req.body;

  if (!videoLink || format !== "mp3") {
    return res.status(400).json({ error: "Lien vidéo ou format invalide." });
  }

  // Définir le nom du fichier de sortie
  const videoTitle = videoLink.split("/").pop(); // Simple exemple, peut être amélioré
  const mp3FilePath = path.join(__dirname, "downloads", `${videoTitle}.mp3`);

  try {
    // Télécharger et convertir la vidéo
    await downloadAndConvert(videoLink, mp3FilePath);

    // Envoyer le fichier MP3 au client
    res.download(mp3FilePath, (err) => {
      if (err) {
        console.error("Erreur lors de l'envoi du fichier:", err);
      } else {
        // Supprimer le fichier après qu'il a été téléchargé
        fs.unlink(mp3FilePath, (err) => {
          if (err) {
            console.error("Erreur lors de la suppression du fichier:", err);
          } else {
            console.log("Fichier supprimé après téléchargement.");
          }
        });
      }
    });
  } catch (error) {
    console.error("Erreur lors de la conversion:", error);
    res.status(500).json({ error: "Erreur lors de la conversion." });
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

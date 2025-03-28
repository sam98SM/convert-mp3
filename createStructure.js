const fs = require("fs");
const path = require("path");

// Définir l'arborescence du projet
const structure = {
  "convert-mp3": {
    "server.js": "",
    "package.json": `{
  "name": "convert-mp3",
  "version": "1.0.0",
  "main": "server.js",
  "scripts": {
    "start": "node server.js"
  },
  "dependencies": {
    "express": "^4.18.2",
    "cors": "^2.8.5",
    "dotenv": "^16.0.3",
    "yt-dlp-exec": "^1.1.2",
    "fluent-ffmpeg": "^2.1.2"
  }
}`,
    ".gitignore": "node_modules/\n.env\n/tmp/",
    "README.md":
      "# Convert MP3\n\nService de conversion de vidéos YouTube en MP3.",
  },
};

// Fonction pour créer l'arborescence des dossiers et fichiers
function createStructure(basePath, structure) {
  for (const [key, value] of Object.entries(structure)) {
    const currentPath = path.join(basePath, key);

    if (typeof value === "object") {
      // Si c'est un objet, c'est un dossier, donc on crée le dossier
      fs.mkdirSync(currentPath, { recursive: true });
      // Appel récursif pour les sous-dossiers
      createStructure(currentPath, value);
    } else {
      // Si c'est une chaîne de caractères, c'est un fichier
      fs.writeFileSync(currentPath, value);
    }
  }
}

// Crée l'arborescence dans le dossier actuel
createStructure(__dirname, structure);
console.log("✅ Arborescence créée avec succès !");

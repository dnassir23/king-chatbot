const express = require("express");
const cors = require("cors");
const fetch = require("node-fetch").default;

const app = express();
app.use(express.json());
app.use(cors());

// Servir les fichiers statiques (index.html, style.css, etc.)
app.use(express.static("public"));

// On lit la clé Cohere depuis les variables d'environnement
const COHERE_API_KEY = process.env.COHERE_API_KEY;

// Render fournit un port automatiquement, sinon on garde 3000 en local
const PORT = process.env.PORT || 3000;

app.post("/api/chat", async (req, res) => {
  const userMessage = req.body.message;

  try {
    const response = await fetch("https://api.cohere.ai/v1/chat", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${COHERE_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "command-a-03-2025", // modèle actif
        message: userMessage
      })
    });

    const data = await response.json();
    console.log("Réponse Cohere brute :", data);

    if (data.text) {
      res.json({ reply: data.text });
    } else {
      res.status(500).json({ reply: "Réponse vide de Cohere." });
    }
  } catch (error) {
    console.error("Erreur Cohere :", error);
    res.status(500).json({ reply: "Erreur de connexion à Cohere." });
  }
});

// Endpoint de santé pour Render
app.get("/health", (_, res) => res.send("OK"));

app.listen(PORT, () => {
  console.log(`✅ Serveur lancé sur http://localhost:${PORT}`);
});

import express from "express";
import fetch from "node-fetch";
import dotenv from "dotenv";

dotenv.config();
const router = express.Router();

const apiKey = process.env.GEMINI_API_KEY;
const MODEL = "gemini-2.5-flash";

router.post("/generate", async (req, res) => {
    const { ingredients } = req.body;

    if (!ingredients) {
        return res.status(400).json({ error: "Aucun ingrédient fourni." });
    }

    try {
        const url = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${apiKey}`;
        const prompt = `Propose une recette originale à partir de ces ingrédients : ${ingredients.join(", ")}. 
    Donne le titre, les étapes et un ton convivial.`;

        const response = await fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                contents: [{ parts: [{ text: prompt }] }]
            })
        });

        const data = await response.json();
        const output = data.candidates?.[0]?.content?.parts?.[0]?.text ?? "Aucune recette générée.";

        res.json({ result: output });
    } catch (err) {
        console.error("Erreur Gemini :", err);
        res.status(500).json({ error: "Erreur lors de la génération." });
    }
});

export default router;

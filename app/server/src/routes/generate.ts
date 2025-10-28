import express from "express";
import fetch from "node-fetch";
import dotenv from "dotenv";

dotenv.config();
const router = express.Router();

const apiKey = process.env.GEMINI_API_KEY;
const MODEL = "gemini-2.5-flash";

router.post("/generate", async (req, res) => {
    const {ingredients} = req.body;

    if (!ingredients) {
        return res.status(400).json({error: "Aucun ingrédient fourni."});
    }

    try {
        const url = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${apiKey}`;
        const prompt = `Tu es un chef cuisinier créatif et précis.
         À partir des ingrédients suivants : ${ingredients.join(", ")},
    génère **10 recettes différentes**, en respectant les règles suivantes :
    - Les **5 premières recettes** doivent utiliser **strictement** ces ingrédients, en plus d'ingrédients courrants (sel, poivre, huile, beurre, margarine, épices, eau).
    - Les **5 dernières recettes** peuvent inclure d’autres ingrédients complémentaires, mais doivent garder les ingrédients fournis comme base.
    - Chaque recette doit être clairement distincte (type de plat, saveur, cuisson, culture, etc.).
    
    Formate ta réponse en **Json valide** avec la structure suivante :
    {
    "recipes": [
    {
        "title": "Titre de la recette",
        "ingredients": [
            {"name" : "nom de l'ingrédients, "quantity": "valeur + unité"},
            ...
        ],
        "instructions": [
            "Étape 1 ...",
            "Étape 2 ...",
            ...
        ]
    },
    ...
    ]
    }
    N'invente pas de recettes, et assure-toi que les quantités et instructions soient réalistes et précises.`;

        const response = await fetch(url, {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({
                contents: [{parts: [{text: prompt}]}]
            })
        });

        const data = (await response.json()) as any;
        let output = data.candidates?.[0]?.content?.parts?.[0]?.text ?? "Aucune recette générée.";

        output = output.replace(/```json|```/g, '').trim();

        const firstBraceIndex = output.indexOf('{');
        if (firstBraceIndex > 0) {
            output = output.substring(firstBraceIndex);
        }

        let recepiesJson;
        try {
            recepiesJson = JSON.parse(output);
        } catch (err) {
            console.error("Erreur de parsing", err);
            recepiesJson = {error: "Format JSON invalide", raw: output};
        }

        res.json(recepiesJson);
    } catch (err) {
        console.error("Erreur Gemini :", err);
        res.status(500).json({error: "Erreur lors de la génération."});
    }
});

export default router;

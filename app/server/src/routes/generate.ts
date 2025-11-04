import express from "express";
import fetch from "node-fetch";
import dotenv from "dotenv";

dotenv.config();
const router = express.Router();

const apiKey = process.env.GEMINI_API_KEY;
const MODEL = "gemini-2.5-flash";

async function callGemini(prompt: string) {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${apiKey}`;
    const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
        }),
    });
    const data = await response.json();
    let output = data.candidates?.[0]?.content?.parts?.[0]?.text ?? "{}";
    output = output.replace(/```json|```/g, "").trim();
    const firstBrace = output.indexOf("{");
    if (firstBrace > 0) output = output.substring(firstBrace);
    try {
        return JSON.parse(output);
    } catch (err) {
        console.error("Erreur parsing Gemini:", err);
        return { error: "Format JSON invalide", raw: output };
    }
}

router.post("/generate", async (req, res) => {
    const { ingredients } = req.body;

    if (!ingredients || ingredients.length === 0) {
        return res.status(400).json({ error: "Aucun ingrédient fourni." });
    }

    try {
        const checkPrompt = `
Tu es un expert en sécurité alimentaire.
Classe chacun de ces ingrédients dans la bonne catégorie selon s'ils sont comestibles ou non.
Ne fais aucune interprétation (ex: "terre" ≠ "betterave", "verre" ≠ "nouilles de verre").

Ingrédients : ${ingredients.join(", ")}

Réponds en JSON strict :
{
  "validIngredients": ["ingrédient comestible 1", "ingrédient comestible 2", ...],
  "invalidIngredients": ["ingrédient non comestible 1", ...]
}`;

        const checkResult = await callGemini(checkPrompt);
        const validIngredients = checkResult.validIngredients || [];
        const invalidIngredients = checkResult.invalidIngredients || [];

        if (validIngredients.length === 0) {
            return res.json({
                recipes: [],
                excludedIngredients: invalidIngredients,
                message:
                    "Aucun ingrédient comestible détecté. Veuillez corriger votre saisie.",
            });
        }

        const recipePrompt = `
Tu es un chef cuisinier créatif et réaliste.
N'utilise jamais d'ingrédients non comestibles ni ambigus.
Assure-toi que toutes les recettes respectent les règles de sécurité alimentaire de la MAPAQ.

À partir des ingrédients suivants : ${validIngredients.join(", ")},
génère **6 recettes différentes**, selon ces règles :

- Les 3 premières recettes doivent utiliser **strictement** ces ingrédients + ingrédients courants (sel, poivre, huile, beurre, margarine, épices, eau).
- Les 3 dernières recettes peuvent inclure d'autres ingrédients complémentaires, mais doivent garder les ingrédients de base.
- Ne crée aucune recette fictive ou absurde.
- Les quantités et instructions doivent être réalistes et précises.

Formate toujours la réponse en **JSON valide** :
{
  "recipes": [
    {
      "title": "Titre de la recette",
      "ingredients": [
        {"name": "nom de l'ingrédient", "quantity": "valeur + unité"}
      ],
      "instructions": [
        "Étape 1 ...",
        "Étape 2 ..."
      ]
    }
  ]
}`;

        const recipeResult = await callGemini(recipePrompt);

        res.json({
            ...recipeResult,
            excludedIngredients: invalidIngredients,
        });
    } catch (err) {
        console.error("Erreur Gemini :", err);
        res.status(500).json({ error: "Erreur lors de la génération." });
    }
});

export default router;

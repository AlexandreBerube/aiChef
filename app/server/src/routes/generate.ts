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
À partir des ingrédients suivants : ${validIngredients.join(", ")},
génère deux listes distinctes de recettes, selon ces règles :

1️⃣ **exclusiveRecipes** :
- Utilisent STRICTEMENT ces ingrédients de base.
- Tu peux ajouter seulement des ingrédients universels (sel, poivre, huile, beurre, margarine, épices, eau).
- Doivent être 3 recettes réalistes, complètes, avec quantités et étapes précises.

2️⃣ **extendedRecipes** :
- Incluent les ingrédients de base, mais peuvent aussi ajouter des ingrédients complémentaires (ex: légumes, protéines, etc.).
- Doivent aussi être 3 recettes réalistes, équilibrées et comestibles.

Réponds en **JSON valide** strictement au format suivant :
{
  "exclusiveRecipes": [
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
  ],
  "extendedRecipes": [
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

        // Étape 3 : Réponse finale
        res.json({
            exclusiveRecipes: recipeResult.exclusiveRecipes || [],
            extendedRecipes: recipeResult.extendedRecipes || [],
            excludedIngredients: invalidIngredients,
        });
    } catch (err) {
        console.error("Erreur Gemini :", err);
        res.status(500).json({ error: "Erreur lors de la génération." });
    }
});

export default router;

import fetch from "node-fetch";
import dotenv from "dotenv";

dotenv.config();

const apiKey = process.env.GEMINI_API_KEY;

// choisis le modèle que tu veux tester
const model = "gemini-2.5-flash"; // ou "gemini-flash-latest" / "gemini-pro-latest"

async function main() {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

    const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            contents: [
                {
                    parts: [
                        {
                            text: "Explique comment fonctionne l'intelligence artificielle en quelques mots."
                        }
                    ]
                }
            ]
        })
    });

    const data = await response.json();
    console.log("✅ Réponse Gemini :", data.candidates?.[0]?.content?.parts?.[0]?.text ?? data);
}

main().catch(console.error);

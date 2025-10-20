import fetch from "node-fetch";
import dotenv from "dotenv";

dotenv.config();

const apiKey = process.env.GEMINI_API_KEY;

async function listModels() {
    const endpoints = [
        "https://generativelanguage.googleapis.com/v1beta/models",
        "https://api.google.dev/v1beta/models"
    ];

    for (const baseUrl of endpoints) {
        console.log(`\n🔎 Test de : ${baseUrl}`);

        try {
            const res = await fetch(`${baseUrl}?key=${apiKey}`);
            const data = await res.json();

            if (res.ok) {
                console.log(`✅ Succès — ${data.models?.length ?? 0} modèles trouvés :`);
                for (const m of data.models ?? []) {
                    console.log("  -", m.name);
                }
            } else {
                console.log("❌ Erreur :", data.error?.message ?? data);
            }
        } catch (err) {
            console.error("⚠️ Exception :", err);
        }
    }
}

listModels();

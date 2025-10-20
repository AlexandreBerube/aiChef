export async function generateRecipe(ingredients: string[]): Promise<string> {
    const response = await fetch("http://localhost:3000/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ingredients })
    });

    if (!response.ok) {
        throw new Error("Erreur serveur");
    }

    const data = await response.json();
    return data.result;
}

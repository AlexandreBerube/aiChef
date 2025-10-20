import { useState } from "react";
import { generateRecipe } from "@/lib/api.ts";

export function Generate() {
    const [ingredients, setIngredients] = useState("");
    const [result, setResult] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const list = ingredients.split(",").map(i => i.trim());
        const output = await generateRecipe(list);
        setResult(output);
    };

    return (
        <div className="p-6">
        <h1 className="text-xl mb-4">👨‍🍳 Générateur de recettes IA</h1>
    <form onSubmit={handleSubmit}>
    <input
        type="text"
    placeholder="Entrez vos ingrédients (ex: tomates, ail, pâtes)"
    value={ingredients}
    onChange={e => setIngredients(e.target.value)}
    className="border p-2 w-full mb-3"
    />
    <button className="bg-blue-500 text-white p-2 rounded">Générer</button>
        </form>

    {result && (
        <div className="mt-4 bg-gray-100 p-3 rounded">
        <h2 className="font-semibold mb-2">🍝 Résultat :</h2>
    <p>{result}</p>
    </div>
    )}
    </div>
);
}

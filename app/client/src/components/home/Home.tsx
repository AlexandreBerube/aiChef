import {useState} from "react";
import "@/styles/style.css";
import fouet from "@/assets/fouet.svg";
import swedishChef from "@/assets/swedishChef.gif";
import RecipeCards from "@/components/cards/RecipeCards.tsx";
import type {CarouselItem} from "@/components/cards/RecipeCards"; // ✅ nouveau chemin

export function Home() {
    const [query, setQuery] = useState("");
    const [loading, setLoading] = useState(false);

    const [exclusiveRecipes, setExclusiveRecipes] = useState<CarouselItem[]>([]);
    const [extendedRecipes, setExtendedRecipes] = useState<CarouselItem[]>([]);
    const [showResults, setShowResults] = useState(false);

    const [selectedRecipe, setSelectedRecipe] = useState<CarouselItem | null>(null);
    const [nonEdible, setNonEdible] = useState<string[]>([]);


    async function handleSearch(e: React.FormEvent) {
        e.preventDefault();
        setShowResults(false);
        setLoading(true);

        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/generate`, {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({ingredients: query.split(",")})
            });

            const llmData = await response.json();
            setNonEdible(llmData.excludedIngredients ?? []);


            // ✅ convertit exclusiveRecipes en CarouselItem[]
            const exclusiveMapped = llmData.exclusiveRecipes?.map(
                (recipe: any, index: number) => ({
                    id: `exclusive-${index}`,
                    title: recipe.title,
                    preview: recipe.ingredients
                        .map((i: { quantity: string; name: string }) => `• ${i.quantity} ${i.name}`)
                        .join("\n"),
                    description: recipe.instructions
                        .map((step: string) => `• ${step}`)
                        .join("\n\n"),
                })
            ) ?? [];

            // ✅ convertit extendedRecipes en CarouselItem[]
            const extendedMapped = llmData.extendedRecipes?.map(
                (recipe: any, index: number) => ({
                    id: `extended-${index}`,
                    title: recipe.title,
                    preview: recipe.ingredients
                        .map((i: { quantity: string; name: string }) => `• ${i.quantity} ${i.name}`)
                        .join("\n"),
                    description: recipe.instructions
                        .map((step: string) => `• ${step}`)
                        .join("\n\n"),
                })
            ) ?? [];

            setExclusiveRecipes(exclusiveMapped);
            setExtendedRecipes(extendedMapped);
        } catch (err) {
            console.error("Erreur API:", err);
        } finally {
            setLoading(false);
            setShowResults(true);
        }
    }

    console.log("Non-edible ingredients:", nonEdible);
    const nonEdibleIngredients = nonEdible.join(", ");

    return (
        <div className="home-grid w-full">
            {/* zone supérieure : carrousel (apparait après clic) */}
            <div className="carousel-area overflow-auto">
                {loading && (
                    <div className="loader-container">
                        <div className="loader"></div>
                        <p className="loader-text text-black"><span><img src={swedishChef}/></span></p>
                    </div>
                )}

                {showResults && (
                    <div className="grid w-full grid-rows-2 gap-12 px-4 py-8">
                        <RecipeCards title="Recettes avec vos ingrédients" items={exclusiveRecipes}
                                     onSelect={(item) => setSelectedRecipe(item)}/>
                        <RecipeCards title="Recettes avec ingrédients complémentaires" items={extendedRecipes}
                                     onSelect={(item) => setSelectedRecipe(item)}/>
                        {nonEdible.length > 0 && (
                            <div className="home-nonEdible-div">
                                <h2 className="text-2xl font-semibold underline underline-offset-4 decoration-2 decoration-white mb-4">
                                    Ingrédients non comestibles détectés :  {nonEdibleIngredients}
                                </h2>
                            </div>
                        )}


                    </div>
                )}
            </div>

            <div className="flex flex-col align-items-center justify-center w-full">
                <h1 className="search-title">
                    Quels ingrédients avez-vous sous la main aujourd’hui ?
                </h1>
                <form onSubmit={handleSearch} className="search-row">
                    <div className="search-pill"> {/* search-container */}
                        <label className="" htmlFor="search-input">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"
                                 fill="none" stroke="var(--secondary)" strokeWidth={1.5}
                                 aria-hidden="true">
                                <path strokeLinecap="round" strokeLinejoin="round"
                                      d="M21 21l-4.35-4.35m1.35-5.65A7.5 7.5 0 1110.5 3a7.5 7.5 0 017.5 7.5z"/>
                            </svg>
                        </label>
                        <input
                            id="search-input"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder="oeuf, beurre, chocolat…"
                            className="search-input"
                        />
                    </div>
                    <button
                        type="submit"
                        className="search-btn"
                        aria-label="Rechercher"
                        disabled={loading}
                        onClick={() => setShowResults(true)}
                    >
                        <img src={fouet} alt="fouet" className="search-btn_img"/>
                    </button>
                </form>
            </div>
            {selectedRecipe && (
                <div className="modal-overlay" onClick={() => setSelectedRecipe(null)}>
                    <div
                        className="modal-card"
                        onClick={(e) => e.stopPropagation()}  // ❗ Empêche le clic à l'intérieur de fermer
                    >
                        <h2 className="home-h2">
                            {selectedRecipe.title}
                        </h2>

                        <h3>Ingrédients</h3>
                        <p className="modal-text">{selectedRecipe.preview}</p>

                        <h3>Instructions</h3>
                        <p className="modal-text">{selectedRecipe.description}</p>
                    </div>
                </div>
            )}

        </div>
    );
}

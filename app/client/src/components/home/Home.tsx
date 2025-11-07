import {useState} from "react";
import "@/styles/style.css";
import fouet from "@/assets/fouet.svg";
import {Carousel, type CarouselItem} from "@/components/carousel/Carousel.tsx"
import swedishChef from "@/assets/swedishChef.gif";

export function Home() {
    const [query, setQuery] = useState("");
    const [loading, setLoading] = useState(false);
    const [results, setResults] = useState<CarouselItem[]>([]);
    const [showCarousel, setShowCarousel] = useState(false);

    async function handleSearch(e: React.FormEvent) {
        e.preventDefault();
        setShowCarousel(false);
        setLoading(true);

        try {
            const response = await fetch("http://192.168.0.25:3000/api/generate", {

                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({ingredients: query.split(",")})
            });

            const llmData = await response.json();

            // ✅ Adaptation du JSON à CarouselItem[]
            const mapped = llmData.recipes.map((recipe: any, index: number) => ({
                id: index,
                title: recipe.title,
                tag: "RECETTE",
                preview: recipe.ingredients
                    .map((i: any) => `• ${i.quantity} ${i.name}`)
                    .join("\n"),
                description: recipe.instructions
                    .map((step: string, i: number) => `• ${step}`)
                    .join("\n"),
                location: undefined,
                time: undefined,
                imageUrl: undefined,
            }));

            setResults(mapped);
        } catch (err) {
            console.error("Erreur API:", err);
        } finally {
            setLoading(false);
            setShowCarousel(true);
        }
    }

    const theme = {
        primary: "#6b46c1",
        secondary: "#22d3ee",
        accent: "#f472b6",
        background: "#0b0b14",
        textPrimary: "#ffffff",
        textSecondary: "#c7d2fe",
    };

    return (
        <main className="home-root">
            {/* zone supérieure : carrousel (apparait après clic) */}
            <div className="carousel-area">
                {loading && (
                    <div className="loader-container">
                        <div className="loader"></div>
                        <p className="loader-text text-black"><span><img src={swedishChef}/></span></p>
                    </div>
                )}

                {!loading && showCarousel && <Carousel items={results} theme={theme}/>}
            </div>

            <div className="flex flex-col items-center mt-8 mb-16 px-4">
                <h1 className="search-title">Quels ingrédients avez-vous sous la main aujourd’hui ?</h1>
            </div>

            {/* pill fixé en bas de la page */}
            <div className="search-fixed">
                <form onSubmit={handleSearch}>
                    <div className="search-container">
                        <label className="search-pill" htmlFor="search-input">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"
                                 fill="none" stroke="currentColor" strokeWidth={1.5}
                                 aria-hidden="true" className="">
                                <path strokeLinecap="round" strokeLinejoin="round"
                                      d="M21 21l-4.35-4.35m1.35-5.65A7.5 7.5 0 1110.5 3a7.5 7.5 0 017.5 7.5z"/>
                            </svg>
                            <input
                                id="search-input"
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                placeholder="oeuf, beurre, chocolat…"
                                className="search-input"
                            />
                        </label>

                        <button
                            type="submit"
                            className="search-btn"
                            aria-label="Rechercher"
                            disabled={loading}
                            onClick={() => setShowCarousel(true)}
                        >
                            <img src={fouet} alt="fouet" className="search-btn_img"/>
                        </button>
                    </div>
                </form>
            </div>
        </main>
    );
}

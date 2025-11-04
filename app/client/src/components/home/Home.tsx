import {useState} from "react";
import "@/styles/style.css";
import fouet from "@/assets/fouet.svg";
import { Carousel, type CarouselItem } from "@/components/carousel/Carousel.tsx"

export function Home() {
    const [query, setQuery] = useState("");
    const [loading, setLoading] = useState(false);
    const [results, setResults] = useState<CarouselItem[]>([]);
    const [showCarousel, setShowCarousel] = useState(false);

    async function handleSearch(e: React.FormEvent) {
        e.preventDefault();
        setShowCarousel(true);
        setLoading(true);
        try {
            const fakeApi = await new Promise<CarouselItem[]>(resolve =>
                setTimeout(() => resolve([
                    { id: "r1", title: "Mousse au chocolat", tag: "DESSERT", preview: "Œufs, chocolat, beurre…", description: "Une mousse aérienne et riche en cacao.", location: "Difficulté: Facile", time: "Prépa: 15 min", imageUrl: "/images/mousse.jpg" },
                    { id: "r2", title: "Omelette beurre-noisette", tag: "RAPIDE", preview: "Œufs, beurre, sel…", description: "Omelette à texture baveuse et parfum noisette.", location: "Difficulté: Très facile", time: "Prépa: 7 min" },
                    { id: "r3", title: "Cookies chocolat", tag: "GOÛTER", preview: "Farine, beurre, chocolat…", description: "Extérieur crousti, intérieur moelleux.", location: "Difficulté: Facile", time: "Prépa: 20 min" },
                ]), 500)
            );
            const filtered = fakeApi.filter(x =>
                (x.title + " " + (x.preview ?? "")).toLowerCase().includes(query.toLowerCase())
            );
            setResults(filtered);
        } finally {
            setLoading(false);
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
                {showCarousel && <Carousel items={results} theme={theme} />}
            </div>

            {/* section principale — contient titre (fixé juste au-dessus du pill) */}
            <section className="search-section">
                {(
                    <h1 className="search-title">Quels ingrédients avez-vous sous la main aujourd’hui ?</h1>
                )}

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
            </section>
        </main>
    );
}

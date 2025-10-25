// `app/client/src/components/home/Home.tsx`
import {useState} from 'react';
import "@/styles/style.css";
import fouet from "@/assets/fouet.svg";

function Search(props: { className?: string }) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            className={props.className}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.5}
            aria-hidden="true"
        >
            <path strokeLinecap="round" strokeLinejoin="round"
                  d="M21 21l-4.35-4.35m1.35-5.65A7.5 7.5 0 1110.5 3a7.5 7.5 0 017.5 7.5z"/>
        </svg>
    );
}

export function Home() {
    const [query, setQuery] = useState('');

    return (
        <main>
            <section>
                <h1>Quels ingrédients avez-vous sous la main aujourd’hui ?</h1>

                <form>
                    <div className="search-container">
                        <label className="search-pill" htmlFor="search-input">
                            <Search className=""/>
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
                        >
                            <img src={fouet} alt="fouet" className="search-btn_img"/>
                        </button>
                    </div>
                </form>

                <div className="results-card">
                    <p className="results-text">Résultats</p>
                </div>
            </section>
        </main>
    );
}
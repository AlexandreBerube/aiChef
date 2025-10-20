import  {useState} from 'react';
import "@/styles/style.css";

export function Home() {
    const [query, setQuery] = useState('');

    return (
        <section className="max-w-5xl mx-auto px-4 pt-16 pb-8">
            <h1 className="text-3xl md:text-4xl font-semibold text-slate-800 text-center">
                Quels ingrédients avez-vous sous la main aujourd’hui ?
            </h1>

            {/* Barre de recherche arrondie */}
            <div className="mt-8 flex justify-center">
                <div className="w-full md:w-[860px]">
                    <div className="rounded-full bg-slate-300/60 shadow-md ring-1 ring-slate-300 px-6 py-4">
                        <input
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder="oeuf, beurre, chocolat…"
                            className="w-full bg-transparent outline-none text-slate-700 placeholder:text-slate-600/70"
                        />
                    </div>
                </div>
            </div>

            {/* Grille des blocs résultats */}
            <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Bloc gauche */}
                <div className="rounded-3xl bg-slate-400/80 ring-1 ring-slate-600/40 p-5 min-h-[220px]">
                    <div className="text-white/95 font-medium">Résultats</div>
                    {/* …map de tes cartes recette ici… */}
                </div>

                {/* Bloc droit */}
                <div className="rounded-3xl bg-slate-400/80 ring-1 ring-slate-600/40 p-5 min-h-[220px]">
                    {/* Tu peux utiliser ce panneau pour “Suggestions”, “Liste d’achats”, etc. */}
                </div>
            </div>
        </section>
    );
}



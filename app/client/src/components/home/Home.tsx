import {useState} from 'react';
import "@/styles/style.css";

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
        <main className="flex flex-col justify-center items-center min-h-screen bg-[#fef5e2]">
            <section className="w-full max-w-5xl flex flex-col items-center text-center">
                <h1 className="text-3xl md:text-5xl font-semibold text-slate-800 mb-10">
                    Quels ingrédients avez-vous sous la main aujourd’hui ?
                </h1>

               <form>
                <div className="w-full flex justify-center">
                    <label className="search-pill flex items-center px-6 py-3 mx-auto">
                        <Search className="text-slate-500 mr-3 w-5 h-5 shrink-0" />
                        <input
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder="oeuf, beurre, chocolat…"
                            className="search-input w-full bg-transparent outline-none text-slate-700"
                        />
                    </label>
                </div>
               </form>

                <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-8 w-full">
                    <div className="rounded-3xl bg-slate-400/80 ring-1 ring-slate-600/40 p-5 min-h-[220px]">
                        <div className="text-white/95 font-medium">Résultats</div>
                    </div>
                    <div className="rounded-3xl bg-slate-400/80 ring-1 ring-slate-600/40 p-5 min-h-[220px]" />
                </div>
            </section>
        </main>
    );
}
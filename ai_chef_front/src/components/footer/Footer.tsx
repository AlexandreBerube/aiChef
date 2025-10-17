import "@/styles/style.css";

export function Footer() {
    return (
        <footer className="mt-10">
            <div
                className="h-1 w-4/5 max-w-5xl mx-auto bg-gradient-to-r from-amber-300 via-orange-400 to-amber-300 rounded-full"/>
            <div className="max-w-6xl mx-auto px-4 py-6 text-sm text-slate-600">
                © {new Date().getFullYear()} AIchef — Alexandre et Laëtitia
            </div>
        </footer>
    );
}
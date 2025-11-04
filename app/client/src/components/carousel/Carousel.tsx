// app/client/src/components/home/Carousel3D.tsx
import {useEffect, useMemo, useRef, useState} from "react";

// Type générique pour tes résultats (adapte librement)
export type CarouselItem = {
    id: string | number;
    title: string;
    tag?: string;            // ex: "LANGUAGE: Python" ou une catégorie
    preview?: string;        // texte court face avant
    description?: string;    // texte long face arrière
    location?: string;
    time?: string;
    imageUrl?: string;       // si tu as une image; sinon on affiche juste le titre
};

type Theme = Partial<{
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    textPrimary: string;
    textSecondary: string;
}>;

export function Carousel({
                               items,
                               theme,
                           }: {
    items: CarouselItem[];
    theme?: Theme;
}) {
    const [theta, setTheta] = useState(0);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [radius, setRadius] = useState(300);
    const [flipped, setFlipped] = useState<Set<string | number>>(new Set());

    const containerRef = useRef<HTMLDivElement | null>(null);
    const carouselRef = useRef<HTMLDivElement | null>(null);
    const isDraggingRef = useRef(false);
    const startXRef = useRef(0);

    const total = Math.max(items.length, 1);
    const anglePerCard = useMemo(() => 360 / total, [total]);

    useEffect(() => {
        const el = containerRef.current;
        if (!el) return;

        const ro = new ResizeObserver(([entry]) => {
            const { width: cw, height: ch } = entry.contentRect;

            // 1) contraintes/marges pour être sûr que ça ne coupe pas
            const verticalPadding = 24;           // marge de sécurité haut/bas (px)
            const horizontalPadding = 24;         // marge latérale
            const maxCardHeight = Math.max(160, ch - verticalPadding * 2);
            const maxCardWidth  = Math.max(140, cw - horizontalPadding * 2);

            // 2) ratio de la carte ~ 1.35 (comme ton CSS)
            const ratio = 1.35;

            // 3) on prend la plus petite dimension permissible en respectant le ratio
            //    - si on limite par la hauteur -> width = height/ratio
            //    - si on limite par la largeur -> height = width*ratio
            let cardH = maxCardHeight * 0.92; // un peu de marge visuelle
            let cardW = cardH / ratio;
            if (cardW > maxCardWidth) {
                cardW = maxCardWidth * 0.92;
                cardH = cardW * ratio;
            }

            // 4) pousse les variables CSS sur le container
            el.style.setProperty("--card-width", `${Math.round(cardW)}px`);
            el.style.setProperty("--card-height", `${Math.round(cardH)}px`);

            // 5) rayon : proportionnel à la largeur dispo (évite sortie du container)
            //    règle simple: ~45% de la largeur, borné
            const r = Math.min(Math.max(cw * 0.45, cardW * 1.2), cw * 0.5);
            setRadius(Math.round(r));
        });

        ro.observe(el);
        return () => ro.disconnect();
    }, []);

    // recalcul index visible quand theta change
    useEffect(() => {
        const idx = Math.round(Math.abs(theta / anglePerCard)) % total;
        setCurrentIndex(idx);
    }, [theta, anglePerCard, total]);

    // resize => rayon
    useEffect(() => {
        const onResize = () => setRadius(window.innerWidth <= 768 ? 250 : 400);
        window.addEventListener("resize", onResize);
        return () => window.removeEventListener("resize", onResize);
    }, []);

    // clavier
    useEffect(() => {
        const onKey = (e: KeyboardEvent) => {
            if (e.key === "ArrowLeft") setTheta(t => t - anglePerCard);
            else if (e.key === "ArrowRight") setTheta(t => t + anglePerCard);
            else if (e.key === "Enter" || e.key === " ") {
                if (!items.length) return;
                setFlipped(prev => {
                    const s = new Set(prev);
                    const id = items[currentIndex].id;
                    if (s.has(id)) {
                        s.delete(id);
                    } else {
                        s.add(id);
                    }
                    return s;
                });
            }
        };
        document.addEventListener("keydown", onKey);
        return () => document.removeEventListener("keydown", onKey);
    }, [anglePerCard, currentIndex, items]);

    // drag
    useEffect(() => {
        const el = carouselRef.current;
        if (!el) return;

        const dragStart = (e: MouseEvent | TouchEvent) => {
            e.preventDefault();
            isDraggingRef.current = true;
            startXRef.current = "touches" in e ? e.touches[0].pageX : (e as MouseEvent).pageX;
        };

        const dragMove = (e: MouseEvent | TouchEvent) => {
            if (!isDraggingRef.current) return;
            e.preventDefault();
            const currentX = "touches" in e ? e.touches[0].pageX : (e as MouseEvent).pageX;
            const diffX = currentX - startXRef.current;
            const sensitivity = 0.5;
            const newTheta = theta + diffX * sensitivity;
            if (carouselRef.current) {
                carouselRef.current.style.transform = `rotateY(${newTheta}deg)`;
            }
        };

        const dragEnd = (e: MouseEvent | TouchEvent) => {
            if (!isDraggingRef.current) return;
            isDraggingRef.current = false;
            const currentX = "changedTouches" in e ? e.changedTouches[0].pageX : (e as MouseEvent).pageX;
            const diffX = currentX - startXRef.current;

            if (Math.abs(diffX) > 20) {
                setTheta(t => t + (diffX > 0 ? anglePerCard : -anglePerCard));
            } else {
                setTheta(t => Math.round(t / anglePerCard) * anglePerCard);
            }
        };

        el.addEventListener("mousedown", dragStart);
        el.addEventListener("touchstart", dragStart, { passive: true });
        document.addEventListener("mousemove", dragMove, { passive: false });
        document.addEventListener("touchmove", dragMove, { passive: false });
        document.addEventListener("mouseup", dragEnd);
        document.addEventListener("touchend", dragEnd);

        return () => {
            el.removeEventListener("mousedown", dragStart);
            el.removeEventListener("touchstart", dragStart);
            document.removeEventListener("mousemove", dragMove );
            document.removeEventListener("touchmove", dragMove );
            document.removeEventListener("mouseup", dragEnd );
            document.removeEventListener("touchend", dragEnd);
        };
    }, [anglePerCard, theta]);

    const nextCard = () => setTheta(t => t - anglePerCard);
    const prevCard = () => setTheta(t => t + anglePerCard);

    const toggleFlip = (idx: number, id: string | number) => {
        if (idx !== currentIndex) return; // flip seulement la carte en face
        setFlipped(prev => {
            const s = new Set(prev);
            if (s.has(id)) {
                s.delete(id);
            } else {
                s.add(id);
            }
            return s;
        });
    };

    // Thème via CSS variables (facile à surcharger)
    const styleVars: React.CSSProperties = {
        // @ts-expect-error: CSS custom properties
        "--primary": theme?.primary,
        "--secondary": theme?.secondary,
        "--accent": theme?.accent,
        "--background": theme?.background,
        "--text-primary": theme?.textPrimary,
        "--text-secondary": theme?.textSecondary,
    };

    return (
        <div className="container-fluid h-100 d-flex flex-column" style={styleVars}>
            <div className="flex-grow-1 d-flex align-items-center justify-content-center position-relative">
                <div className="carousel-container" ref={containerRef} >
                    <div
                        className="carousel"
                        ref={carouselRef}
                        style={{ transform: `rotateY(${theta}deg)` }}
                    >
                        {items.length === 0 ? (
                            <div className="memory-card" style={{ transform: `rotateY(0deg) translateZ(${radius}px)` }}>
                                <div className="card-inner">
                                    <div className="card-front">
                                        <div className="card-content">
                                            <div className="memory-date">AUCUN RÉSULTAT</div>
                                            <h3>Commence une recherche</h3>
                                            <div className="memory-image" />
                                            <p className="memory-preview">Tape quelques ingrédients pour voir des cartes apparaître.</p>
                                            <div className="card-glow"></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            items.map((m, idx) => {
                                const cardAngle = anglePerCard * idx;
                                const isFlipped = flipped.has(m.id);
                                return (
                                    <div
                                        key={m.id}
                                        className={`memory-card${isFlipped ? " flipped" : ""}`}
                                        data-index={idx}
                                        onClick={() => toggleFlip(idx, m.id)}
                                        style={{ transform: `rotateY(${cardAngle}deg) translateZ(${radius}px)` }}
                                    >
                                        <div className="card-inner">
                                            <div className="card-front">
                                                <div className="card-content">
                                                    <h3>{m.title}</h3>
                                                    {m.preview && <p className="memory-preview">{m.preview}</p>}
                                                </div>
                                            </div>
                                            <div className="card-back">
                                                <div className="card-content">
                                                    <h3>{m.title}</h3>
                                                    {m.description && <p>{m.description}</p>}
                                                    {(m.location || m.time) && (
                                                        <div className="memory-coordinates">
                                                            {m.location && <span>{m.location}</span>}
                                                            {m.time && <span className="time-stamp">{m.time}</span>}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })
                        )}
                    </div>

                    {/* Contrôles */}
                    <div className="carousel-controls">
                        <button className="control-btn" onClick={prevCard} aria-label="Précédent">‹</button>
                        <button className="control-btn" onClick={nextCard} aria-label="Suivant">›</button>
                    </div>
                </div>
            </div>
        </div>
    );
}

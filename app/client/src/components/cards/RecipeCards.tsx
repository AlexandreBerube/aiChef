import "./recipeCards.css";

export type CarouselItem = {
    id: string | number;
    title: string;
    preview?: string;
    description?: string;
};

export default function RecipeCards({
                                        title,
                                        items,
                                        onSelect
                                    }: {
    title?: string;
    items: CarouselItem[];
    onSelect: (item: CarouselItem) => void;
}) {
    if (!items || items.length === 0) return null;

    return (
        <section className="recipe-section">
            {title && <h2 className=" recipe-section-title">{title}</h2>}

            <div className="recipe-grid">
                {items.map((item) => (
                    <div key={item.id} className="flip-card" onClick={() => onSelect(item)}>
                    <div className="flip-inner">
                            <div className="flip-front">
                                <h3 className="text">{item.title}</h3>
                                <p className="ingredients recipe-text card-scrollable">{item.preview}</p>
                            </div>
                            <div className="flip-back">
                                <h3>Instructions</h3>
                                <p className="instructions recipe-text card-scrollable">{item.description}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}

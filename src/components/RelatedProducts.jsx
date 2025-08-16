import { useState, useEffect } from 'react';
import ProductCard from './components/ProductCard';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export default function RelatedProducts({ productId, category, userId }) {
    const [relatedProducts, setRelatedProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!category) return;

        const fetchRelated = async () => {
            try {
                setLoading(true);
                const res = await fetch(`${API_BASE_URL}/products/search?category=${encodeURIComponent(category)}`);
                if (!res.ok) throw new Error('Erro ao buscar produtos relacionados');
                const data = await res.json();
                setRelatedProducts(data.filter(p => p.isActive && p.id !== productId));
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchRelated();
    }, [category]);

    if (loading) return <p className="text-center py-4">Carregando produtos relacionados...</p>;
    if (!relatedProducts.length) return null;

    return (
        <section className="mt-[150px]">
            <h2 className="text-xl md:text-2xl font-semibold mb-6 text-center">Você também vai amar esses aqui</h2>
            <div className="flex flex-wrap justify-center gap-4">
                {relatedProducts.map(product => (
                    <ProductCard
                        key={product.id}
                        product={product}
                        cloudUrl={API_BASE_URL}
                        userId={userId}
                    />
                ))}
            </div>
        </section>
    );
}

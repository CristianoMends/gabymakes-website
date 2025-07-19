import { useState, useEffect } from 'react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export default function CategoriesBar() {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await fetch(`${API_URL}/products/categories/unique`);
                if (!response.ok) {
                    throw new Error(`Erro ao carregar categorias: ${response.statusText}`);
                }
                const data = await response.json();


                const topCategories = data
                    .filter(cat => typeof cat === 'string' && cat.trim() !== '')
                    .slice(0, 4);
                setCategories(topCategories);
            } catch (err) {
                console.error("Erro na busca de categorias para a barra:", err);
                setError("Não foi possível carregar categorias.");
            } finally {
                setLoading(false);
            }
        };

        fetchCategories();
    }, []);


    if (loading) {
        return (
            <nav className="w-full bg-pink-200 py-3 px-4 shadow-sm flex justify-center items-center h-12 text-gray-700">
                Carregando categorias...
            </nav>
        );
    }


    if (error) {
        return (
            <nav className="w-full bg-red-100 py-3 px-4 shadow-sm flex justify-center items-center h-12 text-red-700">
                {error}
            </nav>
        );
    }


    if (categories.length === 0) {
        return (
            <nav className="w-full bg-pink-200 py-3 px-4 shadow-sm flex justify-center items-center h-12 text-gray-500">
                Nenhuma categoria disponível.
            </nav>
        );
    }

    return (
        <nav className="w-full bg-pink-200 py-3 px-4 shadow-sm">
            <ul className="flex flex-wrap justify-center gap-x-8 gap-y-2 sm:gap-x-12 md:gap-x-16 lg:gap-x-20">
                {categories.map((catName) => (
                    <li key={catName}>
                        <a

                            href={`/busca?q=${encodeURIComponent(catName.replaceAll(' ', '-'))}`}
                            className="text-gray-800 text-sm sm:text-base font-semibold uppercase tracking-wide
                         hover:text-pink-700 transition-colors duration-200 ease-in-out
                         focus:outline-none focus:ring-2 focus:ring-pink-400 focus:ring-offset-2"
                            aria-label={`Ver produtos da categoria ${catName}`}
                        >
                            {catName}
                        </a>
                    </li>
                ))}
            </ul>
        </nav>
    );
}
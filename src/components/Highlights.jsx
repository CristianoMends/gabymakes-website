import { useState, useEffect } from "react";
import ProductCard from "./ProductCard";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

export default function Highlights() {
    document.title = "Destaques | GabyMakes e acessórios";

    const [sections, setSections] = useState([]);
    const [allProducts, setAllProducts] = useState([]); // Agora 'allProducts' para evitar conflito
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [userId, setUserId] = useState(null); // Estado para o userId

    // Hook para carregar TODOS os produtos (necessário para o ProductCard)
    useEffect(() => {
        const fetchAllProducts = async () => {
            try {
                const res = await fetch(`${API_URL}/products`);
                if (!res.ok) {
                    throw new Error(`HTTP error! status: ${res.status}`);
                }
                const data = await res.json();
                setAllProducts(data);
            } catch (err) {
                console.error("Erro ao carregar todos os produtos:", err);
                // Não define erro globalmente aqui para não bloquear o carregamento das seções
            }
        };
        fetchAllProducts();

        // Obter userId (adapte conforme sua lógica de autenticação)
        const storedUserId = localStorage.getItem('userId');
        if (storedUserId) {
            setUserId(storedUserId);
        }
    }, []);

    // Carrega as seções de destaque
    useEffect(() => {
        setLoading(true);
        fetch(`${API_URL}/sections`)
            .then(res => {
                if (!res.ok) {
                    throw new Error(`HTTP error! status: ${res.status}`);
                }
                return res.json();
            })
            .then(data => {
                // Garante que 'data' é um array
                setSections(Array.isArray(data) ? data : []);
                setLoading(false);
            })
            .catch(err => {
                console.error("Erro ao carregar seções de destaque:", err);
                setError("Não foi possível carregar as seções de destaque.");
                setLoading(false);
            });
    }, []);

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen">
                <p>Carregando destaques e produtos...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen text-red-600">
                <p>{error}</p>
            </div>
        );
    }

    return (
        <div className="flex flex-col min-h-screen">

            <div className="flex flex-col gap-8 p-6">
                {sections.length > 0 ? (
                    sections.map(section => (
                        <div key={section.id} className="mb-8">
                            <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">
                                {section.title}
                            </h2>
                            <div className="flex flex-wrap justify-center gap-6">
                                {/* Mapeia os produtos da seção e usa o ProductCard */}
                                {section.products && section.products.length > 0 ? (
                                    section.products.map(sectionProduct => (
                                        // Passa o objeto do produto diretamente para o ProductCard
                                        <ProductCard
                                            key={sectionProduct.id}
                                            product={sectionProduct}
                                            userId={userId} // Passa o userId para o ProductCard
                                        // cloudUrl={cloudUrl} // Se tiver uma cloudUrl global, passe aqui
                                        />
                                    ))
                                ) : (
                                    <p className="text-gray-500">Nenhum produto nesta seção.</p>
                                )}
                            </div>
                        </div>
                    ))
                ) : (
                    <p className="text-center text-gray-600 text-lg mt-8">
                        Nenhuma seção de destaque disponível no momento.
                    </p>
                )}
            </div>
        </div>
    );
}
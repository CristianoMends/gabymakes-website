import { useState, useEffect } from "react";
import ProductCard from "../components/productcard";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

export default function Highlights() {

    const [sections, setSections] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [userId, setUserId] = useState(null);

    useEffect(() => {
        const storedUserId = localStorage.getItem('userId');
        if (storedUserId) {
            setUserId(storedUserId);
        }
    }, [])

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
        <div className="flex flex-col min-h-screen mt-[100px]">

            <div className="flex flex-col gap-8 p-6">
                {sections.length > 0 ? (
                    sections.map(section => (
                        <div key={section.id} className="mb-8">
                            <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">
                                {section.title}
                            </h2>
                            <div className="flex justify-center md:flex-wrap max-sm:justify-start overflow-x-auto no-scrollbar gap-4 max-sm:gap-2 px-1 snap-x snap-mandatory scroll-smooth">
                                {section.products && section.products.length > 0 ? (
                                    section.products.map(sectionProduct => (
                                        <div
                                            key={sectionProduct.id}
                                            className=""
                                        >
                                            <ProductCard
                                                product={sectionProduct}
                                                userId={userId}
                                            />
                                        </div>
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
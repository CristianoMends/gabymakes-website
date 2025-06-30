import React, { useState, useEffect } from 'react';
import { getProducts } from '../services/productService';
import LoadingCircles from './loading';
import ProductCard from './productcard';

const ProductList = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const cloudUrl = "https://res.cloudinary.com/ddzfuyfh9/image/upload/";

    useEffect(() => {
        // Chamamos a função que retorna a promessa
        getProducts()
            .then(data => {
                // Quando a promessa é resolvida, atualizamos o estado com os produtos
                setProducts(data);
            })
            .catch(err => {
                // Se a promessa for rejeitada, tratamos o erro
                console.error("Falha ao carregar produtos:", err);
                setError('Não foi possível carregar os produtos. Tente novamente mais tarde.');
            })
            .finally(() => {
                // Independentemente do resultado, paramos o indicador de carregamento
                setLoading(false);
            });
    }, []); // O array vazio garante que o efeito rode apenas uma vez na montagem do componente

    if (loading) {
        return <LoadingCircles />;
    }

    if (error) {
        return <div className="text-center text-red-500 p-4">{error}</div>;
    }

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-3xl font-bold mb-8 text-center text-gray-800">Nossos Produtos</h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 justify-items-center">
                {products.map(product => (
                    <ProductCard
                        key={product.id}
                        product={product}
                        cloudUrl={cloudUrl}
                    />
                ))}
            </div>
        </div>
    );
};

export default ProductList;
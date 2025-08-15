import { useNavigate } from "react-router-dom";
import cardPlaceholder from '../assets/card-content.png';
import { useState } from "react";

export default function ProductCard({ product, cloudUrl, userId }) {
    const navigate = useNavigate();
    const { id, brand, description, price, imageUrl } = product;
    const imageToDisplay = imageUrl || cardPlaceholder;
    const discount = product.discount || 0;

    const discountedPrice = price - (price * discount / 100);
    const formattedDiscountedPrice = new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
    }).format(discountedPrice);

    const formattedPrice = new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
    }).format(price || 0);

    const handleCardClick = () => navigate(`/produtos/${id}`);

    return (
        <div
            onClick={handleCardClick}
            className="relative mb-[50px] group h-[400px] w-full sm:w-[260px] md:w-[280px] flex flex-col justify-between rounded-lg shadow-md hover:shadow-2xl transition-shadow duration-300 cursor-pointer bg-white overflow-hidden"
        >
            {/* Imagem */}
            <div className="w-full h-48 sm:h-56 md:h-60 flex justify-center items-end overflow-hidden relative bg-gray-50">
                <img
                    src={imageToDisplay}
                    alt={brand}
                    className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-105"
                />

                {/* Nome do produto subindo */}
                <div className="absolute left-0 right-0 bottom-0 flex justify-center">
                    <div className="bg-black bg-opacity-50 text-white font-semibold px-4 py-1 rounded transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                        VER MAIS
                    </div>
                </div>
            </div>

            {/* Conteúdo */}
            <div className="p-4 flex flex-col gap-2 items-center text-center">
                <p className="text-md text-gray-500 text-center font-bold mb-1">
                    {brand && brand.toUpperCase()}
                </p>
                <p className="text-sm text-gray-600 line-clamp-3 h-16 overflow-hidden">{description}</p>

                {discount > 0 ? (
                    <div className="flex flex-col items-center">
                        <div className="flex items-center gap-2">
                            <span className="text-gray-400 line-through">{formattedPrice}</span>
                            <span className="text-xs text-green-600 font-semibold">{discount}% OFF</span>
                        </div>
                        <span className="text-2xl md:text-3xl text-pink-500 font-bold mt-1">
                            {formattedDiscountedPrice}
                        </span>
                    </div>
                ) : (
                    <span className="text-2xl md:text-3xl text-gray-800 font-bold mt-2">
                        {formattedPrice}
                    </span>
                )}
            </div>
        </div>
    );
}

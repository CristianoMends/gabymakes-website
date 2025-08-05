import { useNavigate } from "react-router-dom";
import cardPlaceholder from '../assets/card-content.png';
import Message from "./message";
import { useState } from "react";

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export default function ProductCard({ product, cloudUrl, userId }) {
    const navigate = useNavigate();
    const { id, brand, description, price, imageUrl } = product;
    const imageToDisplay = imageUrl ? imageUrl : cardPlaceholder;
    const [message, setMessage] = useState(null);
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

    const handleAddToCart = async (e) => {
        e.stopPropagation();

        if (userId) {
            // Usuário logado, envia para API
            try {
                const res = await fetch(`${API_BASE_URL}/cart-item/add`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        userId: userId,
                        productId: id,
                        quantity: 1,
                    }),
                });
                if (res.ok) {
                    setMessage({ type: "success", text: "Produto adicionado ao carrinho!" });
                    // Opcional: disparar evento global para atualizar carrinho na aplicação
                    window.dispatchEvent(new Event('cartUpdated'));
                } else {
                    const err = await res.json();
                    setMessage({ type: "error", text: err.message || "Erro ao adicionar ao carrinho." });
                }
            } catch (error) {
                setMessage({ type: "error", text: "Erro na comunicação com o servidor." });
                console.error(error);
            }
        } else {
            // Usuário não logado, salva no localStorage
            const cartString = localStorage.getItem('cart');
            let cart = cartString ? JSON.parse(cartString) : [];

            const productInCart = cart.find(item => item.id === id);

            if (productInCart) {
                productInCart.quantity += 1;
            } else {
                const newCartItem = {
                    id,
                    name: brand,
                    price,
                    imageUrl: imageToDisplay,
                    quantity: 1
                };
                cart.push(newCartItem);
            }
            localStorage.setItem('cart', JSON.stringify(cart));
            window.dispatchEvent(new Event('cartUpdated'));
            setMessage({ type: "success", text: "Produto adicionado ao carrinho!" });
        }
    };

    const handleCardClick = () => {
        navigate(`/produtos/${id}`);
    };

    return (
        <>
            <div
                onClick={handleCardClick}
                className="relative p-2 group w-full h-full sm:w-[280px] h-auto flex flex-col items-center justify-between border pt-4 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 cursor-pointer"
            >
                <div className="w-full max-h-[150px] max-sm:max-h-[100px] overflow-hidden rounded-md">
                    <img
                        src={imageToDisplay}
                        alt={brand}
                        className="w-full h-full object-contain"
                    />
                </div>

                <div className="p-4 flex flex-col gap-2 w-full items-center text-center">
                    <h3
                        className="text-lg font-medium text-gray-800 truncate max-w-full"
                        title={brand}
                    >
                        {brand}
                    </h3>
                    <p className="text-sm text-gray-600 h-16 overflow-hidden text-ellipsis line-clamp-3">
                        {description}
                    </p>

                    {discount > 0 ? (
                        <div className="flex flex-col items-center">
                            <span className="text-gray-500 text-sm line-through">
                                {formattedPrice}
                            </span>
                            <span className="text-3xl text-pink-400 max-sm:text-2xl font-bold tracking-tight font-poppins">
                                {formattedDiscountedPrice}
                            </span>
                            <span className="text-xs text-green-600 mt-1">
                                {discount}% OFF
                            </span>
                        </div>
                    ) : (
                        <span className="text-3xl max-sm:text-2xl text-gray-800 font-bold tracking-tight font-poppins">
                            {formattedPrice}
                        </span>
                    )}
                </div>
            </div>

            {message && (
                <Message
                    type={message.type}
                    message={message.text}
                    onClose={() => setMessage(null)}
                />
            )}
        </>
    );
}

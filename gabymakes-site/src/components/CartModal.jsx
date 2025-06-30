import { useState, useEffect } from 'react';
import { HiXMark, HiOutlineTrash } from 'react-icons/hi2';
import { useNavigate } from 'react-router-dom';

const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
    }).format(value || 0);
};

export default function CartModal({ onClose }) {
    const [cartItems, setCartItems] = useState([]);
    const [total, setTotal] = useState(0);
    const navigate = useNavigate();

    const updateCart = () => {
        const cart = JSON.parse(sessionStorage.getItem('cart')) || [];
        setCartItems(cart);
        const newTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
        setTotal(newTotal);
    };

    useEffect(() => {
        updateCart(); // Carga inicial

        // Ouve por atualizações de outros componentes
        window.addEventListener('cartUpdated', updateCart);

        // Limpeza do evento
        return () => {
            window.removeEventListener('cartUpdated', updateCart);
        };
    }, []);

    const handleUpdateQuantity = (productId, newQuantity) => {
        let cart = JSON.parse(sessionStorage.getItem('cart')) || [];
        const itemIndex = cart.findIndex(item => item.id === productId);

        if (itemIndex !== -1) {
            if (newQuantity > 0) {
                cart[itemIndex].quantity = newQuantity;
            } else {
                // Remove o item se a quantidade for 0 ou menor
                cart.splice(itemIndex, 1);
            }
        }

        sessionStorage.setItem('cart', JSON.stringify(cart));
        window.dispatchEvent(new Event('cartUpdated')); // Notifica outros componentes
    };

    const handleCheckout = () => {
        onClose(); // Fecha o modal
        navigate('/checkout'); // Navega para a página de checkout
    };

    return (
        // Overlay
        <div className="fixed inset-0 z-50 flex justify-end" onClick={onClose}>
            {/* Conteúdo do Modal */}
            <div
                className="w-full max-w-md h-full bg-white shadow-xl flex flex-col"
                onClick={(e) => e.stopPropagation()} // Impede de fechar ao clicar dentro
            >
                {/* Cabeçalho do Modal */}
                <div className="flex justify-between items-center p-4 border-b">
                    <h2 className="text-xl font-semibold">Seu Carrinho</h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-800">
                        <HiXMark size={24} />
                    </button>
                </div>

                {/* Corpo do Modal */}
                <div className="flex-grow p-4 overflow-y-auto">
                    {cartItems.length === 0 ? (
                        <div className="text-center text-gray-500 mt-10">
                            <p>Seu carrinho está vazio.</p>
                        </div>
                    ) : (
                        <ul className="space-y-4">
                            {cartItems.map((item) => (
                                <li key={item.id} className="flex items-center space-x-4">
                                    <img src={item.imageUrl} alt={item.name} className="w-20 h-20 object-contain rounded border" />
                                    <div className="flex-grow">
                                        <p className="font-semibold">{item.name}</p>
                                        <p className="text-sm text-gray-600">{formatCurrency(item.price)}</p>
                                        <div className="flex items-center mt-2">
                                            <button onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)} className="border px-2 rounded-l">-</button>
                                            <span className="border-t border-b px-3">{item.quantity}</span>
                                            <button onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)} className="border px-2 rounded-r">+</button>
                                        </div>
                                    </div>
                                    <button onClick={() => handleUpdateQuantity(item.id, 0)} className="text-red-500 hover:text-red-700">
                                        <HiOutlineTrash size={20} />
                                    </button>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>

                {/* Rodapé do Modal */}
                {cartItems.length > 0 && (
                    <div className="p-4 border-t">
                        <div className="flex justify-between items-center mb-4">
                            <span className="text-lg font-semibold">Total:</span>
                            <span className="text-lg font-bold">{formatCurrency(total)}</span>
                        </div>
                        <button
                            onClick={handleCheckout}
                            className="w-full bg-pink-500 text-white py-3 rounded-lg font-semibold hover:bg-pink-600 transition-colors"
                        >
                            Ir para o Checkout
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
import { useState, useEffect, useRef } from 'react';
import { HiXMark, HiOutlineTrash } from 'react-icons/hi2';
import { useNavigate } from 'react-router-dom';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const formatCurrency = (value) =>
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value || 0);

export default function CartModal({ onClose }) {
    const [cartItems, setCartItems] = useState([]);
    const [total, setTotal] = useState(0);
    const [userId, setUserId] = useState(null);
    const navigate = useNavigate();

    const pendingUpdates = useRef({}); // { itemId: newQuantity }
    const debounceTimer = useRef(null);

    useEffect(() => {
        const currentUser = localStorage.getItem('currentUser');
        if (currentUser) {
            try {
                const user = JSON.parse(currentUser);
                setUserId(user?.id || null);
            } catch {
                setUserId(null);
            }
        }
    }, []);

    const updateCart = async () => {
        let items = [];

        if (userId) {
            try {
                const res = await fetch(`${API_BASE_URL}/cart-item/${userId}`);
                if (!res.ok) throw new Error('Erro ao buscar carrinho');
                items = await res.json();
            } catch (err) {
                console.error('Erro ao buscar carrinho da API:', err);
            }
        } else {
            items = JSON.parse(localStorage.getItem('cart')) || [];
        }

        setCartItems(items);
        const totalSum = items.reduce((sum, item) => {
            const product = item.product || item;
            const price = product.price || 0;
            return sum + price * item.quantity;
        }, 0);
        setTotal(totalSum);
    };

    useEffect(() => {
        updateCart();
        window.addEventListener('cartUpdated', updateCart);
        return () => window.removeEventListener('cartUpdated', updateCart);
    }, [userId]);

    const syncUpdates = async () => {
        if (!userId) return;

        const updates = pendingUpdates.current;
        pendingUpdates.current = {};

        const promises = Object.entries(updates).map(async ([itemId, quantity]) => {
            if (quantity <= 0) {
                return fetch(`${API_BASE_URL}/cart-item/remove/${itemId}`, { method: 'DELETE' });
            } else {
                return fetch(`${API_BASE_URL}/cart-item/update-quantity`, {
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ userId, itemId: Number(itemId), quantity }),
                });
            }
        });

        try {
            await Promise.all(promises);
            updateCart();
        } catch (err) {
            console.error('Erro ao sincronizar atualizações do carrinho:', err);
        }
    };

    const scheduleSync = () => {
        if (debounceTimer.current) clearTimeout(debounceTimer.current);
        debounceTimer.current = setTimeout(syncUpdates, 1000);
    };

    const handleAddQuantity = (itemId) => {
        setCartItems((oldItems) => {
            const newItems = oldItems.map((item) => {
                if ((item.product?.id || item.id) === itemId) {
                    const newQuantity = item.quantity + 1;
                    pendingUpdates.current[itemId] = newQuantity;
                    scheduleSync();
                    return { ...item, quantity: newQuantity };
                }
                return item;
            });
            return newItems;
        });
    };

    const handleDecreaseQuantity = (itemId) => {
        setCartItems((oldItems) => {
            const newItems = oldItems
                .map((item) => {
                    if ((item.product?.id || item.id) === itemId) {
                        const newQuantity = item.quantity - 1;
                        if (newQuantity <= 0) {
                            pendingUpdates.current[itemId] = 0;
                            scheduleSync();
                            return null;
                        }
                        pendingUpdates.current[itemId] = newQuantity;
                        scheduleSync();
                        return { ...item, quantity: newQuantity };
                    }
                    return item;
                })
                .filter(Boolean);
            return newItems;
        });
    };

    const handleRemove = (itemId) => {
        setCartItems((oldItems) => {
            pendingUpdates.current[itemId] = 0;
            scheduleSync();
            return oldItems.filter((item) => (item.product?.id || item.id) !== itemId);
        });
    };

    const handleCheckout = () => {
        onClose();
        navigate(`/checkout/${userId || 'guest'}`);
    };

    useEffect(() => {
        const totalSum = cartItems.reduce((sum, item) => {
            const product = item.product || item;
            const price = product.price || 0;
            return sum + price * item.quantity;
        }, 0);
        setTotal(totalSum);
    }, [cartItems]);

    return (
        <div className="fixed inset-0 z-50 flex justify-end" onClick={onClose}>
            <div
                className="w-full max-w-md h-full bg-white shadow-xl flex flex-col"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex justify-between items-center p-4 border-b">
                    <h2 className="text-xl font-semibold">Sua Sacola</h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-800">
                        <HiXMark size={24} />
                    </button>
                </div>

                <div className="flex-grow p-4 overflow-y-auto">
                    {cartItems.length === 0 ? (
                        <div className="text-center text-gray-500 mt-10">
                            <p>Sua sacola está vazia.</p>
                        </div>
                    ) : (
                        <ul className="space-y-4">
                            {cartItems.map((item) => {
                                const product = item.product || item;
                                const itemId = product.id;
                                return (
                                    <li key={item.id || product.id} className="flex items-center space-x-4">
                                        <img
                                            src={product.imageUrl}
                                            alt={product.name}
                                            className="w-20 h-20 object-contain rounded border"
                                        />
                                        <div className='flex-grow'>
                                            <p>{product.quantity}x</p>

                                        </div>
                                        <div className="flex-grow">
                                            <p className="font-semibold">{product.description && product.description.substring(0, 30)+ '...'}</p>
                                            <p className="text-sm text-gray-600">{formatCurrency(product.price)}</p>

                                        </div>
                                        {/*
                                        <div className="flex-grow">
                                            <p className="font-semibold">{product.name}</p>
                                            <p className="text-sm text-gray-600">{formatCurrency(product.price)}</p>
                                            <div className="flex items-center mt-2">
                                                <button
                                                    onClick={() => handleDecreaseQuantity(itemId)}
                                                    className="border px-2 rounded-l"
                                                    aria-label={`Diminuir quantidade de ${product.name}`}
                                                >
                                                    -
                                                </button>
                                                
                                                <span className="border-t border-b px-3">{item.quantity}</span>
                                                <button
                                                    onClick={() => handleAddQuantity(itemId)}
                                                    className="border px-2 rounded-r"
                                                    aria-label={`Aumentar quantidade de ${product.name}`}
                                                >
                                                    +
                                                </button>
                                            </div>
                                        </div>
                            */}
                                        <button
                                            onClick={() => handleRemove(itemId)}
                                            className="text-red-500 hover:text-red-700"
                                            aria-label={`Remover ${product.name}`}
                                        >
                                            <HiOutlineTrash size={20} />
                                        </button>
                                    </li>
                                );
                            })}
                        </ul>
                    )}
                </div>

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

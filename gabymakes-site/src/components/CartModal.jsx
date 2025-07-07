import { useState, useEffect, useRef } from 'react';
import { HiXMark, HiOutlineTrash } from 'react-icons/hi2';
import { useNavigate } from 'react-router-dom';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
const formatCurrency = (v) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v || 0);

export default function CartModal({ onClose }) {
    const [cartItems, setCartItems] = useState([]);
    const [total, setTotal] = useState(0);
    const [userId, setUserId] = useState(null);
    const [isSyncing, setIsSyncing] = useState(false);
    const navigate = useNavigate();
    const pendingUpdates = useRef({});  // { productId: quantity }
    const debounceTimer = useRef(null);

    /* ---------- USER ---------- */
    useEffect(() => {
        const cu = localStorage.getItem('currentUser');
        if (!cu) return;
        try { setUserId(JSON.parse(cu)?.id ?? null); }
        catch { setUserId(null); }
    }, []);

    /* ---------- FETCH CART ---------- */
    const updateCart = async () => {
        if (isSyncing) return;              // trava enquanto sincroniza
        let items = [];

        if (userId) {
            try {
                const res = await fetch(`${API_BASE_URL}/cart-item/${userId}`);
                if (!res.ok) throw new Error('Erro ao buscar carrinho');
                items = await res.json();
            } catch (err) {
                console.error(err);
            }
        } else {
            items = JSON.parse(localStorage.getItem('cart')) || [];
        }

        setCartItems(items);
        setTotal(items.reduce((s, it) => s + (it.product?.price || it.price) * it.quantity, 0));
    };

    useEffect(() => { updateCart(); }, [userId]);

    /* ---------- SYNC ---------- */
    const syncUpdates = async () => {
        const updates = pendingUpdates.current;   // { productId: qty }
        pendingUpdates.current = {};

        if (!userId || !Object.keys(updates).length) return;

        setIsSyncing(true);
        try {
            await Promise.all(
                Object.entries(updates).map(([productId, qty]) =>
                    qty <= 0
                        ? fetch(`${API_BASE_URL}/cart-item/remove/${productId}`, { method: 'DELETE' })          // 🔄 ALTERADO
                        : fetch(`${API_BASE_URL}/cart-item/update-quantity`, {                                   // 🔄 ALTERADO
                            method: 'PATCH',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ userId, itemId: Number(productId), quantity: qty }),
                        })
                )
            );
        } catch (err) {
            console.error('Erro ao sincronizar carrinho:', err);
        } finally {
            setIsSyncing(false);
            await updateCart();
        }
    };

    const scheduleSync = () => {
        if (debounceTimer.current) clearTimeout(debounceTimer.current);
        if (userId) setIsSyncing(true);   // trava a lista antes do debounce
        debounceTimer.current = setTimeout(syncUpdates, 1000);
    };

    /* ---------- HANDLERS ---------- */
    const handleAddQuantity = (productId) => {
        setCartItems((old) =>
            old.map((it) =>
                (it.product?.id || it.id) === productId
                    ? (() => {
                        const q = it.quantity + 1;
                        pendingUpdates.current[productId] = q;       // 🔄 ALTERADO
                        scheduleSync();
                        return { ...it, quantity: q };
                    })()
                    : it
            )
        );
    };

    const handleDecreaseQuantity = (productId) => {
        setCartItems((old) =>
            old
                .map((it) => {
                    if ((it.product?.id || it.id) !== productId) return it;
                    const q = it.quantity - 1;
                    pendingUpdates.current[productId] = q;           // 🔄 ALTERADO
                    scheduleSync();
                    return q <= 0 ? null : { ...it, quantity: q };
                })
                .filter(Boolean)
        );
    };

    const handleRemove = (productId) => {
        setCartItems((old) => old.filter((it) => (it.product?.id || it.id) !== productId));
        pendingUpdates.current[productId] = 0;                 // 🔄 ALTERADO
        scheduleSync();
    };

    const handleCheckout = () => {
        onClose();
        navigate(`/checkout/${userId || 'guest'}`);
    };

    /* ---------- RENDER ---------- */
    return (
        <div className="fixed inset-0 z-50 flex justify-end" onClick={onClose}>
            <div className="w-full max-w-md h-full bg-white shadow-xl flex flex-col" onClick={(e) => e.stopPropagation()}>
                {/* header */}
                <div className="flex justify-between items-center p-4 border-b">
                    <h2 className="text-xl font-semibold">Sua Sacola</h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-800">
                        <HiXMark size={24} />
                    </button>
                </div>

                {/* items */}
                <div className="flex-grow p-4 overflow-y-auto">
                    {cartItems.length === 0 ? (
                        <p className="text-center text-gray-500 mt-10">Sua sacola está vazia.</p>
                    ) : (
                        <ul className="space-y-4">
                            {cartItems.map((item) => {
                                const product = item.product || item;
                                const productId = product.id;                                   // 🔄 ALTERADO
                                return (
                                    <li key={productId} className="flex items-center space-x-4">
                                        <img src={product.imageUrl} alt={product.name} className="w-20 h-20 object-contain rounded border" />

                                        <div className="flex-grow"><p>{item.quantity}x</p></div>

                                        <div className="flex-grow">
                                            <p className="font-semibold">
                                                {(product.description || product.name).substring(0, 30)}…
                                            </p>
                                            <p className="text-sm text-gray-600">{formatCurrency(product.price)}</p>
                                        </div>

                                        <button onClick={() => handleRemove(productId)} className="text-red-500 hover:text-red-700">
                                            <HiOutlineTrash size={20} />
                                        </button>
                                    </li>
                                );
                            })}
                        </ul>
                    )}
                </div>

                {/* footer */}
                {cartItems.length > 0 && (
                    <div className="p-4 border-t">
                        <div className="flex justify-between mb-4">
                            <span className="text-lg font-semibold">Total:</span>
                            <span className="text-lg font-bold">{formatCurrency(total)}</span>
                        </div>
                        <button
                            onClick={handleCheckout}
                            className="w-full bg-pink-500 text-white py-3 rounded-lg font-semibold hover:bg-pink-600"
                        >
                            Ir para o Checkout
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}

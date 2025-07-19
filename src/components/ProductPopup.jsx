import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import LoadingCircles from "./loading";
import Message from "./message";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

export default function ProductPopup({ productId, isOpen, onClose }) {
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!isOpen) {
            setProduct(null);
            setError(null);
            return;
        }

        if (!productId) {
            setProduct(null);
            return;
        }

        (async () => {
            try {
                setLoading(true);
                setError(null);
                setProduct(null); // garante que comece limpo

                const token = localStorage.getItem("accessToken");
                const res = await fetch(`${API_URL}/products/${productId}`, {
                    headers: token ? { Authorization: `Bearer ${token}` } : {},
                });

                if (!res.ok) throw new Error(`Produto não encontrado (cód. ${res.status})`);
                const data = await res.json();
                setProduct(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        })();
    }, [isOpen, productId]);

    useEffect(() => {
        if (!isOpen) return;
        const esc = (e) => e.key === "Escape" && onClose();
        window.addEventListener("keydown", esc);
        return () => window.removeEventListener("keydown", esc);
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    const formattedPrice = new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL",
    }).format(product?.price || 0);

    if (loading) {
        return createPortal(
            <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/50">
                <LoadingCircles />
            </div>,
            document.body
        );
    }

    // ❌ Erro
    if (error) {
        return createPortal(
            <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/50" onClick={onClose}>
                <div
                    className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6 relative"
                    onClick={(e) => e.stopPropagation()}
                >
                    <Message
                        type="error"
                        message={error}
                        onClose={() => setError(null)}
                    />
                </div>
            </div>,
            document.body
        );
    }

    // ✅ Exibe produto somente quando carregado
    if (!product) return null;

    return createPortal(
        <div
            className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/50"
            onClick={onClose}
        >
            <div
                className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6 relative flex flex-col items-start"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="w-full h-60 overflow-hidden rounded-md mb-4">
                    <img
                        src={product.imageUrl || "/placeholder.jpg"}
                        alt={product.description}
                        className="w-full h-full object-contain"
                    />
                </div>
                <h2 className="text-xl font-semibold text-gray-800 mb-2">
                    {product.description}
                </h2>
                <p className="text-sm text-gray-600 text-left mb-1">
                    <span className="font-semibold">Marca:</span> {product.brand || "-"}
                </p>
                <p className="text-sm text-gray-600 text-left mb-1">
                    <span className="font-semibold">Categoria:</span> {product.category || "-"}
                </p>
                <p className="text-sm text-gray-600 text-left mb-1">
                    <span className="font-semibold">Estoque:</span> {product.quantity || 0}
                </p>
                <p className="text-2xl font-bold mt-4">{formattedPrice}</p>
            </div>
        </div>,
        document.body
    );
}

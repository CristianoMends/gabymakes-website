import { useState, useEffect } from "react";
import LoadingCircles from "../components/loading";
import ConfirmationModal from "../components/confirmationModal";
import Message from "../components/message";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

export default function AdminHighlights() {
    const [highlights, setHighlights] = useState([]);
    const [newHighlight, setNewHighlight] = useState({ title: "", productId: [] });
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [confirmTitle, setConfirmTitle] = useState("");
    const [confirmMessage, setConfirmMessage] = useState("");
    const [showConfirm, setShowConfirm] = useState(false);
    const [msg, setMsg] = useState(null);
    const [confirmAction, setConfirmAction] = useState(null);
    const [confirming, setConfirming] = useState(false);

    useEffect(() => {
        fetch(`${API_URL}/products`)
            .then(res => res.json())
            .then(data => setProducts(data))
            .catch(() => setProducts([]));
    }, []);

    function openConfirmation({ title, message, onConfirm }) {
        setConfirmTitle(title);
        setConfirmMessage(message);
        setConfirmAction(() => onConfirm);
        setShowConfirm(true);
    }

    const handleAdd = async () => {
        if (!newHighlight.title || newHighlight.productId.length === 0) return;
        setLoading(true);
        try {
            const res = await fetch(`${API_URL}/sections`, {
                method: "POST",
                headers: getAuthHeaders(),
                body: JSON.stringify({
                    title: newHighlight.title,
                    productId: newHighlight.productId
                })
            });
            const data = await res.json();
            setHighlights([...highlights, data]);
            setNewHighlight({ title: "", productId: [] });
        } catch (err) {
            alert("Erro ao adicionar destaque.");
        } finally { // Use finally para garantir que o loading seja sempre resetado
            setLoading(false);
        }
    };

    const handleRemove = async (id) => {
        openConfirmation({
            title: "Remover destaque?",
            message: "Tem certeza de que deseja remover este destaque?",
            onConfirm: async () => {
                setLoading(true);
                setShowConfirm(false);
                try {
                    await fetch(`${API_URL}/sections/${id}`, {
                        method: "DELETE",
                        headers: getAuthHeaders()
                    });
                    setHighlights(highlights.filter(h => h.id !== id));
                    setMsg({ type: "success", text: "Destaque removido com sucesso." });
                } catch (err) {
                    setMsg({ type: "error", text: "Erro ao remover destaque." });
                } finally {
                    setShowConfirm(false);
                    setConfirming(false);
                    setLoading(false);
                }
            }
        });
    };

    const handleProductCheck = (id) => {
        setNewHighlight(prev => {
            const alreadySelected = prev.productId.includes(id);
            return {
                ...prev,
                productId: alreadySelected
                    ? prev.productId.filter(pid => pid !== id)
                    : [...prev.productId, id]
            };
        });
    };

    useEffect(() => {
        fetch(`${API_URL}/sections`)
            .then(res => res.json())
            .then(data => setHighlights(Array.isArray(data) ? data : []))
            .catch(() => setHighlights([]));
    }, []);

    return (
        document.title = "Gerenciar Destaques | GabyMakes Admin",

        <div className="container mx-auto p-4 sm:p-6 lg:p-8 bg-gray-50 min-h-screen">
            <h2 className="text-3xl font-extrabold text-gray-800 mb-6 text-center">Gerenciar Destaques</h2>
            {(loading) && <LoadingCircles className="mb-4" />}

            {showConfirm && (
                <ConfirmationModal
                    title={confirmTitle}
                    message={confirmMessage}
                    confirmText={confirming ? "Processando..." : "Confirmar"}
                    cancelText="Cancelar"
                    onConfirm={confirmAction}
                    onCancel={() => setShowConfirm(false)}
                    disabled={confirming}
                />
            )}

            {msg && <Message
                type={msg.type}
                message={msg.text}
                onClose={() => setMsg(null)}
            />
            }
            {/* Seção para Adicionar Novo Destaque */}
            <div className="bg-white p-6 rounded-lg shadow-lg mb-8 border border-gray-200">
                <h3 className="text-xl font-semibold text-gray-700 mb-4">Adicionar Nova Seção</h3>
                <div className="flex flex-col gap-4">
                    <input
                        type="text"
                        placeholder="Título da Nova Seção (Ex: Mais Vendidos)"
                        value={newHighlight.title}
                        onChange={e => setNewHighlight({ ...newHighlight, title: e.target.value })}
                        className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-400 text-gray-700"
                        disabled={loading}
                    />

                    <div className="border border-gray-300 rounded-md p-4 bg-gray-50 max-h-80 overflow-y-auto shadow-inner">
                        <p className="text-gray-600 font-medium mb-3">Selecione os produtos para esta seção:</p>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-2 gap-4">
                            {products.length > 0 ? (
                                products.map(prod => (
                                    <label
                                        key={prod.id}
                                        className={`flex items-center gap-3 p-3 border rounded-lg cursor-pointer transition-all duration-200
                                                    ${newHighlight.productId.includes(prod.id)
                                                ? "bg-pink-100 border-pink-400 shadow-md"
                                                : "bg-white border-gray-200 hover:bg-gray-50 hover:shadow-sm"}`}
                                    >
                                        <input
                                            type="checkbox"
                                            checked={newHighlight.productId.includes(prod.id)}
                                            onChange={() => handleProductCheck(prod.id)}
                                            className="form-checkbox h-5 w-5 text-pink-600 rounded focus:ring-pink-500"
                                            disabled={loading}
                                        />
                                        <img
                                            src={prod.imageUrl}
                                            alt={prod.description}
                                            className="w-16 h-16 object-cover rounded-md border border-gray-200"
                                        />
                                        <div>
                                            <div className="font-semibold text-gray-800 text-sm truncate max-w-[150px]">{prod.brand}</div>
                                            <div className="text-xs text-gray-600 truncate max-w-[150px]">{prod.description}</div>
                                        </div>
                                    </label>
                                ))
                            ) : (
                                <p className="col-span-full text-center text-gray-500">Nenhum produto disponível para seleção.</p>
                            )}
                        </div>
                    </div>

                    <button
                        onClick={handleAdd}
                        className="bg-pink-300 cursor-pointer text-gray-900 px-6 py-2 rounded-md self-start font-semibold
                                   hover:bg-pink-400 transition-colors duration-200
                                   disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-pink-500"
                        disabled={loading || !newHighlight.title || newHighlight.productId.length === 0}
                    >
                        {(loading && newHighlight.title) ? "Adicionando..." : "Adicionar Seção"}
                    </button>
                </div>
            </div>

            {/* Lista de Destaques Existentes */}
            <div className="bg-white p-6 rounded-lg shadow-lg border border-gray-200">
                <h3 className="text-xl font-semibold text-gray-700 mb-4">Seções Atuais</h3>
                {highlights.length > 0 ? (
                    <ul className="divide-y divide-gray-200">
                        {highlights.map(h => (
                            <li key={h.id} className="py-6">
                                <div className="flex justify-between items-center mb-4">
                                    <strong className="text-xl font-bold text-gray-800">{h.title}</strong>
                                    <button
                                        onClick={() => handleRemove(h.id)}
                                        className="text-red-600 px-4 py-2 rounded-md border border-red-400
                                                   hover:bg-red-50 hover:text-red-700 transition-colors duration-200
                                                   disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                                        disabled={loading}
                                    >
                                        Remover
                                    </button>
                                </div>
                                <div className="flex flex-wrap gap-4 mt-4">
                                    {h.products && h.products.length > 0 ? (
                                        h.products.map(product => (
                                            <div
                                                key={product.id}
                                                className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg bg-gray-50 shadow-sm w-full sm:w-[calc(50%-8px)] lg:w-[calc(33.33%-10.66px)] xl:w-[calc(25%-12px)]"
                                            >
                                                <img
                                                    src={product.imageUrl}
                                                    alt={product.description}
                                                    className="w-20 h-20 object-cover rounded-md border border-gray-200"
                                                />
                                                <div className="flex-1 overflow-hidden">
                                                    <div className="font-semibold text-gray-800 text-sm truncate">{product.brand} {product.category}</div>
                                                    <div className="text-xs text-gray-600 line-clamp-2">{product.description}</div>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <p className="text-gray-500 text-sm italic">Nenhum produto associado a esta seção.</p>
                                    )}
                                </div>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className="text-center text-gray-600 py-8">Nenhuma seção de destaque cadastrada.</p>
                )}
            </div>
        </div>
    );
}

function getAuthHeaders() {
    const token = localStorage.getItem("accessToken");
    return token
        ? { Authorization: `Bearer ${token}`, "Content-Type": "application/json" }
        : { "Content-Type": "application/json" };
}
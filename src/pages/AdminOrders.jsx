import { useEffect, useState } from "react";
import axios from "axios";
import Loading from "../components/loading";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

export default function AdminOrders() {
    const [orderIdSearch, setOrderIdSearch] = useState("");
    const [order, setOrder] = useState(null);
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");

    const orderStatusMap = {
        PENDING: { label: "Pendente", color: "bg-yellow-100 text-yellow-800" },
        PAID: { label: "Pago", color: "bg-green-100 text-green-800" },
        SHIPPED: { label: "Enviado", color: "bg-blue-100 text-blue-800" },
        CANCELLED: { label: "Cancelado", color: "bg-red-100 text-red-800" },
    };

    const formatDate = (dateString) => {
        if (!dateString) return "-";
        return new Date(dateString).toLocaleString("pt-BR", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    // Buscar lista de pedidos por datas
    const fetchOrders = async () => {
        try {
            setLoading(true);
            setError(null);
            setOrder(null);

            const query = new URLSearchParams();
            if (startDate) query.append("startDate", startDate);
            if (endDate) query.append("endDate", endDate);

            const token = localStorage.getItem("accessToken");
            const response = await axios.get(`${API_BASE_URL}/order?${query.toString()}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setOrders(response.data);
        } catch (err) {
            setError("Erro ao carregar pedidos.");
        } finally {
            setLoading(false);
        }
    };

    // Buscar pedido por ID
    const fetchOrderById = async () => {
        if (!orderIdSearch.trim()) {
            setError("Por favor, informe um ID de pedido.");
            return;
        }

        try {
            setLoading(true);
            setError(null);
            setOrders([]);
            const token = localStorage.getItem("accessToken");
            const response = await axios.get(`${API_BASE_URL}/order/${orderIdSearch.trim()}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setOrder(response.data);
        } catch (err) {
            setError("Pedido não encontrado.");
            setOrder(null);
        } finally {
            setLoading(false);
        }
    };

    // Ao montar o componente, carrega lista padrão
    useEffect(() => {
        fetchOrders();
    }, [startDate, endDate]);

    if (loading) return <Loading />;
    return (
        <div className="p-4 space-y-6">
            {/* Busca por ID */}
            <div className="flex flex-wrap gap-4 items-end bg-gray-50 p-4 rounded-lg shadow-sm">
                <div className="flex-1 min-w-[250px]">
                    <label className="block text-sm font-medium">Buscar Pedido por ID:</label>
                    <input
                        type="text"
                        value={orderIdSearch}
                        onChange={(e) => setOrderIdSearch(e.target.value)}
                        placeholder="Digite o ID do pedido"
                        className="border p-2 rounded w-full"
                    />
                </div>
                <button
                    onClick={fetchOrderById}
                    className="bg-pink-500 text-white px-4 py-2 rounded hover:bg-pink-600 transition"
                >
                    Buscar
                </button>
            </div>

            {/* Filtro de datas */}
            <div className="flex flex-wrap gap-4 items-end bg-gray-50 p-4 rounded-lg shadow-sm">
                <div>
                    <label className="block text-sm font-medium">Data inicial:</label>
                    <input
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        className="border p-2 rounded w-full"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium">Data final:</label>
                    <input
                        type="date"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        className="border p-2 rounded w-full"
                    />
                </div>
                <button
                    onClick={fetchOrders}
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
                >
                    Filtrar
                </button>
            </div>

            {/* Mostrar erro */}
            {error && <p className="text-red-500">{error}</p>}

            {/* Mostrar pedido buscado por ID */}
            {order && (
                <div className="bg-white rounded-lg shadow p-6">
                    <h2 className="text-xl font-bold mb-4">Detalhes do Pedido</h2>
                    <p><strong>ID:</strong> {order.id}</p>
                    <p><strong>Cliente:</strong> {order.customerName}</p>
                    <p><strong>Email:</strong> {order.customerEmail}</p>
                    <p><strong>Endereço:</strong> {order.deliveryAddress}</p>
                    <p>
                        <strong>Status:</strong>{" "}
                        <span className={`${orderStatusMap[order.status]?.color} px-2 py-1 rounded`}>
                            {orderStatusMap[order.status]?.label}
                        </span>
                    </p>
                    <p><strong>Criado em:</strong> {formatDate(order.createdAt)}</p>
                    <p><strong>Atualizado em:</strong> {formatDate(order.updatedAt)}</p>
                    <div className="mt-4">
                        <h3 className="font-semibold mb-2">Itens:</h3>
                        <ul className="list-disc list-inside">
                            {order.items.map((item, index) => (
                                <li key={index}>
                                    {item.product?.description || "Produto"} — Quantidade: {item.quantity} — Preço unitário: R$ {item.unitPrice}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            )}

            {/* Mostrar tabela de pedidos padrão (quando não busca por ID) */}
            {!order && (
                <div className="overflow-x-auto bg-white rounded-lg shadow">
                    <table className="min-w-full border-collapse text-xs">
                        <thead>
                            <tr className="bg-gray-100 text-left text-sm uppercase tracking-wider">
                                <th className="p-3 border">ID</th>
                                <th className="p-3 border">Cliente</th>
                                <th className="p-3 border">Email</th>
                                <th className="p-3 border">Endereço</th>
                                <th className="p-3 border">Itens</th>
                                <th className="p-3 border">Pago em</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orders.map((order) => (
                                <tr key={order.id} className="hover:bg-gray-50 cursor-pointer">
                                    <td className="p-3 border text-xs break-all">{order.id}</td>
                                    <td className="p-3 border">{order.customerName}</td>
                                    <td className="p-3 border">{order.customerEmail}</td>
                                    <td className="p-3 border">{order.deliveryAddress}</td>
                                    <td className="p-3 border text-sm">
                                        {order.items.map((item, index) => (
                                            <div key={index}>
                                                {item.product?.description || "Produto"} <span className="text-gray-500">(x{item.quantity})</span>
                                            </div>
                                        ))}
                                    </td>
                                    <td className="p-3 border text-sm">{formatDate(order.createdAt)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}

import { useEffect, useState } from "react";
import axios from "axios";
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    PieChart, Pie, Cell, Legend,
} from "recharts";
import { FiCalendar, FiDollarSign, FiTrendingUp } from "react-icons/fi";
import Loading from "../components/loading";
import { FaMedal } from "react-icons/fa";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#a855f7', '#f472b6'];

// Helper para formatar valores em reais
function formatCurrency(value) {
    return value.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL",
    });
}

export default function Dashboard() {
    const [ordersData, setOrdersData] = useState([]);
    const [loading, setLoading] = useState(false);

    const [monthlyOrders, setMonthlyOrders] = useState([]);
    const [topProducts, setTopProducts] = useState([]);
    const [topCategories, setTopCategories] = useState([]);
    const [topBrands, setTopBrands] = useState([]);
    const [topRevenueProducts, setTopRevenueProducts] = useState([]);

    const [whatsappClicks, setWhatsappClicks] = useState([]);
    const [productRanking, setProductRanking] = useState([]);

    const [revenueCurrentMonth, setRevenueCurrentMonth] = useState(0);
    const [revenueTotal, setRevenueTotal] = useState(0);
    const [revenueToday, setRevenueToday] = useState(0);

    function truncateText(text, maxLength) {
        if (!text) return "";
        return text.length > maxLength ? text.slice(0, maxLength) + "..." : text;
    }

    useEffect(() => {
        const fetchWhatsappClicks = async () => {
            try {
                const token = localStorage.getItem("accessToken");
                const res = await axios.get(
                    `${API_BASE_URL}/tracking?type=whatsapp_click`,
                    {
                        headers: { Authorization: `Bearer ${token}` },
                    }
                );

                const events = res.data;

                // Agrupa por data para o gráfico
                const groupedByDate = events.reduce((acc, event) => {
                    const date = new Date(event.createdAt).toLocaleDateString("pt-BR");
                    acc[date] = (acc[date] || 0) + 1;
                    return acc;
                }, {});

                const chartData = Object.entries(groupedByDate).map(([date, clicks]) => ({
                    date,
                    clicks,
                }));

                // Agrupa por produto para o ranking
                const groupedByProduct = events.reduce((acc, event) => {
                    if (!event.product) return acc;
                    const id = event.product.id;
                    if (!acc[id]) {
                        acc[id] = { ...event.product, clicks: 0 };
                    }
                    acc[id].clicks += 1;
                    return acc;
                }, {});

                const ranking = Object.values(groupedByProduct)
                    .sort((a, b) => b.clicks - a.clicks).slice(0, 3);

                setWhatsappClicks(chartData);
                setProductRanking(ranking);

            } catch (error) {
                console.error("Erro ao buscar cliques no WhatsApp", error);
            }
        };

        fetchWhatsappClicks();
    }, []);

    useEffect(() => {
        const fetchOrders = async () => {
            setLoading(true);
            try {
                const token = localStorage.getItem("accessToken");
                const res = await axios.get(`${API_BASE_URL}/order`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                const data = res.data;
                setOrdersData(data);

                // Receita total acumulada
                let totalRevenue = 0;
                // Receita do mês atual
                let currentMonthRevenue = 0;
                // Receita do dia atual
                let todayRevenue = 0;

                const today = new Date();
                const currentMonth = today.getMonth();
                const currentYear = today.getFullYear();

                data.forEach(order => {
                    const orderDate = new Date(order.createdAt);
                    const orderDay = orderDate.getDate();
                    const orderMonth = orderDate.getMonth();
                    const orderYear = orderDate.getFullYear();

                    const orderRevenue = order.items.reduce((sum, item) => {
                        return sum + Number(item.unitPrice) * item.quantity;
                    }, 0);

                    totalRevenue += orderRevenue;

                    if (orderYear === currentYear && orderMonth === currentMonth) {
                        currentMonthRevenue += orderRevenue;
                    }

                    if (
                        orderYear === currentYear &&
                        orderMonth === currentMonth &&
                        orderDay === today.getDate()
                    ) {
                        todayRevenue += orderRevenue;
                    }
                });

                setRevenueTotal(totalRevenue);
                setRevenueCurrentMonth(currentMonthRevenue);
                setRevenueToday(todayRevenue);

                // Agrupamento pedidos por mês/ano
                const groupedOrders = data.reduce((acc, order) => {
                    const date = new Date(order.createdAt);
                    const month = date.toLocaleString("pt-BR", { month: "short" });
                    const year = date.getFullYear();
                    const key = `${month} ${year}`;
                    acc[key] = (acc[key] || 0) + 1;
                    return acc;
                }, {});
                const monthsOrder = Object.entries(groupedOrders)
                    .map(([monthYear, count]) => ({ monthYear, count }))
                    .sort((a, b) => {
                        const [monthA, yearA] = a.monthYear.split(" ");
                        const [monthB, yearB] = b.monthYear.split(" ");
                        const months = { jan: 1, fev: 2, mar: 3, abr: 4, mai: 5, jun: 6, jul: 7, ago: 8, set: 9, out: 10, nov: 11, dez: 12 };
                        const dateA = new Date(yearA, months[monthA.toLowerCase()] || 1);
                        const dateB = new Date(yearB, months[monthB.toLowerCase()] || 1);
                        return dateA - dateB;
                    });
                setMonthlyOrders(monthsOrder);

                // Produtos mais vendidos (pizza)
                const productSales = {};
                data.forEach(order => {
                    order.items.forEach(item => {
                        const prod = item.product;
                        if (!prod) return;
                        productSales[prod.description] = (productSales[prod.description] || 0) + item.quantity;
                    });
                });
                setTopProducts(
                    Object.entries(productSales)
                        .map(([description, quantity]) => ({
                            name: description,
                            value: quantity
                        }))
                        .sort((a, b) => b.value - a.value)
                        .slice(0, 5)
                );

                // Categorias mais vendidas (pizza)
                const categorySales = {};
                data.forEach(order => {
                    order.items.forEach(item => {
                        const cat = item.product?.category || "Sem categoria";
                        categorySales[cat] = (categorySales[cat] || 0) + item.quantity;
                    });
                });
                setTopCategories(
                    Object.entries(categorySales)
                        .map(([category, quantity]) => ({ name: category, value: quantity }))
                        .sort((a, b) => b.value - a.value)
                        .slice(0, 5)
                );

                // Marcas mais populares (pizza)
                const brandSales = {};
                data.forEach(order => {
                    order.items.forEach(item => {
                        const brand = item.product?.brand || "Sem marca";
                        brandSales[brand] = (brandSales[brand] || 0) + item.quantity;
                    });
                });
                setTopBrands(
                    Object.entries(brandSales)
                        .map(([brand, quantity]) => ({ name: brand, value: quantity }))
                        .sort((a, b) => b.value - a.value)
                        .slice(0, 5)
                );

                // Produtos com maior receita (pizza)
                const productRevenue = {};
                data.forEach(order => {
                    order.items.forEach(item => {
                        const prod = item.product;
                        if (!prod) return;
                        const revenue = Number(item.unitPrice) * item.quantity;
                        productRevenue[prod.description] = (productRevenue[prod.description] || 0) + revenue;
                    });
                });
                setTopRevenueProducts(
                    Object.entries(productRevenue)
                        .map(([description, revenue]) => ({ name: truncateText(description, 20), value: revenue }))
                        .sort((a, b) => b.value - a.value)
                        .slice(0, 5)
                );
                setLoading(false);
            } catch (error) {
                setLoading(false);
                console.error("Erro ao buscar pedidos para dashboard", error);
            }
        };
        fetchOrders();
    }, []);

    document.title = 'Dashboard | GabyMakes Admin'


    if (loading) return <Loading className="mb-4" />;

    return (
        <div className="flex flex-col p-4 space-y-10">

            <h1 className="text-2xl font-bold mb-6">Dashboard de Vendas</h1>

            {/* Painel inicial de receitas */}
            <section className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
                <div className="bg-pink-100 rounded-lg p-6 flex flex-col items-center shadow-md">
                    <FiCalendar className="text-4xl mb-2 text-pink-700" />
                    <h3 className="text-lg font-semibold mb-1">Receita do Mês Atual</h3>
                    <p className="text-2xl font-bold text-pink-700">{formatCurrency(revenueCurrentMonth)}</p>
                </div>

                <div className="bg-green-100 rounded-lg p-6 flex flex-col items-center shadow-md">
                    <FiDollarSign className="text-4xl mb-2 text-green-700" />
                    <h3 className="text-lg font-semibold mb-1">Receita Total Acumulada</h3>
                    <p className="text-2xl font-bold text-green-700">{formatCurrency(revenueTotal)}</p>
                </div>

                <div className="bg-blue-100 rounded-lg p-6 flex flex-col items-center shadow-md">
                    <FiTrendingUp className="text-4xl mb-2 text-blue-700" />
                    <h3 className="text-lg font-semibold mb-1">Receita de Hoje</h3>
                    <p className="text-2xl font-bold text-blue-700">{formatCurrency(revenueToday)}</p>
                </div>
            </section>

            {/* Linha 1: gráfico de pedidos por mês - barra */}
            <section>
                <h2 className="text-lg font-semibold mb-3 text-center">Volume de Pedidos por Mês</h2>
                <div className="w-full h-72">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={monthlyOrders} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="monthYear" />
                            <YAxis allowDecimals={false} />
                            <Tooltip formatter={(value) => [`${value} pedidos`, "Quantidade"]} />
                            <Bar dataKey="count" fill="#f472b6" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </section>

            {/* Linha 2: Produtos e Categorias lado a lado - pizza charts */}
            <section className="flex items-start justify-between flex-wrap gap-6 h-[500px]">
                <div className="flex-1 w-[300px] max-w-[50%] h-full border-gray-500 border-[1px] rounded-[5px] p-[5px]">
                    <h2 className="text-lg font-semibold mb-3 text-center">Produtos Mais Vendidos</h2>
                    <ResponsiveContainer width="100%" height="90%">
                        <PieChart>
                            <Pie
                                data={topProducts}
                                dataKey="value"
                                nameKey="name"
                                cx="50%"
                                cy="50%"
                                outerRadius={90}
                                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                labelLine={false}
                            >
                                {topProducts.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip formatter={(value) => [value, "Quantidade"]} />
                        </PieChart>
                    </ResponsiveContainer>
                </div>

                <div className="flex-1 w-[300px] max-w-[50%] h-full border-gray-500 border-[1px] rounded-[5px] p-[5px]">
                    <h2 className="text-lg font-semibold mb-3 text-center">Categorias com Maior Volume de Vendas</h2>
                    <ResponsiveContainer width="100%" height="90%">
                        <PieChart>
                            <Pie
                                data={topCategories}
                                dataKey="value"
                                nameKey="name"
                                cx="50%"
                                cy="50%"
                                outerRadius={90}
                                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                labelLine={false}
                            >
                                {topCategories.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip formatter={(value) => [value, "Quantidade"]} />
                            <Legend />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </section>

            {/* Linha 3: Marcas e Receita lado a lado - pizza charts */}
            <section className="flex items-start justify-between flex-wrap gap-6 h-[500px]">
                <div className="flex-1 w-[300px] max-w-[50%] h-full border-gray-500 border-[1px] rounded-[5px] p-[5px]">
                    <h2 className="text-lg font-semibold mb-3 text-center">Marcas Mais Populares</h2>
                    <ResponsiveContainer width="100%" height="90%">
                        <PieChart>
                            <Pie
                                data={topBrands}
                                dataKey="value"
                                nameKey="name"
                                cx="50%"
                                cy="50%"
                                outerRadius={90}
                                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                labelLine={false}
                            >
                                {topBrands.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip formatter={(value) => [value, "Quantidade"]} />
                            <Legend />
                        </PieChart>
                    </ResponsiveContainer>
                </div>

                <div className="flex-1 w-[300px] max-w-[50%] h-full border-gray-500 border-[1px] rounded-[5px] p-[5px]">
                    <h2 className="text-lg font-semibold mb-3 text-center">Produtos com Maior Receita</h2>
                    <ResponsiveContainer width="100%" height="90%">
                        <PieChart>
                            <Pie
                                data={topRevenueProducts}
                                dataKey="value"
                                nameKey="name"
                                cx="50%"
                                cy="50%"
                                outerRadius={90}
                                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                labelLine={false}
                            >
                                {topRevenueProducts.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip formatter={(value) => [`R$ ${value.toFixed(2)}`, "Receita"]} />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </section>

            <section className="mt-10 h-max">
                {/* Gráfico */}
                <div className="w-full h-72 mb-8 border-gray-500 border-[1px] rounded-[5px] p-[5px]">
                    <h2 className="text-lg font-semibold mb-3 text-center">
                        Pedidos via WhatsApp
                    </h2>
                    <ResponsiveContainer width="100%" height="90%">
                        <BarChart data={whatsappClicks} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="date" />
                            <YAxis allowDecimals={false} />
                            <Tooltip formatter={(value) => [`${value} cliques`, "Cliques"]} />
                            <Bar dataKey="clicks" fill="#25D366" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                {/* Ranking de produtos */}
                <div className="border-gray-500 border-[1px] rounded-[5px] p-[5px]">
                    <h2 className="text-lg font-semibold mb-3 text-center">
                        Produtos mais pedidos via Whatsapp
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {productRanking.map((product, index) => {
                            // Define cor das medalhas
                            let medalColor = '';
                            if (index === 0) medalColor = 'text-yellow-400'; // 1º lugar - ouro
                            else if (index === 1) medalColor = 'text-gray-400'; // 2º lugar - prata
                            else if (index === 2) medalColor = 'text-orange-500'; // 3º lugar - bronze

                            return (
                                <div
                                    key={product.id}
                                    className="relative flex items-center p-4 border rounded-lg shadow-sm bg-white"
                                >
                                    {/* Medalha do ranking */}
                                    {index < 3 && (
                                        <FaMedal
                                            className={`absolute top-2 left-2 w-6 h-6 ${medalColor}`}
                                            title={`${index + 1}º lugar`}
                                        />
                                    )}

                                    <img
                                        src={product.imageUrl}
                                        alt={product.description}
                                        className="w-16 h-16 object-cover rounded"
                                    />
                                    <div className="ml-4 flex-1">
                                        <h4 className="text-sm font-medium">{product.description}</h4>
                                        <p className="text-xs text-gray-500">
                                            {product.brand} — {product.category}
                                        </p>
                                        <p className="text-green-600 font-semibold">{product.clicks} cliques</p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>


        </div>
    );
}

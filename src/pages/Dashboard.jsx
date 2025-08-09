import { useEffect, useState } from "react";
import axios from "axios";
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    PieChart, Pie, Cell, Legend,
} from "recharts";
import { FiCalendar, FiDollarSign, FiTrendingUp } from "react-icons/fi";
import Loading from "../components/loading";

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

    // Novos estados para receita
    const [revenueCurrentMonth, setRevenueCurrentMonth] = useState(0);
    const [revenueTotal, setRevenueTotal] = useState(0);
    const [revenueToday, setRevenueToday] = useState(0);

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
                        .map(([description, quantity]) => ({ name: description, value: quantity }))
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
                        .map(([description, revenue]) => ({ name: description, value: revenue }))
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
                <h2 className="text-lg font-semibold mb-3">Volume de Pedidos por Mês</h2>
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
            <section className="flex items-center justify-center flex-wrap gap-6">
                <div className="flex-1 w-[300px] max-w-[50%] h-64">
                    <h2 className="text-lg font-semibold mb-3">Produtos Mais Vendidos</h2>
                    <ResponsiveContainer width="100%" height="100%">
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
                            <Legend />
                        </PieChart>
                    </ResponsiveContainer>
                </div>

                <div className="flex-1 w-[300px] max-w-[600px] h-64">
                    <h2 className="text-lg font-semibold mb-3">Categorias com Maior Volume de Vendas</h2>
                    <ResponsiveContainer width="100%" height="100%">
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
            <section className="flex items-center justify-center flex-wrap gap-6">
                <div className="flex flex-col flex-1 w-[300px] max-w-[600px] h-64">
                    <h2 className="text-lg font-semibold mb-3">Marcas Mais Populares</h2>
                    <ResponsiveContainer width="100%" height="100%">
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

                <div className="flex flex-col flex-1 w-[300px] max-w-[50%] h-64">
                    <h2 className="text-lg font-semibold mb-3">Produtos com Maior Receita</h2>
                    <ResponsiveContainer width="100%" height="100%">
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
                            <Legend />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </section>
        </div>
    );
}

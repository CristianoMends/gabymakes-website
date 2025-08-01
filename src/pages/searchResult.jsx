import { useState, useEffect, useCallback } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import Header from '../components/header';
import Footer from '../components/footer';
import ProductCard from '../components/productcard';
import Breadcrumb from '../components/breadcrumb';
import LoadingCircles from '../components/loading';
import Message from '../components/message';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export default function SearchResult() {
    const [searchParams, setSearchParams] = useSearchParams();
    const initialQuery = searchParams.get('q') || '';

    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [productCount, setProductCount] = useState(0);
    const [userId, setUserId] = useState(null);


    const [dynamicCategories, setDynamicCategories] = useState([]);
    const [dynamicBrands, setDynamicBrands] = useState([]);
    const [filters, setFilters] = useState({
        brand: searchParams.get('brand') || '',
        category: searchParams.get('category') || '',
        priceMin: searchParams.get('priceMin') || '',
        priceMax: searchParams.get('priceMax') || '',
    });

    const [sortOrder, setSortOrder] = useState(searchParams.get('sort') || '');

    useEffect(() => {
        const fetchFilterOptions = async () => {
            try {

                const categoriesRes = await fetch(`${API_URL}/products/categories/unique`);
                if (!categoriesRes.ok) throw new Error('Falha ao buscar categorias.');
                const categoriesData = await categoriesRes.json();
                setDynamicCategories(categoriesData);


                const brandsRes = await fetch(`${API_URL}/products/brands/unique`);
                if (!brandsRes.ok) throw new Error('Falha ao buscar marcas.');
                const brandsData = await brandsRes.json();
                setDynamicBrands(brandsData);

            } catch (err) {
                console.error("Erro ao carregar opções de filtro:", err);

            }
        };

        fetchFilterOptions();
    }, []);


    const fetchProducts = useCallback(async () => {
        setLoading(true);
        setError(null);
        setProducts([]);
        setProductCount(0);

        const params = new URLSearchParams();
        if (initialQuery) params.append('description', initialQuery);
        if (filters.brand) params.append('brand', filters.brand);
        if (filters.category) params.append('category', filters.category);
        if (filters.priceMin) params.append('priceMin', filters.priceMin);
        if (filters.priceMax) params.append('priceMax', filters.priceMax);

        const queryString = params.toString();
        const url = `${API_URL}/products/search?${queryString}`;

        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`Erro ao buscar produtos: ${response.statusText}`);
            }
            const data = await response.json();

            let sortedData = [...data];
            if (sortOrder === 'price_asc') {
                sortedData.sort((a, b) => parseFloat(a.price) - parseFloat(b.price));
            } else if (sortOrder === 'price_desc') {
                sortedData.sort((a, b) => parseFloat(b.price) - parseFloat(a.price));
            }

            setProducts(sortedData);
            setProductCount(sortedData.length);
        } catch (err) {
            console.error("Falha na busca de produtos:", err);
            setError("Não foi possível carregar os resultados da busca. Tente novamente.");
        } finally {
            setLoading(false);
        }
    }, [initialQuery, filters, sortOrder]);

    useEffect(() => {
        fetchProducts();

        const newSearchParams = new URLSearchParams();
        if (initialQuery) newSearchParams.set('q', initialQuery);
        if (filters.brand) newSearchParams.set('brand', filters.brand);
        if (filters.category) newSearchParams.set('category', filters.category);
        if (filters.priceMin) newSearchParams.set('priceMin', filters.priceMin);
        if (filters.priceMax) newSearchParams.set('priceMax', filters.priceMax);
        if (sortOrder) newSearchParams.set('sort', sortOrder);
        setSearchParams(newSearchParams);
    }, [fetchProducts, filters, sortOrder, initialQuery, setSearchParams]);

    useEffect(() => {
        const storedUserId = localStorage.getItem('userId');
        if (storedUserId) {
            setUserId(storedUserId);
        }
    }, []);

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters(prev => ({ ...prev, [name]: value }));
    };

    const handleSortChange = (e) => {
        setSortOrder(e.target.value);
    };

    document.title = initialQuery ? `Busca por "${initialQuery}" | GabyMakes` : "Resultados da Busca | GabyMakes";

    return (
        <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-1">
                <div className="container mx-auto px-4 py-6">
                    <Breadcrumb />

                    <h1 className="text-2xl font-bold text-gray-800 mb-6">
                        Você buscou por: <span className="italic font-normal text-pink-600">"{initialQuery.replaceAll('_', ' ')}"</span>
                    </h1>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center mb-8 p-4 border-y border-gray-200 bg-gray-50 rounded-md shadow-sm">
                        <div className="flex flex-wrap gap-3 justify-center md:justify-start">
                            <select
                                name="category"
                                value={filters.category}
                                onChange={handleFilterChange}
                                className="border rounded-md p-2 text-sm focus:outline-none focus:ring-2 focus:ring-pink-400 w-full sm:w-auto"
                            >
                                <option value="">Todas as Categorias</option>
                                {dynamicCategories.map(cat => (
                                    <option key={cat} value={cat}>{cat}</option>
                                ))}
                            </select>

                            <select
                                name="brand"
                                value={filters.brand}
                                onChange={handleFilterChange}
                                className="border rounded-md p-2 text-sm focus:outline-none focus:ring-2 focus:ring-pink-400 w-full sm:w-auto"
                            >
                                <option value="">Todas as Marcas</option>
                                {dynamicBrands.map(brand => (
                                    <option key={brand} value={brand}>{brand}</option>
                                ))}
                            </select>

                            <div className="flex items-center gap-2 w-full sm:w-auto">
                                <input
                                    type="number"
                                    name="priceMin"
                                    value={filters.priceMin}
                                    onChange={handleFilterChange}
                                    placeholder="Preço Mín."
                                    className="border rounded-md p-2 text-sm w-1/2 focus:outline-none focus:ring-2 focus:ring-pink-400"
                                    min="0"
                                    step="0.01"
                                />
                                <span className="text-gray-500">-</span>
                                <input
                                    type="number"
                                    name="priceMax"
                                    value={filters.priceMax}
                                    onChange={handleFilterChange}
                                    placeholder="Preço Máx."
                                    className="border rounded-md p-2 text-sm w-1/2 focus:outline-none focus:ring-2 focus:ring-pink-400"
                                    min="0"
                                    step="0.01"
                                />
                            </div>
                        </div>

                        <div className="text-center text-gray-700 font-medium order-first md:order-none">
                            <p><strong>{productCount}</strong> produtos encontrados</p>
                        </div>

                        <div className="flex justify-center md:justify-end">
                            <select
                                value={sortOrder}
                                onChange={handleSortChange}
                                className="border rounded-md p-2 text-sm w-full md:w-auto focus:outline-none focus:ring-2 focus:ring-pink-400"
                            >
                                <option value="relevance">Ordenar por: Relevância</option>
                                <option value="price_asc">Menor Preço</option>
                                <option value="price_desc">Maior Preço</option>
                            </select>
                        </div>
                    </div>

                    <div className="mt-8">
                        {loading ? (
                            <div className="flex justify-center items-center h-40">
                                <LoadingCircles />
                            </div>
                        ) : error ? (
                            <div className="flex justify-center items-center h-40 text-red-600">
                                <Message type="error" message={error} />
                            </div>
                        ) : products.length > 0 ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                                {products.map(product => (
                                    <ProductCard key={product.id} product={product} userId={userId} />
                                ))}
                            </div>
                        ) : (
                            <div className="text-center text-gray-600 py-10">
                                <p className="text-xl font-semibold mb-2">Nenhum produto encontrado para sua busca.</p>
                                <p>Tente ajustar os filtros ou pesquisar por outro termo.</p>
                                <Link to="/" className="text-pink-600 hover:underline mt-4 block">Voltar à página inicial</Link>
                            </div>
                        )}
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}
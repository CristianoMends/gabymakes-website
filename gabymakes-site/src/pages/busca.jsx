import { useSearchParams, Link } from 'react-router-dom';
import Header from '../components/header';
import Footer from '../components/footer';
import ProductList from '../components/productList';

export default function Busca() {
    const [searchParams] = useSearchParams();
    const query = searchParams.get('q') || '';

    document.title = `Busca por "${query}" | GabyMakes e acessórios`;

    return (
        <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-1">
                {/* Category Bar */}
                <div className="bg-pink-200 py-3 shadow-md">
                    <nav className="container mx-auto flex justify-between items-center text-sm md:text-base">
                        <a href="#" className="text-black font-semibold hover:text-pink-600 transition-colors">Novidades</a>
                        <a href="#" className="text-black font-semibold hover:text-pink-600 transition-colors">Maquiagens</a>
                        <a href="#" className="text-black font-semibold hover:text-pink-600 transition-colors">Cabelos</a>
                        <a href="#" className="text-black font-semibold hover:text-pink-600 transition-colors">Skincare</a>
                    </nav>
                </div>

                <div className="container mx-auto px-4 py-6">
                    {/* Breadcrumbs */}
                    <div className="text-sm text-gray-500 mb-4">
                        <Link to="/" className="hover:underline">Home</Link> &gt; <span className="font-semibold text-gray-700">{query}</span>
                    </div>

                    {/* Search Title */}
                    <h1 className="text-2xl font-bold text-black mb-6">
                        Você buscou por: <span className="italic font-normal">{query}</span>
                    </h1>

                    {/* Controls Section */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center mb-8 p-4 border-y border-gray-200">
                        {/* Filters */}
                        <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                            <button className="px-4 py-2 border rounded-md text-sm font-medium hover:bg-gray-100 transition-colors">Faixa de Preço</button>
                            <button className="px-4 py-2 border rounded-md text-sm font-medium hover:bg-gray-100 transition-colors">Marca</button>
                        </div>

                        {/* Product Count */}
                        <div className="text-center text-gray-600 order-first md:order-none">
                            <p><strong>123</strong> produtos encontrados</p> {/* Mockup count */}
                        </div>

                        {/* Sorting */}
                        <div className="flex justify-center md:justify-end">
                            <select className="border rounded-md p-2 text-sm w-full md:w-auto">
                                <option>Ordenar por: Relevância</option>
                                <option>Menor Preço</option>
                                <option>Maior Preço</option>
                            </select>
                        </div>
                    </div>

                    {/* Product List */}
                    <div>
                        <h2 className="text-xl font-bold mb-4">Resultados</h2>
                        <ProductList /> {/* Este componente precisará ser adaptado para receber os filtros */}
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}
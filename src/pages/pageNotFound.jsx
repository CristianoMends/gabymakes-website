import { Link } from 'react-router-dom';

const PageNotFound = () => {
    return (
        document.title = "Página não encontrada | GabyMakes",
        <div className="min-h-screen bg-white flex flex-col justify-center items-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full">
                <div className="text-center">
                    <h1 className="text-6xl font-bold mb-4" style={{ color: 'black' }}
                    >404</h1>
                    <p className="text-xl text-gray-700 mb-6">Oops! A página que você procura não foi encontrada.</p>
                    <Link
                        to="/"
                        style={{ background: '#fda5d5' , color: 'black'}}
                        className="inline-flex items-center hover:bg-pink-700 text-white font-bold py-3 px-6 rounded focus:outline-none focus:shadow-outline"
                    >
                        Voltar para a página inicial
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default PageNotFound;
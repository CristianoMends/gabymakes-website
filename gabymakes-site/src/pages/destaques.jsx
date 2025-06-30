import Banner from "../components/banner";
import Footer from "../components/footer";
import Header from "../components/header";

export default function Destaques() {
    document.title = "Destaques | GabyMakes e acessórios"
    return (
        <div className="flex flex-col">
            <Header />
            <div className="flex-1 flex-col">
                <div className="w-full">
                    <Banner />
                </div>

                <h2 className="text-2xl font-bold text-center p-8">Seções em Destaque</h2>

                <div className="flex flex-wrap justify-center gap-6 p-6">
                    {/* Seção 1 */}
                    <div className="p-10 rounded-lg shadow-md bg-pink-50 hover:shadow-xl transition-shadow">
                        <h3 className="text-lg font-semibold text-gray-700">Presentes de dia das Mães</h3>
                    </div>
                    {/* Seção 2 */}
                    <div className="p-10 rounded-lg shadow-md bg-red-50 hover:shadow-xl transition-shadow">
                        <h3 className="text-lg font-semibold text-gray-700">Presente para a Namorada</h3>
                    </div>
                    {/* Seção 3 */}
                    <div className="p-10 rounded-lg shadow-md bg-purple-50 hover:shadow-xl transition-shadow">
                        <h3 className="text-lg font-semibold text-gray-700">Kits Especiais</h3>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    )
}
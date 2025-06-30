import Banner from "../components/banner";
import Footer from "../components/footer";
import Header from "../components/header";
import { Link } from "react-router-dom";
import ProductList from "../components/productList";

export default function Home() {
  document.title = "GabyMakes e acessórios | Loja online de cosméticos e Beleza"
  return (
    <div className="flex flex-col">
      <Header />
      <div className="h-screen flex-1 flex-col">
        <div className="w-full">
          <Banner />
        </div>

        <div className="text-center my-8">
          <h2 className="inline-block">
            <Link to="/destaques" className="text-2xl font-bold text-gray-800 pb-2 border-b-4 border-pink-300 hover:text-pink-500 hover:border-pink-500 transition-all duration-300">
              Seções em destaque
            </Link>
          </h2>
        </div>

        <hr className="w-11/12 mx-auto border-gray-200" />

        <div className="p-6">
          <ProductList />
        </div>
      </div>
      <Footer />
    </div>
  )
}

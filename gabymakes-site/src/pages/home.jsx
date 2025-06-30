import Banner from "../components/banner";
import Footer from "../components/footer";
import Header from "../components/header";
import ProductCard from "../components/productcard";
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

        <h2 className="text-lg bold font-bold p-4 self-center">Presentes Dia das Mães</h2>

        <div className="p-6">
          <ProductList />
        </div>
      </div>
      <Footer />
    </div>
  )
}

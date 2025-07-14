import Banner from "../components/banner";
import CategoriesBar from "../components/CategoriesBar";
import Footer from "../components/footer";
import Header from "../components/header";
import Highlights from "../components/Highlights";

export default function Home() {
  document.title = "GabyMakes e acessórios | Loja online de cosméticos e Beleza"
  return (
    <div className="flex flex-col">
      <Header />
      <div className="h-screen flex-1 flex-col">
        <CategoriesBar />

        <div className="w-full">
          <Banner />
        </div>

        <hr className="w-11/12 mx-auto border-none" />

        <Highlights />
      </div>
      <Footer />
    </div>
  )
}

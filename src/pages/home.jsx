import Banner from "../components/banner";
import CategoriesBar from "../components/CategoriesBar";
import Footer from "../components/footer";
import Header from "../components/header";
import Highlights from "../components/Highlights";

export default function Home() {
  document.title = "GabyMakes e acessórios | Loja online de cosméticos e Beleza"
  return (
    <div className="flex flex-col">
      <title>GabyMakes e acessórios | Loja online de cosméticos e Beleza</title>
      <meta name="description" content="Seja bem-vindo à nossa loja online de cosméticos e beleza. Encontre os melhores produtos e acessórios na GabyMakes." />
      <link rel="canonical" href="https://gabymakes-website-git-develop-cristianos-projects-14338c05.vercel.app/" />

      <meta property="og:title" content="GabyMakes e acessórios | Loja Online" />
      <meta property="og:description" content="Seja bem-vindo à nossa loja online de cosméticos e beleza" />
      <meta property="og:image" content="https://0x7zklkxioygivfm.public.blob.vercel-storage.com/web-app-manifest-512x512.png" />
      <meta property="og:url" content="https://gabymakes-website-git-develop-cristianos-projects-14338c05.vercel.app/" />
      <meta property="og:type" content="website" />

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

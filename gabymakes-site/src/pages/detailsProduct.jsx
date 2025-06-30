import { useState } from 'react'
import Header from '../components/header'
import Footer from '../components/footer'

export default function ProductDetailPage() {
  const [quantity, setQuantity] = useState(1)

  const product = {
    name: 'ESSENTIELLE PARIS',
    description: `Luminoso Rosado Eau De Parfum – 50ml
Fragrância Floral Amadeirada com notas de Rosa Damascena, Jasmim Egípcio e Sândalo Australiano com base de Patchouli.`,
    price: 189.9,
    image: '/path/to/image.jpg'
  }

  const relatedProducts = Array(4).fill(product)

  return (
    <div className="bg-white text-gray-800">
      {/* Header */}
      <Header></Header>

      {/* Produto */}
      <main className="max-w-6xl mx-auto px-4 py-10">
        <p className="text-sm text-gray-500 mb-4">
          Home &gt; Perfumes &gt; {product.name}
        </p>
        <div className="grid md:grid-cols-2 gap-10">
          <img
            src={product.image}
            alt={product.name}
            className="w-full border-2 border-blue-400 rounded"
          />
          <div>
            <h1 className="text-2xl font-bold mb-2">{product.name}</h1>
            <p className="text-sm whitespace-pre-line mb-4">
              {product.description}
            </p>
            <p className="text-lg font-bold mb-2">
              R$ {product.price.toFixed(2)}
            </p>
            <p className="text-xs text-gray-500 mb-4">
              ou 3x de R$ {(product.price / 3).toFixed(2)} sem juros
            </p>

            <div className="mb-6">
              <label className="block mb-2 font-semibold">Quantidade:</label>
              <div className="flex items-center gap-2 w-fit border rounded px-2 py-1">
                <button
                  type="button"
                  onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
                  className="text-xl font-bold px-2 text-pink-500 hover:text-pink-700"
                >
                  −
                </button>
                <span className="w-8 text-center">{quantity}</span>
                <button
                  type="button"
                  onClick={() => setQuantity(prev => prev + 1)}
                  className="text-xl font-bold px-2 text-pink-500 hover:text-pink-700"
                >
                  +
                </button>
              </div>
            </div>

            <div className="flex gap-4">
              <button className="bg-[#FFA5BD] text-white px-6 py-2 rounded shadow cursor-pointer">
                comprar agora
              </button>
              <button className="bg-[#FFA5BD] text-white px-6 py-2 rounded shadow cursor-pointer">
                adicionar à sacola
              </button>
            </div>
          </div>
        </div>

        {/* Produtos relacionados */}
        <section className="mt-16">
          <h2 className="text-center font-semibold mb-6">
            QUEM VIU ESTE PRODUTO, TAMBÉM SE INTERESSA POR
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {relatedProducts.map((item, idx) => (
              <div key={idx} className="text-center">
                <img
                  src={item.image}
                  alt={item.name}
                  className="mx-auto w-28 h-28 object-cover"
                />
                <h3 className="font-semibold text-sm mt-2">{item.name}</h3>
                <p className="text-xs">{item.description.split('\n')[0]}</p>
                <p className="font-bold mt-1">R$ {item.price.toFixed(2)}</p>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* Rodapé */}
      <Footer></Footer>
    </div>
  )
}

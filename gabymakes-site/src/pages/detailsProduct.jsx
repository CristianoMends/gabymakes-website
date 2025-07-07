import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Header from '../components/header';
import Footer from '../components/footer';
import Breadcrumb from '../components/breadcrumb';
import LoadingCircles from '../components/loading';
import Message from '../components/message';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export default function ProductDetailPage() {
  const { id } = useParams();

  /* ---------------- estado ---------------- */
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);

  /* dados de login */
  const [userId, setUserId] = useState(null);

  /* ------------ fetch produto ------------ */
  useEffect(() => {
    async function fetchProduct() {
      try {
        setLoading(true);
        const res = await fetch(`${API_BASE_URL}/products/${id}`);
        if (!res.ok) throw new Error('Produto não encontrado');
        const data = await res.json();
        // converte preço string → número
        if (typeof data.price === 'string')
          data.price = parseFloat(data.price.replace(',', '.'));
        setProduct(data);
      } catch (err) {
        setError(err.message || 'Erro ao carregar produto');
      } finally {
        setLoading(false);
      }
    }
    fetchProduct();
  }, [id]);

  /* ------------ checa login ------------ */
  useEffect(() => {
    const currentUserString = localStorage.getItem('currentUser');
    const accessToken = localStorage.getItem('accessToken');
    if (currentUserString && accessToken) {
      try {
        const currentUser = JSON.parse(currentUserString);
        setUserId(currentUser.id || null);
      } catch {
        setUserId(null);
      }
    } else {
      setUserId(null);
    }
  }, []);

  /* ------------ adicionar à sacola ------------ */
  const handleAddToCart = async () => {
    if (!product) return;
    if (userId) {
      // usuário logado → API
      try {
        const res = await fetch(`${API_BASE_URL}/cart-item/add`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId,
            productId: product.id,
            quantity,
          }),
        });
        if (!res.ok) {
          const err = await res.json();
          throw new Error(err.message || 'Falha ao adicionar');
        }
        setMessage({ type: 'success', text: 'Produto adicionado à sacola!' });
        window.dispatchEvent(new Event('cartUpdated'));
      } catch (err) {
        setMessage({ type: 'error', text: err.message });
      }
    } else {
      // visitante → localStorage
      const cartString = localStorage.getItem('cart');
      const cart = cartString ? JSON.parse(cartString) : [];
      const item = cart.find(i => i.id === product.id);
      if (item) item.quantity += quantity;
      else
        cart.push({
          id: product.id,
          name: product.name,
          price: product.price,
          imageUrl: product.imageUrl,
          quantity,
        });
      localStorage.setItem('cart', JSON.stringify(cart));
      window.dispatchEvent(new Event('cartUpdated'));
      setMessage({ type: 'success', text: 'Produto adicionado à sacola!' });
    }
  };

  /* ------------ UI ------------ */
  if (loading) return <LoadingCircles />;
  if (error) return <p className="text-red-600">{error}</p>;
  if (!product) return null;

  return (
    <div className="bg-white text-gray-800">
      <Header />
      <main className="max-w-6xl mx-auto px-4 py-10">
        <Breadcrumb />
        <div className="grid md:grid-cols-2 gap-10">
          <img
            src={product.imageUrl || '/default-image.jpg'}
            alt={product.name}
            className="w-full rounded"
          />
          <div>
            <h1 className="text-2xl font-bold mb-2">{product.brand}</h1>
            <p className="text-sm whitespace-pre-line mb-4">{product.description}</p>
            <p className="text-lg font-bold mb-2">
              R$ {product.price.toFixed(2).replace('.', ',')}
            </p>
            <p className="text-xs text-gray-500 mb-4">
              ou 3x de R$ {(product.price / 3).toFixed(2).replace('.', ',')} sem juros
            </p>

            <div className="mb-6">
              <label className="block mb-2 font-semibold">Quantidade:</label>
              <div className="flex items-center gap-2 w-fit border rounded px-2 py-1">
                <button
                  type="button"
                  onClick={() => setQuantity(q => Math.max(1, q - 1))}
                  className="text-xl cursor-pointer font-bold px-2 text-pink-500 hover:text-pink-700"
                >
                  −
                </button>
                <span className="w-8 text-center">{quantity}</span>
                <button
                  type="button"
                  onClick={() => setQuantity(q => q + 1)}
                  className="text-xl font-bold cursor-pointer px-2 text-pink-500 hover:text-pink-700"
                >
                  +
                </button>
              </div>
            </div>

            <div className="flex gap-4">
              <button className="bg-[#FFA5BD] cursor-pointer text-white px-6 py-2 rounded shadow hover:bg-[#ff8cae] transition-colors duration-300">
                comprar agora
              </button>
              <button
                onClick={handleAddToCart}
                className="bg-[#FFA5BD] cursor-pointer text-white px-6 py-2 rounded shadow hover:bg-[#ff8cae] transition-colors duration-300"
              >
                adicionar à sacola
              </button>
            </div>
          </div>
        </div>
      </main>
      <Footer />

      {message && (
        <Message
          type={message.type}
          message={message.text}
          onClose={() => setMessage(null)}
        />
      )}
    </div>
  );
}

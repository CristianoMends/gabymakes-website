import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Header from '../components/header';
import Footer from '../components/footer';
import Breadcrumb from '../components/breadcrumb';
import LoadingCircles from '../components/loading';
import Message from '../components/message';
import { useNavigate } from 'react-router-dom';
import InnerImageZoom from 'react-inner-image-zoom';
import 'react-inner-image-zoom/lib/styles.min.css'
import ConfirmationModal from '../components/confirmationModal';
import { FaWhatsapp } from 'react-icons/fa';
import { MdOutlineShoppingBag } from "react-icons/md";
import { BiPurchaseTagAlt } from "react-icons/bi";
import RelatedProducts from '../components/relatedProducts';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export default function ProductDetailPage() {
  const { id } = useParams();

  /* ---------------- estado ---------------- */
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const navigate = useNavigate();
  const [confirmation, setConfirmation] = useState(false);

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
        setIsLoggedIn(true);
      } catch {
        setUserId(null);
        setIsLoggedIn(false);
      }
    } else {
      setUserId(null);
      setIsLoggedIn(false);
    }
  }, []);

  const handleBuyNow = () => {
    /*if (!isLoggedIn || !userId) {
      setConfirmation(true);
      return;
    }*/
    const url = `/buynow/${userId}?productId=${id}&quantity=${quantity}`;

    navigate(url);
  }

  const sendProductWhatsappMessage = async () => {
    if (!product) return;

    try {
      await fetch(`${API_BASE_URL}/tracking`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "whatsapp_click",
          product: { id: product.id },
          quantity,
          user: { id: userId } || null,
        }),
      });
    } catch (err) {
      console.error("Falha ao registrar evento no tracking:", err);
    }

    const textoProduto = `🛍️ ${(product.description || '').slice(0, 100)}\nQuantidade: ${quantity}x\n💰 Preço unitário: R$ ${(product.price - (product.price * (product.discount / 100))).toFixed(2).replace('.', ',')}`;

    const mensagem = encodeURIComponent(
      `👋 Olá!\nGostaria de fazer o pedido:\n\n${textoProduto}\n\n`
    );

    const isMobile = /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

    const phone = '5588999900549';

    const url = isMobile
      ? `https://wa.me/${phone}?text=${mensagem}`
      : `https://web.whatsapp.com/send?phone=${phone}&text=${mensagem}`;

    window.open(url, '_blank');
  };



  const handleAddToCart = async () => {
    if (!product) return;
    if (userId) {
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
      const cartString = localStorage.getItem('cart');
      const cart = cartString ? JSON.parse(cartString) : [];
      const item = cart.find(i => i.id === product.id);
      if (item) item.quantity += quantity;
      else

        var localCartLength = localStorage.getItem('cart') ? JSON.parse(localStorage.getItem('cart')).length : 0;

      cart.push({
        id: localCartLength,
        quantity: quantity,
        product: {
          id: product.id,
          name: product.name,
          price: product.price,
          imageUrl: product.imageUrl,
          discount: product.discount,
          description: product.description
        },
      });
      localStorage.setItem('cart', JSON.stringify(cart));
      window.dispatchEvent(new Event('cartUpdated'));
      setMessage({ type: 'success', text: 'Produto adicionado à sacola!' });
    }
  };

  if (loading) return <LoadingCircles />;
  if (error) return <p className="text-red-600">{error}</p>;
  if (!product) return null;

  const seoDescription = product.description.length > 155
    ? product.description.substring(0, 152) + '...'
    : product.description;

  return (
    <div className="bg-white text-gray-800">
      <title>{`${product.description.substring(0, 15)} - ${product.brand} | GabyMakes`}</title>
      <meta name="description" content={seoDescription} />
      <link rel="canonical" href={`https://gabymakes-website-git-develop-cristianos-projects-14338c05.vercel.app/product/${product.id}`} />

      <meta property="og:title" content={`${product.name} | GabyMakes`} />
      <meta property="og:description" content={seoDescription} />
      <meta property="og:image" content={product.imageUrl} />
      <meta property="og:url" content={`https://gabymakes-website-git-develop-cristianos-projects-14338c05.vercel.app/product/${product.id}`} />
      <meta property="og:type" content="product" />
      <meta property="og:price:amount" content={product.price.toFixed(2)} />
      <meta property="og:price:currency" content="BRL" />


      {confirmation && (
        <ConfirmationModal
          title='Usuário não autenticado!'
          message='Para adicionar ao carrinho, você precisa estar logado.'
          onConfirm={() => navigate('/login')}
          onCancel={() => setConfirmation(false)}
          confirmText='Ir para Login'
          cancelText='Cancelar'
        />
      )}


      <Header />
      <main className="max-w-6xl mx-auto px-4 py-10 min-h-[80vh]">
        <Breadcrumb customLast={(product.description || '').slice(0, 100)} />

        {/* Grid responsivo: 1 coluna no mobile, 2 colunas em md */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-6">
          <div className="w-full flex justify-center md:justify-start">
            <div className="w-full max-w-sm md:max-w-md h-[300px] md:h-[400px] flex justify-center items-center rounded shadow-sm overflow-hidden">
              <img src={product.imageUrl || '/default-image.jpg'} alt={product.description || ''} className="w-full h-full object-contain" />
              {/*<InnerImageZoom
                src={product.imageUrl || '/default-image.jpg'}
                zoomSrc={product.imageUrl || '/default-image.jpg'}
                zoomType="hover"
                zoomPreload={true}
                alt={product.name}
                className="w-full h-full object-contain"
              />*/}
            </div>
          </div>


          {/* Informações do produto */}
          <div className="flex flex-col w-full p-2 rounded">
            <h1 className="text-2xl md:text-3xl font-bold mb-2">{product.brand}</h1>
            <p className="text-sm md:text-base whitespace-pre-line mb-4">{product.description}</p>

            {product.discount > 0 && (
              <p className="text-sm md:text-base text-gray-500 font-bold mb-2 line-through">
                R$ {product.price.toFixed(2).replace('.', ',')}
              </p>
            )}

            <p className="text-2xl md:text-3xl text-pink-500 font-bold mb-4">
              R$ {(product.price - (product.price * (product.discount / 100))).toFixed(2).replace('.', ',')}
            </p>

            {/* Quantidade */}
            <div className="mb-6 flex items-center gap-2 ">
              <label className="block font-semibold mr-2">Quantidade:</label>
              <div className="flex items-center gap-2 border rounded px-2 py-1">
                <button
                  type="button"
                  onClick={() => setQuantity(q => Math.max(1, q - 1))}
                  className="text-xl font-bold text-pink-500 hover:text-pink-700"
                >
                  −
                </button>
                <span className="w-8 text-center">{quantity}</span>
                <button
                  type="button"
                  onClick={() => setQuantity(q => q + 1)}
                  className="text-xl font-bold text-pink-500 hover:text-pink-700"
                >
                  +
                </button>
              </div>
            </div>

            {/* Botões: stack vertical no mobile, horizontal em md */}
            <div className="flex flex-col md:flex-row gap-2">
              <button
                onClick={handleBuyNow}
                className="flex flex-col cursor-pointer items-center justify-center gap-2 bg-[#FFA5BD] text-black p-2 rounded shadow hover:bg-[#ff8cae] transition-colors duration-300"
              >
                <BiPurchaseTagAlt /> comprar agora
              </button>

              <button
                onClick={handleAddToCart}
                className="flex flex-col cursor-pointer items-center justify-center gap-2 bg-[#FFA5BD] text-black p-2 rounded shadow hover:bg-[#ff8cae] transition-colors duration-300"
              >
                <MdOutlineShoppingBag /> adicionar à sacola
              </button>

              <button
                onClick={sendProductWhatsappMessage}
                className="flex flex-col cursor-pointer items-center justify-center gap-2 bg-green-300 text-black p-2 rounded shadow hover:bg-green-400 transition-colors duration-300"
              >
                <FaWhatsapp /> Comprar via WhatsApp
              </button>
            </div>
          </div>
        </div>
      </main>
      <RelatedProducts productId={product.id} category={product.category} userId={userId} />

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
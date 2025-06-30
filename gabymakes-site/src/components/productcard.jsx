import cardPlaceholder from '../assets/card-content.png';
import { HiOutlineShoppingBag } from "react-icons/hi2";

export default function ProductCard({ product, cloudUrl }) {
    const { id, name, description, price, imageUrl } = product;
    const imageToDisplay = imageUrl ? `${cloudUrl}${imageUrl}` : cardPlaceholder;

    // Formata o preço para o padrão brasileiro (R$)
    const formattedPrice = new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
    }).format(price || 0);

    const handleAddToCart = (e) => {
        e.stopPropagation(); // Impede que o clique no botão propague para outros elementos

        // 1. Pega o carrinho do sessionStorage
        const cartString = sessionStorage.getItem('cart');
        let cart = cartString ? JSON.parse(cartString) : [];

        // 2. Verifica se o produto já está no carrinho
        const productInCart = cart.find(item => item.id === id);

        if (productInCart) {
            // Opcional: se já existe, você pode aumentar a quantidade
            // productInCart.quantity += 1;
        } else {
            // 3. Adiciona o novo produto
            const newCartItem = {
                id,
                name,
                price,
                imageUrl: imageToDisplay,
                quantity: 1
            };
            cart.push(newCartItem);
        }

        // 4. Salva o carrinho atualizado no sessionStorage
        sessionStorage.setItem('cart', JSON.stringify(cart));

        // 5. Dispara um evento para que outros componentes (como o Header) possam ouvir
        window.dispatchEvent(new Event('cartUpdated'));
    };

    return (
        <div className="relative group w-[300px] h-auto flex flex-col items-center border pt-4 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 bg-white cursor-pointer">
            <button
                onClick={handleAddToCart}
                className="absolute top-2 left-2 bg-pink-400 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10 hover:bg-pink-500"
                aria-label="Adicionar ao carrinho"
            >
                <HiOutlineShoppingBag size={24} />
            </button>
            <div className="w-[260px] h-[190px] overflow-hidden rounded-md">
                <img src={imageToDisplay} alt={name} className="w-full h-full object-contain" />
            </div>
            <div className="p-4 flex flex-col gap-2 w-full">
                <h3 className="text-xl font-semibold truncate h-8" title={name}>{name}</h3>
                <p className="text-sm text-gray-600 h-20 overflow-hidden text-ellipsis">{description}</p>
                <h3 className="text-xl font-semibold mt-2">{formattedPrice}</h3>
            </div>
        </div>
    )
}
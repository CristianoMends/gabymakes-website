import cardPlaceholder from '../assets/card-content.png';
import { HiOutlineShoppingBag } from "react-icons/hi2";

export default function ProductCard({ product, cloudUrl }) {
    const { id, brand, description, price, imageUrl } = product;
    const imageToDisplay = imageUrl ? `${cloudUrl}${imageUrl}` : cardPlaceholder;

    const formattedPrice = new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
    }).format(price || 0);

    const handleAddToCart = (e) => {
        e.stopPropagation();
        const cartString = sessionStorage.getItem('cart');
        let cart = cartString ? JSON.parse(cartString) : [];

        const productInCart = cart.find(item => item.id === id);

        if (productInCart) {
            productInCart.quantity += 1;
        } else {
            const newCartItem = {
                id,
                name: brand,
                price,
                imageUrl: imageToDisplay,
                quantity: 1
            };
            cart.push(newCartItem);
        }
        sessionStorage.setItem('cart', JSON.stringify(cart));
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
                <img src={imageToDisplay} alt={brand} className="w-full h-full object-contain" />
            </div>
            <div className="p-4 flex flex-col gap-2 w-full">
                <h3 className="text-xl font-semibold truncate h-8" title={brand}>{brand}</h3>
                <p className="text-sm text-gray-600 h-20 overflow-hidden text-ellipsis">{description}</p>
                <h3 className="text-xl font-semibold mt-2">{formattedPrice}</h3>
            </div>
        </div>
    )
}
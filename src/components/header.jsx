import { FiUser, FiSearch } from 'react-icons/fi';
import { HiOutlineShoppingBag } from 'react-icons/hi2';
import logo from '../assets/logo-bg-transparent-2.png';
import { useState, useRef, useEffect } from 'react'; // searchContainerRef e searchQuery/setSearchQuery foram movidos
import { useNavigate } from 'react-router-dom';
import CartModal from './CartModal';
import SearchBar from './SearchBar'; // Importe o novo componente SearchBar

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export default function Header() {
    const [showSearchMobile, setShowSearchMobile] = useState(false); // Este estado fica aqui para controlar a visibilidade da SearchBar mobile
    const [userName, setUserName] = useState('');
    const [userId, setUserId] = useState(null);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    // searchQuery e searchContainerRef foram movidos para SearchBar
    const [cartItemCount, setCartItemCount] = useState(0);
    const [showCartModal, setShowCartModal] = useState(false);

    const loginContainerRef = useRef(null); // Mantém este ref, se ainda for usado para login

    const navigate = useNavigate();

    // Checa login
    useEffect(() => {
        const checkLoginStatus = () => {
            const accessToken = localStorage.getItem('accessToken');
            const currentUserString = localStorage.getItem('currentUser');

            if (accessToken && currentUserString) {
                setIsLoggedIn(true);
                try {
                    const currentUser = JSON.parse(currentUserString);
                    setUserName(currentUser.firstName || currentUser.email || 'Usuário');
                    setUserId(currentUser.id || null);
                } catch (error) {
                    console.error('Erro ao parsear dados do usuário:', error);
                    setUserName('Usuário');
                    setUserId(null);
                }
            } else {
                setIsLoggedIn(false);
                setUserName('');
                setUserId(null);
            }
        };

        checkLoginStatus();
        window.addEventListener('storage', checkLoginStatus);
        return () => window.removeEventListener('storage', checkLoginStatus);
    }, []);

    // Lógica do carrinho
    useEffect(() => {
        async function updateCartCount() {
            if (userId) {
                try {
                    const res = await fetch(`${API_BASE_URL}/cart-item/${userId}`);
                    if (res.ok) {
                        const data = await res.json();
                        const total = data.length;
                        setCartItemCount(total);
                    } else {
                        setCartItemCount(0);
                    }
                } catch (err) {
                    console.error('Erro ao buscar carrinho do usuário:', err);
                    setCartItemCount(0);
                }
            } else {
                const cart = JSON.parse(localStorage.getItem('cart')) || [];
                const totalItems = cart.length;
                setCartItemCount(totalItems);
            }
        }

        updateCartCount();
        window.addEventListener('cartUpdated', updateCartCount);
        return () => window.removeEventListener('cartUpdated', updateCartCount);
    }, [userId]);

    const handleUserIconClick = () => {
        if (!isLoggedIn) {
            navigate('/login');
            return;
        }

        try {
            const userString = localStorage.getItem('currentUser');
            const user = userString ? JSON.parse(userString) : null;

            const role = (user?.role || user?.roles?.[0] || '').toLowerCase();
            const id = user?.id;

            if (!id) {
                navigate('/home');
                return;
            }

            if (role === 'admin') {
                navigate('/admin');
            } else {
                navigate(`/user/${id}`);
            }
        } catch (err) {
            console.error('Erro ao redirecionar:', err);
            navigate('/home');
        }
    };

    // Função para passar para o SearchBar para controlar showSearchMobile
    const handleToggleMobileSearch = (shouldShow) => {
        if (typeof shouldShow === 'boolean') {
            setShowSearchMobile(shouldShow);
        } else {
            setShowSearchMobile(prev => !prev);
        }
    };

    return (
        <div className="relative">
            <header className="bg-pink-300 px-8 py-6 flex items-center">
                <div className="flex-shrink-0 cursor-pointer" onClick={() => navigate('/')}>
                    <img src={logo} alt="Logo Gaby" className="h-10" />
                </div>

                {/* Renderiza o componente SearchBar aqui */}
                <SearchBar
                    showMobile={showSearchMobile}
                    onToggleMobileSearch={handleToggleMobileSearch}
                />

                {/* Ações */}
                <div className="flex items-center space-x-4 ml-auto">
                    {/* Botão de busca mobile - AGORA APENAS O ÍCONE */}
                    <div className="md:hidden">
                        <FiSearch
                            size={22}
                            className="text-gray-800 cursor-pointer hover:text-pink-600 transition-colors"
                            onClick={() => handleToggleMobileSearch(true)} // Apenas abre, o SearchBar fecha
                        />
                    </div>

                    {/* Usuário */}
                    <div className="relative" ref={loginContainerRef}>
                        <div className="flex items-center space-x-2 cursor-pointer" onClick={handleUserIconClick}>
                            <FiUser size={30} className="text-gray-800" />
                            <div className="text-sm leading-tight hidden md:block">
                                <p className="font-semibold text-black">
                                    Olá, {isLoggedIn ? userName : 'visitante'}
                                </p>
                                <p className="text-gray-800">
                                    {isLoggedIn ? 'Minha conta' : 'Entrar na minha conta'}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Carrinho */}
                    <div className="relative cursor-pointer" onClick={() => setShowCartModal(true)}>
                        <HiOutlineShoppingBag size={30} className="text-gray-800" />
                        {cartItemCount > 0 && (
                            <span className="absolute -top-2 -right-2 bg-white text-pink-500 text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center shadow">
                                {cartItemCount}
                            </span>
                        )}
                    </div>
                </div>
            </header>

            {/* O SearchBar já renderiza a busca mobile se showSearchMobile for true */}
            {/* O modal do carrinho fica aqui */}
            {showCartModal && <CartModal onClose={() => setShowCartModal(false)} />}
        </div>
    );
}
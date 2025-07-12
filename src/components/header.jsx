import { FiUser, FiSearch } from 'react-icons/fi';
import { HiOutlineShoppingBag } from 'react-icons/hi2';
import logo from '../assets/logo-bg-transparent-2.png';
import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import CartModal from './CartModal';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export default function Header() {
    const [showSearchMobile, setShowSearchMobile] = useState(false);
    const [userName, setUserName] = useState('');
    const [userId, setUserId] = useState(null);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [cartItemCount, setCartItemCount] = useState(0);
    const [showCartModal, setShowCartModal] = useState(false);

    const loginContainerRef = useRef(null);
    const searchContainerRef = useRef(null);
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

    // Fecha barra de busca mobile ao clicar fora
    useEffect(() => {
        function handleClickOutside(event) {
            if (
                searchContainerRef.current &&
                !searchContainerRef.current.contains(event.target)
            ) {
                setShowSearchMobile(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

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

    const handleSearchSubmit = (event) => {
        event.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/busca?q=${encodeURIComponent(searchQuery)}`);
            setShowSearchMobile(false);
        }
    };

    return (
        <div className="relative">
            <header className="bg-pink-300 px-8 py-6 flex items-center shadow-md">
                <div className="flex-shrink-0 cursor-pointer" onClick={() => navigate('/')}>
                    <img src={logo} alt="Logo Gaby" className="h-10" />
                </div>

                {/* Busca - Desktop */}
                <div className="hidden md:flex flex-grow justify-center">
                    <form
                        onSubmit={handleSearchSubmit}
                        className="flex items-center bg-pink-100 rounded-full shadow-inner px-4 h-10 w-96 max-w-full"
                    >
                        <input
                            type="text"
                            placeholder="Busca"
                            className="flex-grow bg-transparent focus:outline-none text-gray-700 placeholder-gray-400 text-sm"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        <button type="submit" aria-label="Buscar">
                            <FiSearch className="text-gray-700 cursor-pointer" size={18} />
                        </button>
                    </form>
                </div>

                {/* Ações */}
                <div className="flex items-center space-x-4 ml-auto">
                    {/* Busca mobile */}
                    <div className="md:hidden">
                        <FiSearch
                            size={22}
                            className="text-gray-800 cursor-pointer"
                            onClick={() => setShowSearchMobile(prev => !prev)}
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

            {/* Busca mobile flutuante */}
            {showSearchMobile && (
                <div ref={searchContainerRef} className="absolute top-full left-0 w-full bg-pink-100 px-4 py-2 z-40 shadow-lg">
                    <form
                        onSubmit={handleSearchSubmit}
                        className="flex items-center bg-white rounded-full px-4 h-10 shadow-inner"
                    >
                        <input
                            type="text"
                            placeholder="Buscar..."
                            className="flex-grow bg-transparent focus:outline-none text-gray-700 placeholder-gray-400 text-sm"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            autoFocus
                        />
                        <button type="submit" aria-label="Buscar">
                            <FiSearch className="text-gray-700 cursor-pointer" size={18} />
                        </button>
                    </form>
                </div>
            )}

            {/* Modal do carrinho */}
            {showCartModal && <CartModal onClose={() => setShowCartModal(false)} />}
        </div>
    );
}

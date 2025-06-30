import { FiUser, FiSearch } from 'react-icons/fi';
import { HiOutlineShoppingBag } from "react-icons/hi2";
import logo from '../assets/logo-bg-transparent-2.png';
import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import CartModal from './CartModal';


export default function Header() {
    const [showSearchMobile, setShowSearchMobile] = useState(false);
    const [userName, setUserName] = useState('');
    const [cartItemCount, setCartItemCount] = useState(0);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [showCartModal, setShowCartModal] = useState(false);

    const loginContainerRef = useRef(null);
    const searchContainerRef = useRef(null);
    const navigate = useNavigate();

    useEffect(() => {
        const checkLoginStatus = () => {
            const accessToken = localStorage.getItem('accessToken');
            const currentUserString = localStorage.getItem('currentUser');

            if (accessToken && currentUserString) {
                setIsLoggedIn(true);
                try {
                    const currentUser = JSON.parse(currentUserString);
                    setUserName(currentUser.firstName || currentUser.email || 'Usuário');
                } catch (error) {
                    console.error("Erro ao parsear dados do usuário no Header:", error);
                    setUserName('Usuário');
                }
            } else {
                setIsLoggedIn(false);
                setUserName('');
            }
        };

        checkLoginStatus();

        window.addEventListener('storage', checkLoginStatus);

        return () => {
            window.removeEventListener('storage', checkLoginStatus);
        };
    }, []);

    // Efeito para atualizar a contagem de itens do carrinho
    useEffect(() => {
        const updateCartCount = () => {
            const cart = JSON.parse(sessionStorage.getItem('cart')) || [];
            // Soma a quantidade de todos os itens no carrinho
            const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
            setCartItemCount(totalItems);
        };

        // Ouve o evento personalizado disparado ao adicionar um item
        window.addEventListener('cartUpdated', updateCartCount);
        updateCartCount(); // Chama uma vez para definir o estado inicial

        return () => window.removeEventListener('cartUpdated', updateCartCount);
    }, []);

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
        if (isLoggedIn) {
            navigate('/dashboard');
        } else {
            navigate('/login');
        }
    };

    return (
        <div className="relative">
            <header className="bg-pink-300 px-8 py-6 flex items-center shadow-md">

                {/* Logo - alinhado à esquerda */}
                <div className="flex-shrink-0 cursor-pointer" onClick={() => navigate('/')}>
                    <img src={logo} alt="Logo Gaby" className="h-10" />
                </div>

                {/* Barra de busca - desktop */}
                <div className="hidden md:flex flex-grow justify-center">
                    <div className="flex items-center bg-pink-100 rounded-full shadow-inner px-4 h-10 w-96 max-w-full">
                        <input
                            type="text"
                            placeholder="Busca"
                            className="flex-grow bg-transparent focus:outline-none text-gray-700 placeholder-gray-400 text-sm"
                        />
                        <FiSearch className="text-gray-700" size={18} />
                    </div>
                </div>

                <div className="flex items-center space-x-4 ml-auto">

                    <div className="relative" ref={loginContainerRef}>
                        <div
                            className="flex items-center space-x-2 cursor-pointer"
                            onClick={handleUserIconClick}>
                            <FiUser size={30} className="text-gray-800" />
                            <div className="text-sm leading-tight hidden md:block">

                                <p className="font-semibold text-black">
                                    Olá, {isLoggedIn ? userName : 'visitante'}
                                </p>
                                <p className="text-gray-800">
                                    {isLoggedIn ? 'Minha conta' : 'Entrar na minha conta'}
                                </p>
                                {/* ----------------------------------------------------------------- */}
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

                    {/* Ícone de busca mobile */}
                    <div className="md:hidden">
                        <FiSearch
                            size={22}
                            className="text-gray-800"
                            onClick={() => setShowSearchMobile(prev => !prev)}
                        />
                    </div>
                </div>
            </header>

            {/* Barra de busca MOBILE flutuante */}
            {showSearchMobile && (
                <div
                    ref={searchContainerRef}
                    className="absolute top-full left-0 w-full bg-pink-100 px-4 py-2 z-40 shadow"
                >
                    <div className="flex items-center bg-white rounded-full px-4 h-10 shadow-inner">
                        <input
                            type="text"
                            placeholder="Buscar..."
                            className="flex-grow bg-transparent focus:outline-none text-gray-700 placeholder-gray-400 text-sm"
                        />
                        <FiSearch className="text-gray-700" size={18} />
                    </div>
                </div>
            )}

            {showCartModal && <CartModal onClose={() => setShowCartModal(false)} />}
        </div>
    );
}
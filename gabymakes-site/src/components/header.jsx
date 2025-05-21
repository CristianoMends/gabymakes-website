import { FiUser, FiSearch } from 'react-icons/fi';
import { HiOutlineShoppingBag } from "react-icons/hi2";
import logo from '../assets/logo-bg-transparent-2.png';
import { useState, useRef, useEffect } from 'react';
import LoginPopup from './login'; // Importe o componente LoginPopup

export default function Header() {
    const [showLogin, setShowLogin] = useState(false);
    const [showSearchMobile, setShowSearchMobile] = useState(false);
    const loginContainerRef = useRef(null);
    const searchContainerRef = useRef(null);

    // Fecha Login e Busca ao clicar fora
    useEffect(() => {
        function handleClickOutside(event) {
            if (
                loginContainerRef.current &&
                !loginContainerRef.current.contains(event.target)
            ) {
                setShowLogin(false);
            }

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

    return (
        <div className="relative">
            <header className="bg-pink-300 px-8 py-6 flex items-center shadow-md">

                {/* Logo - alinhado à esquerda */}
                <div className="flex-shrink-0">
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

                {/* Ícones (login, carrinho e busca mobile) */}
                <div className="flex items-center space-x-4 ml-auto">
                    {/* Login */}
                    <div className="relative" ref={loginContainerRef}>
                        <div
                            className="flex items-center space-x-2 cursor-pointer"
                            onClick={() => setShowLogin(prev => !prev)}
                        >
                            <FiUser size={30} className="text-gray-800" />
                            <div className="text-sm leading-tight hidden md:block">
                                <p className="font-semibold text-black">Olá, visitante</p>
                                <p className="text-gray-800">Entrar na minha conta</p>
                            </div>
                        </div>
                        {showLogin && (
                            <div className="absolute top-full right-0 mt-1 z-50 shadow-lg rounded-md overflow-hidden" style={{ width: '300px', maxWidth: '90vw' }}>
                                <LoginPopup onClose={() => setShowLogin(false)} />
                            </div>
                        )}
                    </div>

                    {/* Carrinho */}
                    <div className="relative">
                        <HiOutlineShoppingBag size={30} className="text-gray-800" />
                        <span className="absolute -top-2 -right-2 bg-white text-pink-500 text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center shadow">
                            1
                        </span>
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
        </div>
    );
}
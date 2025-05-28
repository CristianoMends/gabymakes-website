import { FiUser, FiSearch } from 'react-icons/fi';
import { HiOutlineShoppingBag } from "react-icons/hi2";
import logo from '../assets/logo-bg-transparent-2.png';
import { useState, useRef, useEffect } from 'react';
import LoginPopup from './login';
import { useNavigate } from 'react-router-dom';


export default function HeaderVariant() {
    const [showLogin, setShowLogin] = useState(false);
    const [showSearchMobile, setShowSearchMobile] = useState(false);
    const loginContainerRef = useRef(null);
    const searchContainerRef = useRef(null);
    const navigate = useNavigate();

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

                <div className="flex-shrink-0 cursor-pointer" onClick={() => navigate('/')}>
                    <img src={logo} alt="Logo Gaby" className="h-10" />
                </div>

                <div className="hidden md:flex flex-grow justify-center">
                </div>

                <div className="flex items-center space-x-4 ml-auto">
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
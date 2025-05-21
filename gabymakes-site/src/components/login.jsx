import React, { useState } from 'react';
import { FcGoogle } from "react-icons/fc";
import { AiOutlineClose, AiFillEye, AiFillEyeInvisible } from "react-icons/ai";

const LoginPopup = ({ onClose }) => {
    const [showPassword, setShowPassword] = useState(false);

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    return (
        <div className="fixed top-0 left-0 w-full h-full shadow-md bg-opacity-50 flex justify-center items-center z-50">
            <div className="shadow-md bg-white rounded-lg p-6 sm:p-8 max-w-xs w-full">
                <button onClick={onClose} className="top-3 right-3 text-gray-500 hover:text-gray-700 focus:outline-none">
                    <AiOutlineClose className="h-5 w-5 sm:h-6 sm:w-6" />
                </button>
                <h2 className="text-xl sm:text-2xl font-semibold text-center mb-4 sm:mb-6">Já tem uma conta?</h2>
                <div className="mb-3 sm:mb-4">
                    <label htmlFor="email" className="block text-gray-700 text-sm font-bold mb-1 sm:mb-2">
                        Email
                    </label>
                    <input
                        type="email"
                        id="email"
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline text-sm sm:text-base"
                        placeholder="insira seu email"
                    />
                </div>
                <div className="mb-4 sm:mb-6">
                    <label htmlFor="password" className="block text-gray-700 text-sm font-bold mb-1 sm:mb-2">
                        Senha
                    </label>
                    <div className="relative">
                        <input
                            type={showPassword ? 'text' : 'password'}
                            id="password"
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-2 sm:mb-3 leading-tight focus:outline-none focus:shadow-outline text-sm sm:text-base"
                            placeholder="insira sua senha"
                        />
                        <span
                            onClick={togglePasswordVisibility}
                            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 cursor-pointer"
                        >
                            {showPassword ? <AiFillEyeInvisible className="w-4 h-4 sm:w-5 sm:h-5" /> : <AiFillEye className="w-4 h-4 sm:w-5 sm:h-5" />}
                        </span>
                    </div>
                </div>
                <button style={{ background: '#fda5d5' }} className="hover:bg-pink-700 text-black font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full mb-3 sm:mb-4 text-sm sm:text-base" type="button">
                    Entrar
                </button>
                <div className="text-center text-gray-700 mb-3 sm:mb-4 text-sm">ou</div>
                <button className="bg-white border border-gray-300 hover:border-gray-400 text-gray-700 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full flex items-center justify-center text-sm sm:text-base">
                    <FcGoogle className="mr-2" size={18} smSize={20} />
                    Faça login com o google
                </button>
                <p className="text-center mt-4 text-sm">
                    <button onClick={() => alert('Implementar cadastro!')} className="text-blue-500 hover:underline focus:outline-none">
                        Não tem uma conta? Cadastre-se
                    </button>
                </p>
            </div>
        </div>
    );
};

export default LoginPopup;
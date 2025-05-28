import React, { useState } from 'react';
import { FcGoogle } from "react-icons/fc";
import { AiOutlineClose, AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import { useNavigate } from 'react-router-dom';

const LoginPopup = () => {
    const [showPassword, setShowPassword] = useState(false);
    const togglePasswordVisibility = () => setShowPassword(!showPassword);
    const navigate = useNavigate();

    return (
        <div className="w-full flex justify-center items-center px-4 py-10 min-h-screen bg-white">
            <div className="shadow-[0px_2px_8px_rgba(0,0,0,0.3)] bg-white rounded-lg p-6 sm:p-8 max-w-md w-full relative">
                <h2 className="text-xl sm:text-2xl font-semibold text-center mb-6">Já tem uma conta?</h2>
                <div className="mb-4">
                    <label htmlFor="email" className="block text-gray-700 text-sm font-bold mb-2">Email</label>
                    <input
                        type="email"
                        id="email"
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        placeholder="insira seu email"
                    />
                </div>
                <div className="mb-6">
                    <label htmlFor="password" className="block text-gray-700 text-sm font-bold mb-2">Senha</label>
                    <div className="relative">
                        <input
                            type={showPassword ? 'text' : 'password'}
                            id="password"
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            placeholder="insira sua senha"
                        />
                        <span
                            onClick={togglePasswordVisibility}
                            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 cursor-pointer"
                        >
                            {showPassword ? <AiFillEyeInvisible /> : <AiFillEye />}
                        </span>
                    </div>
                </div>
                <button
                    style={{ background: '#fda5d5' }}
                    className="hover:bg-pink-700 text-black font-bold py-2 px-4 rounded w-full mb-4 cursor-pointer"
                >
                    Entrar
                </button>
                <div className="text-center text-gray-700 mb-4 text-sm">ou</div>

                <button className="w-full border border-gray-300 cursor-pointer py-2 rounded-full flex items-center justify-center mb-6 hover:border-gray-400">
                    <FcGoogle className="mr-2" size={20} />
                    <span className="font-medium text-sm">Faça login com o Google</span>
                </button>
                <p className="text-center mt-6 text-sm">
                    <button
                        onClick={() => navigate('/cadastro')}
                        className="text-blue-500 hover:underline cursor-pointer"
                    >
                        Não tem uma conta? Cadastre-se
                    </button>
                </p>
            </div>
        </div>
    );
};

export default LoginPopup;

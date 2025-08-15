import { useState, useEffect } from 'react';
import { FcGoogle } from "react-icons/fc";
import { AiOutlineClose, AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import { useNavigate } from 'react-router-dom';
import { useGoogleAuthService } from '../services/googleAuthService';
import { showAppMessage } from './messageContainer';
import LoadingCircles from './loading'
import { useLocation } from "react-router-dom";

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const LoginPopup = () => {
    const location = useLocation();

    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });

    const [message, setMessage] = useState(null);
    const navigate = useNavigate();

    const togglePasswordVisibility = () => setShowPassword(!showPassword);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleCloseMessage = () => {
        setMessage(null);
    };

    useEffect(() => {
        if (location.state?.message) {
            showAppMessage('error', location.state.message);
        }
    }, [location.state]);

    const handleGoogleLoginSuccess = async (credentialResponse) => {

        const googleAuthCode = credentialResponse.code;

        if (!googleAuthCode) {
            showAppMessage('error', 'Erro: Código de autorização do Google não encontrado.');
            return;
        }

        try {
            const response = await fetch(`${API_BASE_URL}/auth/google`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ code: googleAuthCode }),
            });

            const result = await response.json();
            if (response.ok) {
                showAppMessage('success', 'Login com Google realizado com sucesso!');

                localStorage.setItem('accessToken', result.access_token);
                localStorage.setItem('currentUser', JSON.stringify(result.user));

                setTimeout(() => {
                    navigate('/');
                }, 1500);
            } else {
                showAppMessage('error', result.message || 'Erro ao fazer login com Google.');
                console.error("Erro do backend no login Google:", result);
            }
        } catch (error) {
            showAppMessage('error', 'Erro de rede ao fazer login com Google. Verifique sua conexão.');
        }
    };

    const handleGoogleLoginError = (errorResponse) => {

        showAppMessage('error', 'Erro ao fazer login com o Google. Tente novamente.');
    };
    const signInWithGoogle = useGoogleAuthService(handleGoogleLoginSuccess, handleGoogleLoginError);


    const handleEmailPasswordLogin = async (e) => {
        e.preventDefault();
        showAppMessage(null);
        setIsLoading(true);


        try {
            const response = await fetch(`${API_BASE_URL}/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });
            const result = await response.json();
            if (response.ok) {
                showAppMessage('success', 'Login realizado com sucesso!');
                localStorage.setItem('accessToken', result.access_token);
                localStorage.setItem('currentUser', JSON.stringify(result.user));

                setFormData({ email: '', password: '' });
                setTimeout(() => {
                    setIsLoading(false);
                    navigate('/');
                }, 1500);
            } else {
                showAppMessage('error', result.message || 'Erro ao fazer login.');
                setIsLoading(false);
            }
        } catch (error) {
            showAppMessage(error, 'Erro ao enviar requisição. Verifique sua conexão.');
            setIsLoading(false);
        }
    };

    return (
        <div className="w-full flex justify-center items-start px-4 py-10 min-h-screen bg-white">
            <div className="shadow-[0px_2px_8px_rgba(0,0,0,0.3)] bg-white rounded-lg p-6 sm:p-8 max-w-md w-full relative">
                {isLoading && (
                    <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center z-20 rounded-lg">
                        <LoadingCircles />
                    </div>
                )}

                <h2 className="text-xl sm:text-2xl font-semibold text-center mb-6">Já tem uma conta?</h2>
                <form onSubmit={handleEmailPasswordLogin}>
                    <div className="mb-4">
                        <label htmlFor="email" className="block text-gray-700 text-sm font-bold mb-2">Email</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            placeholder="insira seu email"
                            required
                        />
                    </div>
                    <div className="mb-6">
                        <label htmlFor="password" className="block text-gray-700 text-sm font-bold mb-2">Senha</label>
                        <div className="relative">
                            <input
                                type={showPassword ? 'text' : 'password'}
                                id="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                placeholder="insira sua senha"
                                required
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
                        type="submit"
                        style={{ background: '#fda5d5' }}
                        className="hover:bg-pink-700 text-black font-bold py-2 px-4 rounded w-full mb-4 cursor-pointer"
                    >
                        Entrar
                    </button>
                </form>
                <div className="text-center text-gray-700 mb-4 text-sm">ou</div>

                <button
                    onClick={() => signInWithGoogle()}
                    className="w-full border border-gray-300 cursor-pointer py-2 rounded-full flex items-center justify-center mb-6 hover:border-gray-400"
                >
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
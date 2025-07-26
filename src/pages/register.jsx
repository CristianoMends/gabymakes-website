import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import HeaderVariant from '../components/header-variant';
import Breadcrumb from '../components/breadcrumb';
import Footer from '../components/footer';
import LoadingCircles from '../components/loading';
import Message from '../components/message';
import { FiEye, FiEyeOff, FiCheckCircle, FiXCircle } from 'react-icons/fi';


const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export default function RegisterPage() {
    const [message, setMessage] = useState('');
    const [messageType, setMessageType] = useState('info');
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const [passwordChecks, setPasswordChecks] = useState({
        length: false,
        lowercase: false,
        uppercase: false,
        number: false,
        special: false,
    });

    const updatePasswordChecks = (password) => {
        setPasswordChecks({
            length: password.length >= 6,
            lowercase: /[a-z]/.test(password),
            uppercase: /[A-Z]/.test(password),
            number: /\d/.test(password),
            special: /[^a-zA-Z0-9]/.test(password),
        });
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));

        if (name === 'password') {
            updatePasswordChecks(value);
        }
    };

    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        confirmPassword: '',
        whatsapp: '',
        gender: '',
    });

    const navigate = useNavigate();

    useEffect(() => {
        document.title = 'Cadastro - GabyMakes';
    }, []);

    const showMessage = (msg, type = 'info') => {
        setMessage(msg);
        setMessageType(type);
        setTimeout(() => setMessage(''), 5000);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (formData.password !== formData.confirmPassword) {
            return showMessage('As senhas não coincidem.', 'error');
        }

        setLoading(true);
        const { confirmPassword, ...dataToSend } = formData;

        try {
            const response = await fetch(`${API_BASE_URL}/auth/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(dataToSend),
            });

            const result = await response.json();
            if (response.ok) {
                showMessage('Conta criada com sucesso! Redirecionando...', 'success');
                setFormData({
                    firstName: '',
                    lastName: '',
                    email: '',
                    password: '',
                    confirmPassword: '',
                    whatsapp: '',
                    gender: '',
                });
                setTimeout(() => navigate('/login'), 2000);
            } else {
                showMessage(result.message || 'Erro ao cadastrar. Verifique os dados.', 'error');
            }
        } catch {
            showMessage('Erro de conexão. Tente novamente mais tarde.', 'error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white min-h-screen">
            <HeaderVariant />
            <Breadcrumb />

            <div className="px-6 py-10 max-w-2xl mx-auto shadow-[0px_2px_8px_rgba(0,0,0,0.3)] h-max-content rounded-lg bg-white">
                <form className="space-y-4" onSubmit={handleSubmit}>
                    <div>
                        <label htmlFor="firstName" className="block font-medium text-sm mb-1">Primeiro nome</label>
                        <input type="text" id="firstName" name="firstName" value={formData.firstName} onChange={handleChange} placeholder="insira seu primeiro nome" className="w-full border px-3 py-2 rounded" required />
                    </div>

                    <div>
                        <label htmlFor="lastName" className="block font-medium text-sm mb-1">Sobrenome</label>
                        <input type="text" id="lastName" name="lastName" value={formData.lastName} onChange={handleChange} placeholder="insira seu sobrenome" className="w-full border px-3 py-2 rounded" required />
                    </div>

                    <div>
                        <label htmlFor="email" className="block font-medium text-sm mb-1">E-mail</label>
                        <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} placeholder="insira seu email" className="w-full border px-3 py-2 rounded" required />
                    </div>

                    <div>
                        <label htmlFor="password" className="block font-medium text-sm mb-1">Senha</label>
                        <div className="relative">
                            <input
                                type={showPassword ? 'text' : 'password'}
                                id="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                placeholder="crie uma senha"
                                className="w-full border px-3 py-2 rounded pr-10"
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute inset-y-0 right-2 px-2 flex items-center text-gray-600 cursor-pointer"
                            >
                                {showPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
                            </button>
                        </div>

                        <div className="mt-2 flex flex-col text-sm gap-1 min-h-[6rem]">
                            <span className={`flex items-center gap-1 ${passwordChecks.length ? 'text-green-600' : 'text-red-500'}`}>
                                {passwordChecks.length ? <FiCheckCircle /> : <FiXCircle />} Pelo menos 6 caracteres
                            </span>
                            <span className={`flex items-center gap-1 ${passwordChecks.lowercase ? 'text-green-600' : 'text-red-500'}`}>
                                {passwordChecks.lowercase ? <FiCheckCircle /> : <FiXCircle />} Letra minúscula
                            </span>
                            <span className={`flex items-center gap-1 ${passwordChecks.uppercase ? 'text-green-600' : 'text-red-500'}`}>
                                {passwordChecks.uppercase ? <FiCheckCircle /> : <FiXCircle />} Letra maiúscula
                            </span>
                            <span className={`flex items-center gap-1 ${passwordChecks.number ? 'text-green-600' : 'text-red-500'}`}>
                                {passwordChecks.number ? <FiCheckCircle /> : <FiXCircle />} Número
                            </span>
                            <span className={`flex items-center gap-1 ${passwordChecks.special ? 'text-green-600' : 'text-red-500'}`}>
                                {passwordChecks.special ? <FiCheckCircle /> : <FiXCircle />} Caractere especial
                            </span>
                        </div>
                    </div>


                    <div>
                        <label htmlFor="confirmPassword" className="block font-medium text-sm mb-1">Repetir senha</label>
                        <input type="password" id="confirmPassword" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} placeholder="repita sua senha" className="w-full border px-3 py-2 rounded" required />
                    </div>

                    <div>
                        <label htmlFor="whatsapp" className="block font-medium text-sm mb-1">Número WhatsApp</label>
                        <input type="tel" id="whatsapp" name="whatsapp" value={formData.whatsapp} onChange={handleChange} placeholder="(00) 0 0000-0000" className="w-full border px-3 py-2 rounded" />
                    </div>

                    <div>
                        <label className="block font-medium text-sm mb-1">Gênero</label>
                        <div className="flex gap-4 text-sm mt-1">
                            {['masculino', 'feminino', 'nao_especificar'].map((g) => (
                                <label key={g} className="flex items-center gap-1 cursor-pointer">
                                    <input type="radio" name="gender" value={g} onChange={handleChange} checked={formData.gender === g} className="accent-pink-500 cursor-pointer" />
                                    {g.replace('_', ' ')}
                                </label>
                            ))}
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className={`cursor-pointer w-full py-2 rounded text-white font-semibold ${loading ? 'bg-pink-200 cursor-not-allowed' : 'bg-pink-300 hover:bg-pink-400'}`}
                    >
                        {loading ? 'Cadastrando...' : 'Cadastrar conta'}
                    </button>

                    <p className="text-center text-sm mt-4">
                        <Link to="/login" className="text-blue-500 hover:underline cursor-pointer">
                            Já possui uma conta? Entrar
                        </Link>
                    </p>
                </form>
            </div>

            <Footer />

            {loading && <LoadingCircles />}
            {message && <Message type={messageType} message={message} onClose={() => setMessage('')} />}
        </div>
    );
}
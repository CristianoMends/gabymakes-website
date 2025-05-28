// pages/cadastro.tsx
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FcGoogle } from 'react-icons/fc';
import HeaderVariant from '../components/header-variant';
import Breadcrumb from '../components/breadcrumb';
import Footer from '../components/footer';

export default function RegisterPage() {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        confirmPassword: '',
        whatsapp: '',
        gender: '',
    });

    useEffect(() => {
        document.title = 'Cadastro - GabyMakes';
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (formData.password !== formData.confirmPassword) {
            alert('As senhas não coincidem');
            return;
        }

        try {
            const response = await fetch('/api/cadastro', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            const result = await response.json();
            if (response.ok) {
                alert('Cadastro realizado com sucesso!');
                setFormData({
                    firstName: '',
                    lastName: '',
                    email: '',
                    password: '',
                    confirmPassword: '',
                    whatsapp: '',
                    gender: '',
                });
            } else {
                alert(result.message || 'Erro ao cadastrar');
            }
        } catch (error) {
            alert('Erro ao enviar requisição');
        }
    };

    return (
        <div className="bg-white min-h-screen">
            <HeaderVariant />
            <Breadcrumb />
            <div className="px-4 py-10 max-w-md mx-auto shadow-[0px_2px_8px_rgba(0,0,0,0.3)] h-max-content">
                <button className="cursor-pointer w-full border border-gray-300 py-2 rounded-full flex items-center justify-center mb-6 hover:border-gray-400">
                    <FcGoogle className="mr-2" size={20} />
                    <span className="font-medium text-sm">Cadastrar com google</span>
                </button>

                <form className="space-y-4" onSubmit={handleSubmit}>
                    <div>
                        <label className="block font-medium text-sm mb-1">Primeiro nome</label>
                        <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} placeholder="insira seu primeiro nome" className="w-full border px-3 py-2 rounded" />
                    </div>

                    <div>
                        <label className="block font-medium text-sm mb-1">Sobrenome</label>
                        <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} placeholder="insira seu sobrenome" className="w-full border px-3 py-2 rounded" />
                    </div>

                    <div>
                        <label className="block font-medium text-sm mb-1">E-mail</label>
                        <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="insira seu email" className="w-full border px-3 py-2 rounded" />
                    </div>

                    <div>
                        <label className="block font-medium text-sm mb-1">Senha</label>
                        <input type="password" name="password" value={formData.password} onChange={handleChange} placeholder="crie uma senha" className="w-full border px-3 py-2 rounded" />
                    </div>

                    <div>
                        <label className="block font-medium text-sm mb-1">Repetir senha</label>
                        <input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} placeholder="repita sua senha" className="w-full border px-3 py-2 rounded" />
                    </div>

                    <div>
                        <label className="block font-medium text-sm mb-1">Número WhatsApp</label>
                        <input type="text" name="whatsapp" value={formData.whatsapp} onChange={handleChange} placeholder="(00) 0 0000-0000" className="w-full border px-3 py-2 rounded" />
                    </div>

                    <div>
                        <label className="block font-medium text-sm mb-1">Gênero</label>
                        <div className="flex gap-4 text-sm mt-1">
                            <label className="flex items-center gap-1 cursor-pointer">
                                <input type="radio" name="gender" value="masculino" onChange={handleChange} checked={formData.gender === 'masculino'} className="accent-pink-500 cursor-pointer" /> masculino
                            </label>
                            <label className="flex items-center gap-1 cursor-pointer">
                                <input type="radio" name="gender" value="feminino" onChange={handleChange} checked={formData.gender === 'feminino'} className="accent-pink-500 cursor-pointer" /> feminino
                            </label>
                            <label className="flex items-center gap-1 cursor-pointer">
                                <input type="radio" name="gender" value="nao_especificar" onChange={handleChange} checked={formData.gender === 'nao_especificar'} className="accent-pink-500 cursor-pointer" /> não especificar
                            </label>
                        </div>
                    </div>

                    <button type="submit" className="cursor-pointer w-full py-2 rounded bg-pink-300 hover:bg-pink-400 text-center font-semibold">
                        Cadastrar conta
                    </button>

                    <p className="text-center text-sm mt-4">
                        <Link to="/login" className="text-blue-500 hover:underline cursor-pointer">
                            Já possui uma conta? Entrar
                        </Link>
                    </p>
                </form>
            </div>
            <Footer></Footer>
        </div>
    );
}

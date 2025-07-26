import { useEffect, useState } from 'react';
import Message from '../components/message';
import LoadingCircles from '../components/loading';
import ConfirmationModal from '../components/confirmationModal';
import { useNavigate } from 'react-router-dom';

import {
    FiUser,
    FiMapPin,
    FiLogOut,
    FiShoppingCart,
    FiChevronDown,
    FiChevronUp,
} from 'react-icons/fi';
import { HiTrash, HiX } from 'react-icons/hi';
import HeaderVariant from '../components/header-variant';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export default function UserPage() {
    const [userData, setUserData] = useState({
        id: '',
        firstName: '',
        lastName: '',
        email: '',
        role: '',
    });

    const [cartItems, setCartItems] = useState([]);
    const [addresses, setAddresses] = useState([]);
    const [selectedAddress, setSelectedAddress] = useState(null);
    const [openDropdown, setOpenDropdown] = useState('');
    const [showAddressModal, setShowAddressModal] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const [showConfirm, setShowConfirm] = useState(false);
    const [confirming, setConfirming] = useState(false);
    const [addressIdToDelete, setAddressIdToDelete] = useState(null);

    const showMessage = (type, text) => {
        setMessage({ type, text });
        setTimeout(() => setMessage({ type: '', text: '' }), 4000);
    };


    const [form, setForm] = useState({
        street: '',
        number: '',
        neighborhood: '',
        city: '',
        state: '',
        zipCode: '',
        complement: '',
    });

    const toggleDropdown = (section) => {
        setOpenDropdown(openDropdown === section ? '' : section);
    };

    const handleLogout = () => {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('currentUser');
        window.location.href = '/';
    };

    const fetchCart = async (userId) => {
        const res = await fetch(`${API_URL}/cart-item/${userId}`);
        if (res.ok) {
            const data = await res.json();
            setCartItems(data);
        }
    };

    const fetchAddresses = async (userId) => {
        const res = await fetch(`${API_URL}/address/user/${userId}`);
        if (res.ok) {
            const data = await res.json();
            setAddresses(data);
            setSelectedAddress(data[0] || null);
        }
    };

    const fetchUserData = async () => {
        setLoading(true);
        const token = localStorage.getItem('accessToken');
        const res = await fetch(`${API_URL}/users/profile`, {
            headers: { Authorization: `Bearer ${token}` },
        });

        if (res.ok) {
            const user = await res.json();
            setUserData(user);
            await fetchCart(user.id);
            await fetchAddresses(user.id);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchUserData();
    }, []);

    const handleRemoveAddress = async (id) => {
        const res = await fetch(`${API_URL}/address/${id}`, { method: 'DELETE' });
        if (res.ok) {
            setAddresses((prev) => prev.filter((a) => a.id !== id));
            if (selectedAddress?.id === id) setSelectedAddress(null);
        }
    };

    const handleAddAddress = async (e) => {
        e.preventDefault();

        const streetWithNumber = `${form.street.trim()}, ${form.number.trim()}`;

        const body = {
            street: streetWithNumber,
            city: form.city.trim(),
            state: form.state.trim().toUpperCase(),
            zipCode: form.zipCode.trim(),
            userId: userData.id,
        };


        const res = await fetch(`${API_URL}/address`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body),
        });

        if (res.ok) {
            const newAddr = await res.json();
            setAddresses((prev) => [...prev, newAddr]);
            setSelectedAddress(newAddr);
            setForm({
                street: '',
                number: '',
                neighborhood: '',
                city: '',
                state: '',
                zipCode: '',
                complement: '',
            });
            setShowAddressModal(false);
            showMessage('success', 'Endereço salvo com sucesso!');
        } else {
            showMessage('error', 'Erro ao salvar endereço');
        }
    };

    document.title = `Olá, ${userData.firstName}!`


    return (
        < div className="min-h-screen bg-white from-zinc-100 to-white flex flex-col" >

            {
                message.text && (
                    <Message
                        type={message.type}
                        message={message.text}
                        onClose={() => setMessage({ type: '', text: '' })}
                    />
                )
            }
            {loading && <LoadingCircles />}

            {
                showConfirm && (
                    <ConfirmationModal
                        title="Confirmar Alterações"
                        message="Tem certeza que deseja deletar esse endereço?"
                        confirmText={confirming ? "Deletando..." : "Sim, Deletar"}
                        cancelText="Cancelar"
                        onConfirm={() => {
                            handleRemoveAddress(addressIdToDelete);
                            setShowConfirm(false); // fecha o modal após remover
                            showMessage('success', 'Endereço removido com sucesso!');
                        }}
                        onCancel={() => setShowConfirm(false)}
                        disabled={confirming}
                    />
                )
            }


            <HeaderVariant />
            <main className="flex flex-1 flex-col items-center py-10 px-4 md:px-10">
                <section className="w-full bg-white p-6">
                    <div className="text-center mb-8">
                        <h1 className="text-3xl md:text-4xl font-bold text-zinc-800">
                            Olá, {userData.firstName}
                        </h1>
                        <p className="text-sm text-zinc-500">Gerencie sua conta e seu carrinho</p>
                    </div>

                    <div className="space-y-4">
                        {/* Dados pessoais */}
                        <div className="bg-zinc-50 border border-zinc-200 rounded-xl p-4">
                            <h2 className="text-xl font-semibold text-zinc-800 flex items-center gap-2 mb-2">
                                <FiUser /> Dados pessoais
                            </h2>
                            <div className="text-zinc-600 text-sm space-y-1">
                                <div><strong>Nome:</strong> {userData.firstName} {userData.lastName}</div>
                                <div><strong>Email:</strong> {userData.email}</div>
                            </div>
                        </div>

                        <div className="bg-zinc-50 border border-zinc-200 rounded-xl p-4">
                            <div className="flex justify-between items-center mb-2">
                                <h2 className="text-xl font-semibold text-zinc-800 flex items-center gap-2">
                                    <FiShoppingCart /> Meu carrinho
                                </h2>
                                <button
                                    onClick={() => navigate(`/checkout/${userData.id}`)}
                                    className="bg-pink-300 cursor-pointer hover:bg-pink-400 text-zinc-800 px-4 py-2 rounded font-semibold transition"
                                >
                                    Ir para checkout
                                </button>
                            </div>

                            <div className="text-zinc-600 text-sm space-y-4">
                                {cartItems.length === 0 ? (
                                    <p className="text-zinc-500">Seu carrinho está vazio.</p>
                                ) : (
                                    cartItems.map(item => (
                                        <div key={item.id} className="flex gap-4 items-center border rounded p-2 bg-white">
                                            <img src={item.product.imageUrl} alt={item.product.description} className="w-20 h-20 object-cover rounded" />
                                            <div>
                                                <h3 className="font-semibold text-zinc-800">{item.product.description}</h3>
                                                <p>Preço: R$ {item.product.price.replace('.', ',')}</p>
                                                {item.product.discount > 0 && (
                                                    <p>Desconto: R$ {item.product.discount.toFixed(2)}</p>
                                                )}
                                                <p>Quantidade: {item.quantity}</p>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>


                        {/* Endereços */}
                        <div className="bg-zinc-50 border border-zinc-200 rounded-xl p-4">
                            <div className="flex cursor-pointer justify-between items-center mb-2">
                                <h2 className="text-xl font-semibold text-zinc-800 flex items-center gap-2"><FiMapPin /> Endereços</h2>
                                <button
                                    onClick={() => setShowAddressModal(true)}
                                    className="bg-pink-300 cursor-pointer hover:bg-pink-400 text-zinc-800 px-3 py-1 rounded font-semibold transition"
                                >
                                    + Novo
                                </button>
                            </div>

                            {addresses.length === 0 ? (
                                <p className="text-zinc-500">Nenhum endereço cadastrado.</p>
                            ) : (
                                <ul className="space-y-2 max-h-60 overflow-auto">
                                    {addresses.map((addr) => (
                                        <li
                                            key={addr.id}
                                            className={`bg-white p-4 rounded border flex justify-between items-center cursor-pointer ${selectedAddress?.id === addr.id
                                                ? 'border-pink-300 bg-zinc-100'
                                                : 'border-zinc-300'
                                                }`}
                                            onClick={() => setSelectedAddress(addr)}
                                        >
                                            <div>
                                                <p><strong>Rua:</strong> {addr.street}, {addr.number}</p>
                                                <p><strong>Bairro:</strong> {addr.neighborhood}</p>
                                                <p><strong>Cidade:</strong> {addr.city} - {addr.state}</p>
                                                <p><strong>CEP:</strong> {addr.zipCode}</p>
                                                <p><strong>Complemento:</strong> {addr.complement || 'N/A'}</p>
                                            </div>
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setShowConfirm(true);
                                                    setAddressIdToDelete(addr.id);
                                                }}
                                                className="text-red-600 hover:text-red-800 cursor-pointer"
                                                aria-label="Remover endereço"
                                            >
                                                <HiTrash size={20} />
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>

                        {/* Logout */}
                        <div className="flex justify-center pt-6">
                            <button
                                className="flex items-center cursor-pointer gap-2 text-red-600 hover:text-red-800 font-medium transition"
                                onClick={handleLogout}
                            >
                                <FiLogOut /> Sair da conta
                            </button>
                        </div>
                    </div>
                </section>
            </main>

            {/* Modal de endereço */}
            {
                showAddressModal && (
                    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
                        <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-6 relative">
                            <button
                                onClick={() => setShowAddressModal(false)}
                                className="absolute top-3 right-3 text-zinc-500 hover:text-zinc-700"
                            >
                                <HiX size={24} />
                            </button>

                            <h3 className="text-xl font-semibold mb-4">Adicionar novo endereço</h3>

                            <form onSubmit={handleAddAddress} className="space-y-4 text-sm">
                                <input
                                    required
                                    type="text"
                                    placeholder="Rua"
                                    value={form.street}
                                    onChange={(e) => setForm({ ...form, street: e.target.value })}
                                    className="w-full border border-zinc-300 rounded p-2"
                                />
                                <input
                                    required
                                    type="text"
                                    placeholder="Número"
                                    value={form.number}
                                    onChange={(e) => setForm({ ...form, number: e.target.value })}
                                    className="w-full border border-zinc-300 rounded p-2"
                                />
                                <input
                                    required
                                    type="text"
                                    placeholder="Bairro"
                                    value={form.neighborhood}
                                    onChange={(e) => setForm({ ...form, neighborhood: e.target.value })}
                                    className="w-full border border-zinc-300 rounded p-2"
                                />
                                <div className="flex gap-3">
                                    <input
                                        required
                                        type="text"
                                        placeholder="Cidade"
                                        value={form.city}
                                        onChange={(e) => setForm({ ...form, city: e.target.value })}
                                        className="flex-1 border border-zinc-300 rounded p-2"
                                    />
                                    <input
                                        required
                                        type="text"
                                        placeholder="Estado"
                                        value={form.state}
                                        onChange={(e) => setForm({ ...form, state: e.target.value })}
                                        className="flex-1 border border-zinc-300 rounded p-2"
                                    />
                                </div>
                                <input
                                    required
                                    type="text"
                                    placeholder="CEP"
                                    value={form.zipCode}
                                    onChange={(e) => setForm({ ...form, zipCode: e.target.value })}
                                    className="w-full border border-zinc-300 rounded p-2"
                                />
                                <input
                                    type="text"
                                    placeholder="Complemento (opcional)"
                                    value={form.complement}
                                    onChange={(e) => setForm({ ...form, complement: e.target.value })}
                                    className="w-full border border-zinc-300 rounded p-2"
                                />

                                <button
                                    type="submit"
                                    className="w-full cursor-pointer bg-pink-300 hover:bg-pink-400 text-zinc-800 py-2 rounded font-semibold transition"
                                >
                                    Salvar endereço
                                </button>
                            </form>
                        </div>
                    </div>
                )
            }
        </div >
    );
}

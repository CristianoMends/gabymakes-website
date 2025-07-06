import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { FiUser, FiMapPin, FiLogOut, FiShoppingCart, FiChevronDown, FiChevronUp } from 'react-icons/fi';
import HeaderVariant from '../components/header-variant';

export default function UserPage() {
    const { id } = useParams();

    const [userData, setUserData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        role: '',
    });

    // Simulação de itens do carrinho
    const [cartItems] = useState([
        { id: 'p1', name: 'Produto 1', quantity: 2, price: 'R$ 50,00' },
        { id: 'p2', name: 'Produto 2', quantity: 1, price: 'R$ 30,00' },
    ]);
    // Apenas um endereço
    const [address] = useState(
        { id: 1, street: 'Rua das Flores, 123', city: 'São Paulo', zip: '01234-567' }
    );

    useEffect(() => {
        const storedUser = localStorage.getItem('currentUser');
        if (storedUser) {
            const parsedUser = JSON.parse(storedUser);
            if (parsedUser.id === id) {
                setUserData({
                    firstName: parsedUser.firstName,
                    lastName: parsedUser.lastName,
                    email: parsedUser.email,
                    role: parsedUser.role,
                });
            }
        }
    }, [id]);

    const handleLogout = () => {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('currentUser');
        window.location.href = '/';
    };

    const [openDropdown, setOpenDropdown] = useState('');

    const toggleDropdown = (section) => {
        setOpenDropdown(openDropdown === section ? '' : section);
    };

    return (
        <div className="fixed inset-0 bg-pink-50 flex items-stretch justify-stretch">
            <div className="flex flex-col w-full h-full">
                <HeaderVariant />
                <div className="flex-1 flex flex-col justify-center items-center">
                    <div className="w-full h-full bg-white rounded-none p-4 md:p-10">
                        <div className="text-center mb-8">
                            <h1 className="text-3xl md:text-4xl font-bold text-pink-500">
                                Olá, {userData.firstName}
                            </h1>
                            <p className="text-sm text-gray-600">Gerencie sua conta e seu carrinho</p>
                        </div>

                        <div className="flex flex-col gap-4">
                            {/* Dados pessoais */}
                            <div className="bg-pink-100 rounded-xl">
                                <button
                                    className="w-full flex items-center justify-between p-4 font-medium text-pink-700"
                                    onClick={() => toggleDropdown('dados')}
                                >
                                    <span className="flex items-center gap-2"><FiUser /> Dados pessoais</span>
                                    {openDropdown === 'dados' ? <FiChevronUp /> : <FiChevronDown />}
                                </button>
                                {openDropdown === 'dados' && (
                                    <div className="px-4 pb-4 text-gray-700 text-sm">
                                        <div><strong>Nome:</strong> {userData.firstName} {userData.lastName}</div>
                                        <div><strong>Email:</strong> {userData.email}</div>
                                        <div><strong>ID:</strong> <span className="font-mono text-xs">{id}</span></div>
                                        <div><strong>Tipo:</strong> {userData.role}</div>
                                    </div>
                                )}
                            </div>
                            {/* Meu carrinho */}
                            <div className="bg-pink-100 rounded-xl">
                                <button
                                    className="w-full flex items-center justify-between p-4 font-medium text-pink-700"
                                    onClick={() => toggleDropdown('carrinho')}
                                >
                                    <span className="flex items-center gap-2"><FiShoppingCart /> Meu carrinho</span>
                                    {openDropdown === 'carrinho' ? <FiChevronUp /> : <FiChevronDown />}
                                </button>
                                {openDropdown === 'carrinho' && (
                                    <div className="px-4 pb-4 text-gray-700 text-sm">
                                        {cartItems.length === 0 ? (
                                            <div>Seu carrinho está vazio.</div>
                                        ) : (
                                            <ul>
                                                {cartItems.map(item => (
                                                    <li key={item.id} className="mb-2">
                                                        <strong>{item.name}</strong><br />
                                                        Quantidade: {item.quantity}<br />
                                                        Preço: {item.price}
                                                    </li>
                                                ))}
                                            </ul>
                                        )}
                                    </div>
                                )}
                            </div>
                            {/* Endereço */}
                            <div className="bg-pink-100 rounded-xl">
                                <button
                                    className="w-full flex items-center justify-between p-4 font-medium text-pink-700"
                                    onClick={() => toggleDropdown('endereco')}
                                >
                                    <span className="flex items-center gap-2"><FiMapPin /> Endereço</span>
                                    {openDropdown === 'endereco' ? <FiChevronUp /> : <FiChevronDown />}
                                </button>
                                {openDropdown === 'endereco' && (
                                    <div className="px-4 pb-4 text-gray-700 text-sm">
                                        {address ? (
                                            <div>
                                                {address.street}, {address.city} - {address.zip}
                                            </div>
                                        ) : (
                                            <div>Nenhum endereço cadastrado.</div>
                                        )}
                                    </div>
                                )}
                            </div>
                            {/* Sair */}
                            <div className="bg-pink-100 rounded-xl flex items-center justify-center">
                                <button
                                    className="flex items-center gap-2 text-pink-700 font-medium p-4"
                                    onClick={handleLogout}
                                >
                                    <FiLogOut /> Sair
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

import { useState, useEffect, useMemo } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Wallet } from '@mercadopago/sdk-react';
import { HiTrash, HiX } from 'react-icons/hi';
import { PulseLoader } from 'react-spinners';
import ConfirmationModal from '../components/confirmationModal';

// Componentes que você já deve ter
import HeaderVariant from '../components/header-variant';
import Footer from '../components/footer';
import Loading from '../components/loading';
import Message from '../components/message';

// URL da sua API
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export default function BuyNowPage() {
    // --- Hooks de Roteamento ---
    const { userId } = useParams();

    const location = useLocation();
    const navigate = useNavigate();

    const [confirmation, setConfirmation] = useState(null);

    // --- Estado da Página ---
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState(null);

    // Estado do Produto
    const [product, setProduct] = useState(null);
    const [quantity, setQuantity] = useState(1);

    // Estado de Endereços
    const [addresses, setAddresses] = useState([]);
    const [selectedAddress, setSelectedAddress] = useState(null);
    const [showAddressModal, setShowAddressModal] = useState(false);
    const [addressForm, setAddressForm] = useState({ street: '', city: '', state: '', zipCode: '' });

    // Estado para os selects de Estado/Cidade (IBGE)
    const [estados, setEstados] = useState([]);
    const [cidades, setCidades] = useState([]);

    // Estado do Pagamento
    const [preferenceId, setPreferenceId] = useState(null);
    const [isPaymentLoading, setIsPaymentLoading] = useState(false);

    // --- Lógica de Inicialização ---

    // 1. Ler o produto e quantidade da URL
    useEffect(() => {
        const searchParams = new URLSearchParams(location.search);
        const urlProductId = searchParams.get('productId');
        const urlQuantity = parseInt(searchParams.get('quantity'), 10) || 1;

        if (!urlProductId) {
            setMessage({ type: 'error', text: 'Nenhum produto especificado.' });
            setTimeout(() => navigate('/'), 2000);
            return;
        }

        setQuantity(urlQuantity);

        // 2. Buscar os dados do produto na API
        const fetchProduct = async () => {
            try {
                setLoading(true);
                const res = await fetch(`${API_BASE_URL}/products/${urlProductId}`);
                if (!res.ok) throw new Error('Produto não encontrado');
                const data = await res.json();
                setProduct(data);
            } catch (err) {
                console.error(err);
                setMessage({ type: 'error', text: 'Produto não encontrado.' });
                setTimeout(() => navigate('/'), 3000);
            } finally {
                setLoading(false);
            }
        };

        fetchProduct();
    }, [location.search, navigate]);

    // 3. Buscar os endereços do usuário
    useEffect(() => {
        if (!userId) {
            setLoading(false);
            return;
        }

        const fetchAddresses = async () => {
            const res = await fetch(`${API_BASE_URL}/address/user/${userId}`);
            if (res.ok) {
                const data = await res.json();
                setAddresses(data);
                if (data.length > 0) {
                    setSelectedAddress(data[0]);
                }
            }
        };

        fetchAddresses();
    }, [userId]);

    // 4. Buscar estados e cidades da API do IBGE
    useEffect(() => {
        axios.get('https://servicodados.ibge.gov.br/api/v1/localidades/estados?orderBy=nome')
            .then(response => setEstados(response.data))
            .catch(err => console.error("Erro ao buscar estados:", err));
    }, []);

    useEffect(() => {
        if (!addressForm.state) return;
        const selectedState = estados.find(e => e.sigla === addressForm.state);
        if (!selectedState) return;

        axios.get(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${selectedState.id}/municipios?orderBy=nome`)
            .then(response => {
                setCidades(response.data);
                setAddressForm(f => ({ ...f, city: '' }));
            })
            .catch(err => console.error("Erro ao buscar cidades:", err));
    }, [addressForm.state, estados]);

    // --- Funções (Handlers) ---

    const handleAddAddress = async (e) => {
        e.preventDefault();
        if (!userId) {
            setMessage({ type: 'error', text: 'Você precisa estar logado para adicionar um endereço.' });
            return;
        }

        try {
            const res = await axios.post(`${API_BASE_URL}/address`, { ...addressForm, userId });
            const newAddr = res.data;
            setAddresses(prev => [...prev, newAddr]);
            setSelectedAddress(newAddr);
            setShowAddressModal(false);
            setAddressForm({ street: '', city: '', state: '', zipCode: '' });
            setMessage({ type: 'success', text: 'Endereço salvo!' });
        } catch (err) {
            setMessage({ type: 'error', text: 'Falha ao salvar endereço.' });
        }
    };

    const handlePayment = async () => {
        if (!userId) {

            setConfirmation({
                title: 'Faça login na sua conta!',
                text: 'Para gerar pagamento, faça login na sua conta.',
                confirmText: 'Fazer login',
                onConfirm: () => navigate('/login')
            });
            return;
        }
        if (!selectedAddress) {
            setMessage({ type: 'error', text: 'Por favor, escolha um endereço de entrega.' });
            return;
        }
        if (!product) return;

        setIsPaymentLoading(true);
        try {
            const items = [{ id: String(product.id), quantity: quantity }];
            const body = {
                items: items,
                addressId: selectedAddress.id,
                userId: userId,
            };
            const response = await axios.post(`${API_BASE_URL}/payment/create`, body);

            if (response.data.id) {

                localStorage.setItem('userId', userId);
                localStorage.setItem('addressId', selectedAddress.id);

                window.location.href = response.data.init_point;
                setPreferenceId(response.data.id);
            } else {
                throw new Error('ID de preferência não recebido.');
            }
        } catch (error) {
            console.error("Erro ao criar preferência de pagamento:", error);
            setMessage({ type: 'error', text: 'Não foi possível iniciar o pagamento. Tente novamente.' });
        } finally {
            setIsPaymentLoading(false);
        }
    };

    // --- Cálculos de Total ---
    const subtotal = product ? product.price * quantity : 0;
    const totalDiscount = product ? subtotal * ((product.discount || 0) / 100) : 0;
    const totalFinal = subtotal - totalDiscount;

    document.title = 'Finalizar Compra';
    if (loading || !product) return <Loading />;

    return (
        <div className="font-sans space-y-8 min-h-screen bg-white text-zinc-800">
            {confirmation && (
                <ConfirmationModal
                    title={confirmation.title}
                    message={confirmation.text}
                    onConfirm={() => { confirmation.confirm || navigate('/login') }}
                    onCancel={() => setConfirmation(null)}
                    confirmText={confirmation.confirmText}
                    cancelText='Cancelar'
                />
            )}

            {message && <Message type={message.type} message={message.text} onClose={() => setMessage(null)} />}
            <HeaderVariant />

            <div className="flex flex-col md:flex-row md:justify-between gap-6 p-4 md:p-6">

                {/* Coluna da Esquerda: Endereço */}
                <section className="flex-1 bg-white p-6 rounded-lg shadow border border-gray-200">
                    <h2 className="text-2xl font-bold text-gray-800 mb-5">Endereço de entrega</h2>
                    {addresses.length > 0 ? (
                        <ul className="space-y-4">
                            {addresses.map((address) => (
                                <li
                                    key={address.id}
                                    onClick={() => setSelectedAddress(address)}
                                    className={`flex justify-between items-center p-4 rounded-lg border-2 transition-all cursor-pointer ${selectedAddress?.id === address.id
                                        ? 'border-pink-400 bg-pink-50'
                                        : 'border-gray-200 hover:border-gray-300'
                                        }`}
                                >
                                    <p className="text-sm text-gray-700">
                                        {address.street}, {address.city} - {address.state}, {address.zipCode}
                                    </p>
                                    {selectedAddress?.id === address.id && <span className="text-xs font-semibold text-pink-600">SELECIONADO</span>}
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-sm text-gray-500 italic text-center py-4">Nenhum endereço cadastrado.</p>
                    )}
                    <button
                        onClick={() => setShowAddressModal(true)}
                        className="mt-6 w-full bg-pink-300 hover:bg-pink-400 text-black cursor-pointer text-sm font-semibold py-2.5 rounded-lg transition-all duration-200 shadow-sm">
                        Adicionar novo endereço
                    </button>
                </section>

                {/* Coluna da Direita: Resumo e Pagamento */}
                <section className="w-full md:w-[38%] bg-white p-6 rounded-lg shadow flex flex-col border border-gray-200">
                    <h2 className="text-2xl font-semibold mb-4">Resumo da Compra</h2>

                    <div className="flex items-center gap-4 border-b border-gray-200 pb-4 mb-4">
                        <img src={product.imageUrl} alt={product.description} className="w-24 h-24 object-contain rounded-md bg-gray-100" />
                        <div className="flex-1">
                            <p className="text-base font-medium text-gray-800">{product.description}</p>
                            <p className="text-sm text-gray-600">Quantidade: {quantity}</p>
                            <p className="font-semibold text-lg mt-1">R$ {Number(product.price).toFixed(2).replace('.', ',')}</p>
                        </div>
                    </div>

                    <div className="space-y-2 flex-grow">
                        <div className="flex justify-between text-sm text-gray-600"><span>Subtotal</span><span>R$ {subtotal.toFixed(2).replace('.', ',')}</span></div>
                        <div className="flex justify-between text-sm font-semibold text-green-600"><span>Desconto</span><span>- R$ {totalDiscount.toFixed(2).replace('.', ',')}</span></div>
                        <div className="flex justify-between text-xl font-bold mt-4 border-t border-gray-200 pt-3"><span>Total</span><span>R$ {totalFinal.toFixed(2).replace('.', ',')}</span></div>
                    </div>

                    <div className="mt-6">
                        {isPaymentLoading && <div className="text-center p-4"><PulseLoader size={12} color='#fba6d4' /></div>}

                        {preferenceId ? (
                            <Wallet initialization={{ preferenceId: preferenceId }} customization={{ texts: { valueProp: 'smart_option' } }} />
                        ) : (
                            <button onClick={handlePayment} disabled={isPaymentLoading} className="w-full bg-cyan-500 hover:bg-cyan-600 text-black px-5 py-3 rounded-lg font-semibold transition-all cursor-pointer disabled:bg-zinc-400 disabled:cursor-not-allowed">
                                {isPaymentLoading ? 'Gerando Pagamento...' : 'Finalizar e Pagar'}
                            </button>
                        )}
                    </div>
                </section>
            </div>

            {/* Modal para Adicionar Endereço */}
            {showAddressModal && (
                <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-lg shadow-xl w-full max-w-lg p-6 relative">
                        <button onClick={() => setShowAddressModal(false)} className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"><HiX size={24} /></button>
                        <h3 className="text-lg font-semibold mb-4">Adicionar novo endereço</h3>
                        <form onSubmit={handleAddAddress} className="grid grid-cols-2 gap-4 text-sm">
                            <input required placeholder="Rua e Número" value={addressForm.street} onChange={(e) => setAddressForm({ ...addressForm, street: e.target.value })} className="col-span-2 border border-gray-300 rounded-md p-2 focus:outline-pink-400" />
                            <select required value={addressForm.state} onChange={(e) => setAddressForm({ ...addressForm, state: e.target.value })} className="border border-gray-300 rounded-md p-2 focus:outline-pink-400">
                                <option value="">Selecione o Estado</option>
                                {estados.map(e => <option key={e.id} value={e.sigla}>{e.nome}</option>)}
                            </select>
                            <select required value={addressForm.city} disabled={!addressForm.state} onChange={(e) => setAddressForm({ ...addressForm, city: e.target.value })} className="border border-gray-300 rounded-md p-2 focus:outline-pink-400 disabled:bg-gray-100">
                                <option value="">Selecione a Cidade</option>
                                {cidades.map(c => <option key={c.id} value={c.nome}>{c.nome}</option>)}
                            </select>
                            <input required placeholder="CEP (somente números)" value={addressForm.zipCode} onChange={(e) => setAddressForm({ ...addressForm, zipCode: e.target.value })} className="col-span-2 border border-gray-300 rounded-md p-2 focus:outline-pink-400" />
                            <button type="submit" className="col-span-2 bg-pink-400 hover:bg-pink-500 text-white py-2.5 rounded-md font-semibold cursor-pointer transition">Salvar Endereço</button>
                        </form>
                    </div>
                </div>
            )}
            <Footer />
        </div>
    );
}
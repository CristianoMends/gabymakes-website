import { useState, useEffect, useRef, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { HiTrash, HiPlus, HiMinus, HiX } from 'react-icons/hi';
import { HiOutlineCloudArrowUp } from "react-icons/hi2";
import Loading from '../components/loading';
import Message from '../components/message';
import HeaderVariant from '../components/header-variant';
import Footer from '../components/footer';
import { Wallet } from '@mercadopago/sdk-react';
import axios from 'axios';
import { PulseLoader } from 'react-spinners';


const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export default function CheckoutPage() {
    const { userId: userIdFromParams } = useParams();

    /* ---------------- estado ---------------- */
    const [loading, setLoading] = useState(true);
    const [addresses, setAddresses] = useState([]); // lista completa
    const [selected, setSelected] = useState(null); // endereço em uso
    const [showModal, setShowModal] = useState(false); // modal aberto?
    const [form, setForm] = useState({
        street: '',
        city: '',
        state: '',
        zipCode: '',
    });

    const [cartItems, setCartItems] = useState([]);
    const [isSyncing, setIsSyncing] = useState(false);
    const pendingUpdates = useRef({});
    const debounceTimer = useRef(null);
    const userId = userIdFromParams === 'guest' ? null : userIdFromParams;

    const [frete, setFrete] = useState(0);
    const [message, setMessage] = useState(null);

    const [preferenceId, setPreferenceId] = useState(null);
    const [isPaymentLoading, setIsPaymentLoading] = useState(false);

    /* para selects */
    const [estados, setEstados] = useState([]);
    const [cidades, setCidades] = useState([]);

    useEffect(() => {
        const fetchAndCalculateCart = async () => {
            setLoading(true);
            let items = [];
            if (userId) {
                try {
                    const res = await fetch(`${API_BASE_URL}/cart-item/${userId}`);
                    if (res.ok) items = await res.json();
                } catch (err) { console.error(err); }
            } else {
                items = JSON.parse(localStorage.getItem('cart')) || [];
            }

            const formattedItems = items.map(item => ({
                ...item,
                product: {
                    ...item.product,
                    price: Number(item.product.price),
                    discount: Number(item.product.discount) || 0,
                },
                quantity: Number(item.quantity),
            }));

            setCartItems(formattedItems);
            setLoading(false);
        };

        fetchAndCalculateCart();
    }, [userId]);

    const syncUpdates = async () => {
        const updates = { ...pendingUpdates.current };
        pendingUpdates.current = {};

        if (!userId || Object.keys(updates).length === 0) {
            setIsSyncing(false);
            return;
        }

        setIsSyncing(true);
        try {
            await Promise.all(
                Object.entries(updates).map(([productId, quantity]) => {

                    if (quantity <= 0) {
                        return axios.delete(`${API_BASE_URL}/cart-item/remove`, {
                            data: {
                                userId: userId,
                                productId: productId,
                            },
                        });
                    }
                    else {
                        const itemToUpdate = cartItems.find(
                            (item) => (item.product?.id || item.id) === productId
                        );

                        if (!itemToUpdate) return Promise.resolve();


                        return axios.patch(`${API_BASE_URL}/cart-item/update-quantity`, {
                            userId: userId,
                            itemId: itemToUpdate.id,
                            quantity: quantity,
                        });
                    }
                })
            );

        } catch (err) {
            console.error('Erro ao sincronizar carrinho:', err);
            setMessage({ type: 'error', text: 'Erro ao salvar alterações no carrinho.' });
        } finally {
            setIsSyncing(false);
        }
    };

    const scheduleSync = () => {
        if (debounceTimer.current) clearTimeout(debounceTimer.current);
        if (userId) setIsSyncing(true);
        debounceTimer.current = setTimeout(syncUpdates, 1500);
    };

    const handleUpdateQuantity = (productId, newQuantity) => {
        if (newQuantity < 1) return;

        setCartItems((currentItems) => {
            const updatedItems = currentItems.map((item) => {
                const itemProductId = item.product?.id || item.id;
                if (itemProductId === productId) {
                    return { ...item, quantity: newQuantity };
                }
                return item;
            });

            if (!userId) localStorage.setItem('cart', JSON.stringify(updatedItems));
            return updatedItems;
        });

        pendingUpdates.current[productId] = newQuantity;
        scheduleSync();
    };

    const handleRemove = (productId) => {
        setCartItems((currentItems) => {
            const updatedItems = currentItems.filter((item) => (item.product?.id || item.id) !== productId);
            if (!userId) localStorage.setItem('cart', JSON.stringify(updatedItems));
            return updatedItems;
        });

        pendingUpdates.current[productId] = 0;
        scheduleSync();
    };


    /* ------------- fetch endereços ------------ */
    useEffect(() => {
        async function fetchAddresses() {
            setLoading(true);
            const res = await fetch(`${API_BASE_URL}/address/user/${userId}`);
            if (res.ok) {
                const data = await res.json();
                setAddresses(data);
                setSelected(data[0] || null);
            }
            setLoading(false);
        }
        if (userId) fetchAddresses();
    }, [userId]);

    /* ------------- fetch estados IBGE ------------ */
    useEffect(() => {
        async function fetchEstados() {
            try {
                const res = await fetch(
                    'https://servicodados.ibge.gov.br/api/v1/localidades/estados'
                );
                if (res.ok) {
                    const data = await res.json();
                    // Ordena por nome
                    data.sort((a, b) => a.nome.localeCompare(b.nome));
                    setEstados(data);
                }
            } catch (err) {
                console.error('Erro ao buscar estados:', err);
            }
        }
        fetchEstados();
    }, []);

    /* ------------- fetch cidades IBGE quando muda estado ------------ */
    useEffect(() => {
        async function fetchCidades() {
            if (!form.state) {
                setCidades([]);
                setForm((f) => ({ ...f, city: '' }));
                return;
            }
            try {
                // form.state será a sigla do estado (ex: 'SP')
                // Buscar o id do estado no array estados para usar na API
                const estadoSelecionado = estados.find((e) => e.sigla === form.state);
                if (!estadoSelecionado) return;

                const res = await fetch(
                    `https://servicodados.ibge.gov.br/api/v1/localidades/estados/${estadoSelecionado.id}/municipios`
                );
                if (res.ok) {
                    const data = await res.json();
                    data.sort((a, b) => a.nome.localeCompare(b.nome));
                    setCidades(data);
                    // Resetar cidade se não pertence ao novo estado
                    setForm((f) => ({ ...f, city: '' }));
                }
            } catch (err) {
                console.error('Erro ao buscar cidades:', err);
            }
        }
        fetchCidades();
    }, [form.state, estados]);

    const handlePayment = async () => {
        if (!selected) {
            setMessage({ type: 'error', text: 'Por favor, escolha um endereço de entrega.' });
            return;
        }

        const items = cartItems.map(p => {
            const product = p.product || p; 
            return {
                id: String(product.id), 
                quantity: p.quantity
            };
        });

        console.log('Enviando para o backend:', { items });
        setIsPaymentLoading(true);
        try {
            const response = await axios.post(`${API_BASE_URL}/payment/create`, { items });

            if (response.data.id) {
                setPreferenceId(response.data.id);
                setIsPaymentLoading(false);
                setMessage({ type: 'success', text: 'Pagamento gerado com sucesso.' });
            } else {
                setMessage({ type: 'error', text: 'Não foi possível gerar a preferência de pagamento.' });
                setIsPaymentLoading(false);
            }
        } catch (error) {
            console.error("Erro ao criar preferência de pagamento:", error);
            setMessage({ type: 'error', text: 'Não foi possível iniciar o pagamento. Tente novamente.' });
            setIsPaymentLoading(false);
        }
    };



    /* ------------- helpers endereço ------------ */
    const handleRemoveAddress = async (id) => {
        await fetch(`${API_BASE_URL}/address/${id}`, { method: 'DELETE' });
        setAddresses((prev) => prev.filter((a) => a.id !== id));
        if (selected?.id === id) setSelected(null);
    };

    const finalizarViaWhatsapp = () => {
        if (!selected) {
            setMessage({ type: 'error', text: 'Escolha um endereço antes de finalizar o pedido.' });
            return;
        }

        const textoProdutos = cartItems
            .map((p) => `- ${(p.product?.description || '').slice(0, 100)} (${p.quantity}x) R$ ${p.product?.price.replace('.', ',')}`)
            .join('\n');

        const textoEndereco = `${selected.street}, ${selected.city} - ${selected.state}, ${selected.zipCode}`;

        const mensagem = encodeURIComponent(
            `Olá, gostaria de fazer o pedido:\n${textoProdutos}\n\nEndereço de entrega:\n${textoEndereco}\n\nTotal: R$ ${subtotal.toFixed(2).replace('.', ',')}`
        );

        const isMobile = /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

        const phone = '5588999900549';

        const url = isMobile
            ? `https://wa.me/${phone}?text=${mensagem}`
            : `https://web.whatsapp.com/send?phone=${phone}&text=${mensagem}`;

        window.open(url, '_blank');
    };



    /* --------- CÁLCULOS REATIVOS --------- */
    const { subtotal, totalDiscount } = useMemo(() => {
        let sub = 0;
        let discount = 0;

        for (const item of cartItems) {
            const product = item.product || item;
            const itemSubtotal = product.price * item.quantity;
            sub += itemSubtotal;

            if (product.discount > 0) {
                const itemDiscount = itemSubtotal * (product.discount / 100);
                discount += itemDiscount;
            }
        }
        return { subtotal: sub, totalDiscount: discount };
    }, [cartItems]);

    const totalFinal = (subtotal - totalDiscount) + frete;

    const handleAdd = async (e) => {
        e.preventDefault();

        const body = {
            ...form,
            userId: userId,
        };

        const res = await fetch(`${API_BASE_URL}/address`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body),
        });

        if (res.ok) {
            const newAddr = await res.json();
            setAddresses((prev) => [...prev, newAddr]);
            setForm({ street: '', city: '', state: '', zipCode: '' });
            setMessage({ type: 'success', text: 'Endereço salvo com sucesso!' });
        } else {
            const err = await res.json();
            setMessage({ type: 'error', text: err.message || 'Falha ao salvar endereço' });
        }
    };

    document.title = 'Checkout'

    if (loading) return <Loading />;

    return (
        <div className="font-sans space-y-8 min-h-screen bg-white text-zinc-800">
            {loading && <Loading />}
            {message && (
                <Message type={message.type} message={message.text} onClose={() => setMessage(null)} />
            )}

            <HeaderVariant />

            <div className="flex flex-col md:flex-row md:justify-between gap-6 p-6 bg-white rounded">

                <section className="flex-1 bg-white p-6 rounded shadow border border-gray-300">
                    <h2 className="text-2xl font-bold text-gray-800 mb-5">Endereço de entrega</h2>

                    {addresses?.length ? (
                        <ul className="space-y-4">
                            {addresses.map((address, index) => {
                                const isSelected = selected?.id === address.id;
                                return (
                                    <li
                                        key={index}
                                        onClick={() => { setSelected(address) }}
                                        className={`flex justify-between items-center p-4 rounded border transition-all cursor-pointer ${isSelected
                                            ? 'border-pink-300 bg-pink-50'
                                            : 'border-gray-200 hover:border-gray-300'
                                            }`}
                                    >
                                        <div>
                                            <p className="text-sm text-gray-600 leading-relaxed">
                                                {address.street}, {address.city} - {address.state}, {address.zipCode}
                                            </p>
                                            {isSelected && (
                                                <span className="inline-block mt-2 text-xs font-semibold text-pink-600 bg-pink-100 rounded px-2 py-0.5">
                                                    Selecionado
                                                </span>
                                            )}

                                        </div>

                                        <button
                                            onClick={() => handleRemoveAddress(address.id)}
                                            className="text-red-500 hover:text-red-700 cursor-pointer"
                                        >
                                            <HiTrash />
                                        </button>
                                    </li>
                                );
                            })}
                        </ul>
                    ) : (
                        <p className="text-sm text-gray-500 italic">Nenhum endereço cadastrado.</p>
                    )}

                    <button
                        onClick={() => setShowModal(true)}
                        className="mt-6 w-full bg-pink-300 hover:bg-pink-400 text-black cursor-pointer text-sm font-semibold py-2.5 rounded transition-all duration-200 shadow-sm"
                    >
                        Adicionar endereço
                    </button>
                </section>


                <section className="w-[35%] min-h-[300px] bg-white p-6 rounded shadow flex flex-col justify-between border border-gray-300">
                    <h2 className="text-2xl font-semibold mb-6">Resumo</h2>
                    <div>
                        <div className="flex justify-between text-sm text-zinc-600">
                            <span>Subtotal ({cartItems.length} iten(s))</span>
                            <span>R$ {subtotal.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-sm text-zinc-600">
                            <span>Frete</span>
                            <span>R$ {frete.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-sm font-semibold text-green-600">
                            <span>Desconto</span>
                            <span>- R$ {(totalDiscount).toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-lg font-bold mt-4 border-t pt-2">
                            <span>Total</span>
                            <span>R$ {totalFinal.toFixed(2)}</span>
                        </div>
                    </div>

                    <div className="mt-6 space-y-3">
                        <div className='w-full flex justify-center items-center'>
                            <PulseLoader
                                loading={isPaymentLoading}
                                color='#fba6d4'
                            />
                        </div>


                        {/* QUANDO O ID DA PREFERÊNCIA EXISTIR, RENDERIZE O BOTÃO DO MERCADO PAGO */}
                        {preferenceId && (
                            <Wallet
                                initialization={{ preferenceId: preferenceId }}
                                customization={{ texts: { valueProp: 'smart_option' } }}
                                onSubmit={() => {

                                }}
                                onReady={() => {

                                }}
                                onError={() => {

                                }}
                            />
                        )}

                        {/* SE O BOTÃO DE PAGAMENTO AINDA NÃO FOI GERADO */}
                        {!preferenceId && !isPaymentLoading && (
                            <>
                                <button
                                    onClick={handlePayment}
                                    disabled={isPaymentLoading || cartItems.length === 0}
                                    className="w-full bg-cyan-500 hover:bg-cyan-600 text-white px-5 py-3 rounded font-semibold transition cursor-pointer disabled:bg-zinc-400"
                                >
                                    {isPaymentLoading ? 'Gerando pagamento...' : 'Gerar pagamento'}
                                </button>

                                <button
                                    onClick={finalizarViaWhatsapp}
                                    disabled={cartItems.length === 0}
                                    className="w-full bg-green-500 hover:bg-green-600 text-white px-5 py-3 rounded font-semibold transition cursor-pointer disabled:bg-zinc-400"
                                >
                                    Finalizar via WhatsApp
                                </button>
                            </>
                        )}
                    </div>
                </section>
            </div>

            {/* --- Modal de endereços --- */}
            {showModal && (
                <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
                    <div className="bg-white rounded-lg shadow-lg w-full max-w-lg p-6 relative">
                        <button
                            onClick={() => setShowModal(false)}
                            className="absolute top-3 right-3 text-zinc-500 cursor-pointer hover:text-zinc-700"
                        >
                            <HiX size={24} />
                        </button>

                        <h3 className="text-lg font-semibold mt-6 mb-3">Adicionar endereço</h3>
                        <form onSubmit={handleAdd} className="grid grid-cols-2 gap-4 text-sm">
                            <input
                                required
                                placeholder="Rua ex. Av. Paulista, 123"
                                value={form.street}
                                onChange={(e) => setForm({ ...form, street: e.target.value })}
                                className="col-span-2 border border-zinc-300 rounded p-2 focus:outline-pink-400"
                            />
                            <select
                                required
                                value={form.state}
                                onChange={(e) => setForm({ ...form, state: e.target.value })}
                                className="border border-zinc-300 rounded p-2 focus:outline-pink-400"
                            >
                                <option value="">Selecione o Estado</option>
                                {estados.map((e) => (
                                    <option key={e.id} value={e.sigla}>
                                        {e.nome} ({e.sigla})
                                    </option>
                                ))}
                            </select>
                            <select
                                required
                                value={form.city}
                                onChange={(e) => setForm({ ...form, city: e.target.value })}
                                disabled={!form.state}
                                className="border border-zinc-300 rounded p-2 focus:outline-pink-400"
                            >
                                <option value="">
                                    {form.state ? 'Selecione a Cidade' : 'Selecione um Estado primeiro'}
                                </option>
                                {cidades.map((c) => (
                                    <option key={c.id} value={c.nome}>
                                        {c.nome}
                                    </option>
                                ))}
                            </select>
                            <input
                                required
                                placeholder="CEP ex. 12345-678"
                                value={form.zipCode}
                                onChange={(e) => setForm({ ...form, zipCode: e.target.value })}
                                className="col-span-2 border border-zinc-300 rounded p-2 focus:outline-pink-400"
                            />
                            <button
                                type="submit"
                                className="col-span-2 bg-pink-300 hover:bg-pink-400 text-black py-2 rounded font-semibold cursor-pointer transition"
                            >
                                Salvar endereço
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {/* --- Produtos no carrinho --- */}
            <section className="border border-gray-300 rounded p-6 shadow mx-6">
                <div className="flex items-center gap-2 mb-4">
                    <h2 className="text-xl font-semibold">Produtos ({cartItems.length})</h2>
                    {isSyncing && (
                        <span className="flex items-center gap-1 text-sm text-gray-500">
                            <HiOutlineCloudArrowUp className="animate-pulse" /> Salvando...
                        </span>
                    )}
                </div>
                {cartItems.map((item) => {
                    const product = item.product;
                    const productId = product.id;
                    return (
                        <div key={product.id} className="flex items-center gap-4 border-b last:border-b-0 py-4">
                            <img
                                src={product.imageUrl}
                                alt={product.description}
                                className="w-20 h-20 object-contain rounded"
                            />
                            <div className="flex-1">
                                <p className="text-zinc-800 text-sm">{product.description}</p>
                                <p className="font-semibold mt-1">
                                    R$ {product.price}
                                </p>
                            </div>
                            <div className="flex items-center gap-2 border rounded px-2 py-1">
                                <button className='cursor-pointer' onClick={() => handleUpdateQuantity(productId, item.quantity - 1)}>
                                    <HiMinus />
                                </button>
                                <span>{item.quantity}</span>
                                <button className='cursor-pointer' onClick={() => handleUpdateQuantity(productId, item.quantity + 1)}>
                                    <HiPlus />
                                </button>
                            </div>
                            <button className='cursor-pointer' onClick={() => handleRemove(productId)}>
                                <HiTrash size={20} />
                            </button>
                        </div>
                    )
                })}
            </section>

            <Footer />
        </div>
    );
}

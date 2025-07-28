import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { HiTrash, HiPlus, HiMinus, HiX } from 'react-icons/hi';
import LoadingCircles from '../components/loading';
import Message from '../components/message';
import HeaderVariant from '../components/header-variant';
import Footer from '../components/footer';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export default function CheckoutPage() {
    const { userId } = useParams();

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
    const [message, setMessage] = useState(null);

    /* para selects */
    const [estados, setEstados] = useState([]);
    const [cidades, setCidades] = useState([]);

    /* ------ carrinho dummy para exemplo ------ */
    const [produtos, setProdutos] = useState([]);


    /* ------------- fetch endereços ------------ */
    useEffect(() => {
        async function fetchAddresses() {
            setLoading(true);
            const res = await fetch(`${API_BASE_URL}/address/user/${userId}`);
            if (res.ok) {
                const data = await res.json(); // supondo array
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
    /*
        // Buscar produtos do carrinho do usuário
        useEffect(() => {
            async function fetchCartProducts() {
                if (!userId) return;
                setLoading(true);
                try {
                    const res = await fetch(`${API_BASE_URL}/cart-item/${userId}`);
                    if (res.ok) {
                        const data = await res.json();
                        // mapear para um formato mais simples para o front
                        const produtosFormatados = data.map((item) => ({
                            id: item.id,
                            nome: item.product.name,
                            preco: Number(item.product.price),
                            quantidade: item.quantity,
                            imagem: item.product.imageUrl || '/img.jpg', // adapta caso não tenha imagem
                        }));
                        setProdutos(produtosFormatados);
                    } else {
                        setProdutos([]);
                    }
                } catch (error) {
                    console.error('Erro ao buscar carrinho:', error);
                    setProdutos([]);
                }
                setLoading(false);
            }
            fetchCartProducts();
        }, [userId]);*/


    /* ------------- helpers endereço ------------ */
    const handleRemove = async (id) => {
        await fetch(`${API_BASE_URL}/address/${id}`, { method: 'DELETE' });
        setAddresses((prev) => prev.filter((a) => a.id !== id));
        if (selected?.id === id) setSelected(null);
    };

    /* --------- Buscar produtos do carrinho --------- */
    useEffect(() => {
        async function fetchCartProducts() {
            if (!userId) return;
            setLoading(true);
            try {
                const res = await fetch(`${API_BASE_URL}/cart-item/${userId}`);
                if (res.ok) {
                    const data = await res.json();
                    const produtosFormatados = data.map((item) => ({
                        id: item.id,               // ID do item no carrinho
                        productId: item.product.id, // ID do produto
                        nome: item.product.description,
                        preco: Number(item.product.price),
                        quantidade: item.quantity,
                        imagem: item.product.imageUrl || '/img.jpg',
                    }));
                    setProdutos(produtosFormatados);
                } else {
                    setProdutos([]);
                }
            } catch (error) {
                console.error('Erro ao buscar carrinho:', error);
                setProdutos([]);
            }
            setLoading(false);
        }
        fetchCartProducts();
    }, [userId]);


    /* --------- Remover produto no backend --------- */
    const removerProduto = async (itemId) => {
        try {
            const res = await fetch(`${API_BASE_URL}/cart/remove/${itemId}`, {
                method: 'DELETE',
            });
            if (res.ok) {
                setProdutos((produtosAntigos) => produtosAntigos.filter((p) => p.id !== itemId));
            } else {
                console.error('Falha ao remover produto');
            }
        } catch (err) {
            console.error('Erro ao remover produto:', err);
        }
    };

    const finalizarPedido = async () => {
        if (!selected) {
            setMessage({ type: 'error', text: 'Escolha um endereço antes de finalizar o pedido.' });
            return;
        }

        const pedido = {
            userId,
            addressId: selected.id,
            items: produtos.map((p) => ({
                productId: p.id,
                quantity: p.quantidade,
            })),
        };

        try {
            const res = await fetch(`${API_BASE_URL}/order/create`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(pedido),
            });

            if (res.ok) {
                const data = await res.json();
                setMessage({ type: 'success', text: `Pedido ${data.orderNumber || data.id} criado com sucesso!` });
            } else {
                const err = await res.json();
                setMessage({ type: 'error', text: err.message || 'Erro ao criar pedido.' });
            }
        } catch (error) {
            setMessage({ type: 'error', text: `Erro na rede: ${error.message}` });
        }
    };

    const finalizarViaWhatsapp = () => {
        if (!selected) {
            setMessage({ type: 'error', text: 'Escolha um endereço antes de finalizar o pedido.' });
            return;
        }

        const textoProdutos = produtos
            .map((p) => `- ${p.nome.slice(0, 100)} (${p.quantidade}x) R$ ${p.preco.toFixed(2).replace('.', ',')}`)
            .join('\n');

        const textoEndereco = `${selected.street}, ${selected.city} - ${selected.state}, ${selected.zipCode}`;

        const mensagem = encodeURIComponent(
            `Olá, gostaria de fazer o pedido:\n${textoProdutos}\n\nEndereço de entrega:\n${textoEndereco}\n\nTotal: R$ ${total.toFixed(2).replace('.', ',')}`
        );

        const isMobile = /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

        const phone = '5588999900549';

        const url = isMobile
            ? `https://wa.me/${phone}?text=${mensagem}`
            : `https://web.whatsapp.com/send?phone=${phone}&text=${mensagem}`;

        window.open(url, '_blank');
    };



    /* --------- Cálculo total --------- */
    const total = produtos.reduce((acc, p) => acc + p.preco * p.quantidade, 0);

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

    const alterarQuantidade = (id, delta) => {
        setProdutos((prod) =>
            prod.map((p) =>
                p.id === id ? { ...p, quantidade: Math.max(1, p.quantidade + delta) } : p
            )
        );
    };

    document.title = 'Checkout'

    return (
        <div className="font-sans space-y-8 min-h-screen bg-white text-zinc-800">
            {loading && <LoadingCircles />}
            {message && (
                <Message type={message.type} message={message.text} onClose={() => setMessage(null)} />
            )}

            <HeaderVariant />

            {/* --- Endereço + Resumo --- */}
            <div className="flex flex-col md:flex-row md:justify-between gap-6 p-6 bg-zinc-50 border border-zinc-200 rounded shadow">
                <section className="flex-1 max-w-md bg-white p-6 rounded shadow">
                    <h2 className="text-2xl font-semibold mb-4">Endereço de entrega</h2>
                    {selected ? (
                        <>
                            <p className="text-lg font-medium">{selected.user?.name} {selected.user?.phone}</p>
                            <p className="text-sm text-zinc-600">
                                {selected.street}, {selected.city} - {selected.state}, {selected.zipCode}
                            </p>
                        </>
                    ) : (
                        <p className="text-sm text-zinc-500">Nenhum endereço cadastrado.</p>
                    )}
                    <button
                        onClick={() => setShowModal(true)}
                        className="mt-6 bg-pink-300 hover:bg-pink-400 text-black px-5 py-2 rounded font-semibold transition cursor-pointer"
                    >
                        Alterar
                    </button>
                </section>

                <section className="max-w-xs bg-white p-6 rounded shadow flex flex-col justify-between">
                    <h2 className="text-2xl font-semibold mb-6">Resumo</h2>
                    <div className="flex justify-between text-lg font-semibold mb-1">
                        <span>Total</span>
                        <span>R$ {total.toFixed(2).replace('.', ',')}</span>
                    </div>
                    {/*<p className="text-xs text-zinc-600 mb-6">ou 3x de R$ {(total / 3).toFixed(2).replace('.', ',')} sem juros</p>*/}
                    {/* <button
                        onClick={finalizarPedido}
                        className="mb-3 bg-pink-300 hover:bg-pink-400 text-black px-5 py-2 rounded font-semibold transition cursor-pointer"
                    >
                        Finalizar pedido
                    </button> */}
                    <button
                        onClick={finalizarViaWhatsapp}
                        className="bg-pink-300 hover:bg-pink-400 text-black px-5 py-2 rounded font-semibold transition cursor-pointer"
                    >
                        Finalizar via WhatsApp
                    </button>
                </section>
            </div>

            {/* --- Modal de endereços --- */}
            {showModal && (
                <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
                    <div className="bg-white rounded-lg shadow-lg w-full max-w-lg p-6 relative">
                        <button
                            onClick={() => setShowModal(false)}
                            className="absolute top-3 right-3 text-zinc-500 hover:text-zinc-700"
                        >
                            <HiX size={24} />
                        </button>

                        <h3 className="text-xl font-semibold mb-4">Meus endereços</h3>
                        <ul className="space-y-2 max-h-40 overflow-auto">
                            {addresses.map((addr) => (
                                <li
                                    key={addr.id}
                                    className="border rounded p-3 flex justify-between items-start"
                                >
                                    <label className="flex-1 cursor-pointer text-zinc-800">
                                        <input
                                            type="radio"
                                            checked={selected?.id === addr.id}
                                            onChange={() => setSelected(addr)}
                                            className="mr-2"
                                        />
                                        {addr.street}, {addr.city} - {addr.state}
                                    </label>
                                    <button
                                        onClick={() => handleRemove(addr.id)}
                                        className="text-red-500 hover:text-red-700 cursor-pointer"
                                    >
                                        <HiTrash />
                                    </button>
                                </li>
                            ))}
                        </ul>

                        <h4 className="text-lg font-semibold mt-6 mb-3">Adicionar endereço</h4>
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
            <section className="bg-zinc-50 border border-zinc-200 rounded p-6 shadow mx-6">
                <h2 className="text-xl font-semibold mb-4">Produtos ({produtos.length})</h2>
                {produtos.map((p) => (
                    <div
                        key={p.id}
                        className="flex items-center gap-4 border-b last:border-b-0 py-4"
                    >
                        <img
                            src={p.imagem}
                            alt={p.nome}
                            className="w-20 h-20 object-contain rounded"
                        />
                        <div className="flex-1">
                            <p className="text-zinc-800 text-sm">{p.nome}</p>
                            <p className="font-semibold mt-1">
                                R$ {p.preco.toFixed(2).replace('.', ',')}
                            </p>
                        </div>
                        <div className="flex items-center gap-2 border rounded px-2 py-1">
                            <button
                                onClick={() => alterarQuantidade(p.id, -1)}
                                className="text-pink-500 hover:text-pink-700 cursor-pointer"
                            >
                                <HiMinus />
                            </button>
                            <span>{p.quantidade}</span>
                            <button
                                onClick={() => alterarQuantidade(p.id, 1)}
                                className="text-pink-500 hover:text-pink-700 cursor-pointer"
                            >
                                <HiPlus />
                            </button>
                        </div>
                        <button
                            onClick={() => removerProduto(p.id)}
                            className="text-gray-400 hover:text-red-500 cursor-pointer"
                            aria-label="Remover produto"
                        >
                            <HiTrash size={20} />
                        </button>
                    </div>
                ))}
            </section>

            <Footer />
        </div>
    );
}

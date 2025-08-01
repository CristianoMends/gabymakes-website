import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import axios from 'axios';
import { HiCheckCircle } from 'react-icons/hi';
import LoadingCircles from '../components/loading'; // Reutilize seu componente de loading

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export default function PaymentSuccessPage() {
    const [searchParams] = useSearchParams();
    const [loading, setLoading] = useState(true);
    const [paymentDetails, setPaymentDetails] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        const paymentId = searchParams.get('payment_id');
        const status = searchParams.get('status');

        if (paymentId && status === 'approved') {
            // Função para verificar o pagamento no seu backend
            const verifyPayment = async () => {
                try {
                    // Chamada para um novo endpoint no seu backend
                    const response = await axios.get(`${API_BASE_URL}/payment/status/${paymentId}`);
                    setPaymentDetails(response.data);
                } catch (err) {
                    setError('Não foi possível verificar seu pagamento. Entre em contato com o suporte.');
                    console.error('Erro ao verificar pagamento:', err);
                } finally {
                    setLoading(false);
                }
            };
            verifyPayment();
        } else {
            setError('Dados de pagamento inválidos ou pagamento não aprovado.');
            setLoading(false);
        }
    }, [searchParams]);

    if (loading) {
        return <LoadingCircles />;
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 text-center p-4">
            {error ? (
                <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-md">
                    <h1 className="text-2xl font-bold text-red-600">Erro na Confirmação</h1>
                    <p className="text-gray-600 mt-2">{error}</p>
                </div>
            ) : (
                <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-md">
                    <HiCheckCircle className="text-green-500 text-6xl mx-auto mb-4" />
                    <h1 className="text-2xl font-bold text-gray-800">Pagamento Aprovado!</h1>
                    <p className="text-gray-600 mt-2">Obrigado pela sua compra! Seu pedido foi confirmado com sucesso.</p>
                    <div className="text-left text-sm text-gray-500 mt-6 border-t pt-4">
                        <p><strong>ID do Pagamento:</strong> {paymentDetails?.id}</p>
                        {/* Você pode adicionar mais detalhes aqui, como o número do pedido */}
                    </div>
                    <Link to="/" className="mt-8 inline-block bg-pink-500 hover:bg-pink-600 text-white font-bold py-2 px-4 rounded transition">
                        Voltar para a Loja
                    </Link>
                </div>
            )}
        </div>
    );
}
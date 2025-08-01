import { Link, useSearchParams } from 'react-router-dom';
import { HiXCircle } from 'react-icons/hi';

export default function PaymentFailurePage() {
    const [searchParams] = useSearchParams();
    const status = searchParams.get('status');
    const paymentId = searchParams.get('payment_id');

    const getFailureMessage = () => {
        if (status === 'rejected') {
            return 'Seu pagamento foi recusado. Por favor, tente novamente com outro método de pagamento ou entre em contato com seu banco.';
        }
        return 'Ocorreu um problema ao processar seu pagamento. Por favor, tente novamente.';
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 text-center p-4">
            <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-md">
                <HiXCircle className="text-red-500 text-6xl mx-auto mb-4" />
                <h1 className="text-2xl font-bold text-gray-800">Pagamento Falhou</h1>
                <p className="text-gray-600 mt-2">{getFailureMessage()}</p>
                <div className="text-left text-sm text-gray-500 mt-6 border-t pt-4">
                    <p><strong>ID da Tentativa:</strong> {paymentId}</p>
                </div>
                <Link to="/checkout/seu-user-id" className="mt-8 inline-block bg-gray-800 hover:bg-gray-900 text-white font-bold py-2 px-4 rounded transition">
                    Tentar Novamente
                </Link>
            </div>
        </div>
    );
}
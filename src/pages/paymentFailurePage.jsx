import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

export default function PaymentFailure() {
    const location = useLocation();
    const [message, setMessage] = useState("Carregando...");

    useEffect(() => {
        const params = new URLSearchParams(location.search);

        const collectionId = params.get("collection_id");
        const collectionStatus = params.get("collection_status");
        const status = params.get("status");

        // Caso 1: Usuário apenas clicou em voltar (tudo null)
        if (
            collectionId === "null" &&
            collectionStatus === "null" &&
            status === "null"
        ) {
            setMessage("Você voltou para o site sem concluir o pagamento.");
            return;
        }

        // Caso 2: Pagamento recusado/rejeitado
        if (
            status?.toLowerCase() === "rejected" ||
            collectionStatus?.toLowerCase() === "rejected"
        ) {
            setMessage("Seu pagamento foi recusado. Tente novamente.");
            return;
        }

        // Caso 3: Pagamento pendente
        if (
            status?.toLowerCase() === "pending" ||
            collectionStatus?.toLowerCase() === "pending"
        ) {
            setMessage("Seu pagamento está pendente. Aguarde a confirmação.");
            return;
        }

        // Caso 4: Qualquer outra situação
        setMessage("Ocorreu um problema ao processar seu pagamento.");
    }, [location.search]);

    return (
        <div className="flex flex-col items-center justify-center min-h-screen text-center px-4">
            <h1 className="text-3xl font-bold mb-4 text-red-600">Pagamento não concluído</h1>
            <p className="text-lg">{message}</p>

            <button
                className="mt-6 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                onClick={() => (window.location.href = "/")}
            >
                Voltar para o site
            </button>
        </div>
    );
}

import { useState, useEffect } from "react";
import AdminProductList from "./adminProductList";
import AdminProductCreate from "./adminProductCreate";
import AdminProductEdit from "./adminProductEdit";
import PageNotFound from "../pages/pageNotFound";

export default function AdminProduct({ page = "list" }) {
    const [currentPage, setCurrentPage] = useState(page);
    const [selectedId, setSelectedId] = useState(null);

    useEffect(() => {
        let title = "Gerenciar Produtos | GabyMakes Admin";
        if (currentPage === "create") {
            title = "Adicionar Produto | GabyMakes Admin";
        } else if (currentPage === "edit") {
            title = "Editar Produto | GabyMakes Admin";
        }
        document.title = title;
    }, [currentPage]);

    const renderContent = () => {
        switch (currentPage) {
            case "list":
                return (
                    <div className="bg-white p-6 rounded-lg shadow-lg border border-gray-200">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-semibold text-gray-700 mb-4">Lista de Produtos</h2>
                            <button
                                onClick={() => setCurrentPage("create")}
                                className="bg-pink-300 text-gray-900 px-6 py-2 rounded-md self-start font-semibold
                                   hover:bg-pink-400 cursor-pointer transition-colors duration-200
                                   disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-pink-500"
                            >
                                Adicionar Novo Produto
                            </button>
                        </div>
                        <AdminProductList
                            onEdit={(id) => {
                                setSelectedId(id);
                                setCurrentPage("edit");
                            }}
                        />
                    </div>
                );

            case "create":
                return (
                    <div className="bg-white p-6 rounded-lg shadow-lg border border-gray-200">
                        <h2 className="text-xl font-semibold text-gray-700 mb-4">Criar Novo Produto</h2>
                        <AdminProductCreate
                            onCancel={() => setCurrentPage("list")}
                            onSuccess={() => setCurrentPage("list")}
                        />
                    </div>
                );

            case "edit":
                return (
                    <div className="bg-white p-2 rounded-lg shadow-lg border border-gray-200">
                        <h2 className="text-2xl font-bold text-gray-800 text-center">Editar Produto</h2>
                        <AdminProductEdit
                            id={selectedId}
                            onEdit={() => setCurrentPage("list")}
                            onCancel={() => setCurrentPage("list")}
                        />
                    </div>
                );

            default:
                return <PageNotFound />;
        }
    };

    return (
        <div className="container mx-auto p-4 sm:p-6 lg:p-8 bg-gray-50 min-h-screen">
            {/* Título Principal Adicionado Aqui */}
            <h1 className="text-3xl font-extrabold text-gray-800 mb-6 text-center">Gerenciar Produtos</h1>

            {renderContent()}
        </div>
    );
}
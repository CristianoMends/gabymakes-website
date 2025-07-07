import { useState } from "react";
import { FiBox, FiStar, FiImage, FiLogOut, FiHome } from "react-icons/fi"; // ⬅️ Importa ícone de sair
import logo from "../assets/logo-bg-transparent-1.png";
import AdminProduct from "./adminProduct";

import Message from "../components/message";
import LoadingCircles from "../components/loading";
import ConfirmationModal from "../components/confirmationModal";

export default function AdminPage() {
    const [page, setPage] = useState("products");

    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState(null);
    const [showConfirmLogout, setShowConfirmLogout] = useState(false);


    const handleLogout = () => {
        setShowConfirmLogout(true);
    };

    const confirmLogout = () => {
        setShowConfirmLogout(false);
        setLoading(true);

        setTimeout(() => {
            localStorage.removeItem("accessToken");
            localStorage.removeItem("currentUser");
            setLoading(false);
            setMessage({ type: "success", text: "Logout realizado com sucesso." });
            setTimeout(() => (window.location.href = "/"), 1000);
        }, 500);
    };

    const cancelLogout = () => {
        setShowConfirmLogout(false);
    };

    const renderPage = () => {
        switch (page) {
            case "products":
                return <AdminProduct page="list" />;
            case "highlights":
                return <div className="p-4">Gestão de destaques (em breve)</div>;
            case "banners":
                return <div className="p-4">Gestão de banners (em breve)</div>;
            default:
                return <div className="p-4">Página não encontrada</div>;
        }
    };

    return (
        <div className="h-screen flex bg-[#fafafa]">

            {loading && (
                <LoadingCircles />
            )}

            {/* Mensagem */}
            {message && (
                <Message
                    type={message.type}
                    message={message.text}
                    onClose={() => setMessage(null)}
                />
            )}

            {showConfirmLogout && (
                <ConfirmationModal
                    title="Confirmação de Logout"
                    message="Tem certeza que deseja sair?"
                    confirmText="Sair"
                    cancelText="Cancelar"
                    onConfirm={confirmLogout}
                    onCancel={cancelLogout}
                />
            )}

            {/* Sidebar */}
            <aside className="w-64 border-r shadow-sm bg-pink-300 flex flex-col justify-between">
                {/* Topo com logo e botões */}
                <div>
                    <div className="flex items-center gap-2 p-4">
                        <div className="h-20 w-full overflow-hidden ml-10 mr-10">
                            <img
                                src={logo}
                                alt="GabyMakes Logo"
                                className="h-full w-full object-fit"
                            />
                        </div>
                    </div>

                    <nav className="flex flex-col gap-1 p-2 text-sm">
                        <SidebarButton
                            active={page === "products"}
                            onClick={() => setPage("products")}
                            icon={<FiBox className="h-4 w-4" />}
                        >
                            Produtos
                        </SidebarButton>

                        <SidebarButton
                            active={page === "highlights"}
                            onClick={() => setPage("highlights")}
                            icon={<FiStar className="h-4 w-4" />}
                        >
                            Destaques
                        </SidebarButton>

                        <SidebarButton
                            active={page === "banners"}
                            onClick={() => setPage("banners")}
                            icon={<FiImage className="h-4 w-4" />}
                        >
                            Banners
                        </SidebarButton>
                    </nav>
                </div>

                {/* Botões de Home e Sair */}
                <div className="p-2 flex gap-2">
                    <button
                        onClick={() => (window.location.href = "/")}
                        className="flex cursor-pointer items-center justify-center gap-2 px-3 py-2 text-gray-700 hover:bg-gray-100 rounded w-full"
                    >
                        <FiHome className="h-4 w-4" />
                        Home
                    </button>

                    <button
                        onClick={handleLogout}
                        className="flex items-center cursor-pointer justify-center gap-2 px-3 py-2 text-gray-700 hover:bg-gray-100 rounded w-full"
                    >
                        <FiLogOut className="h-4 w-4" />
                        Sair
                    </button>
                </div>

            </aside>

            <main className="flex-1 p-6">{renderPage()}</main>
        </div>
    );
}

function SidebarButton({ active, onClick, icon, children }) {
    return (
        <button
            onClick={onClick}
            className={`flex items-center cursor-pointer gap-2 w-full rounded px-3 py-2 text-left hover:bg-gray-100 ${active ? "bg-gray-100 font-semibold" : "text-gray-700"
                }`}
        >
            {icon}
            {children}
        </button>
    );
}

import { useState } from "react";
import AdminProductList from "../components/adminProductList";
import AdminProductCreate from "../components/adminProductCreate";
import AdminProductEdit from "../components/adminProductEdit";
import PageNotFound from "./pageNotFound";

export default function AdminProduct({ page = "list" }) {
    const [currentPage, setCurrentPage] = useState(page);
    const [selectedId, setSelectedId] = useState(null);

    switch (currentPage) {
        case "list":
            return (
                <div>

                    <div className="mb-4">
                        <button
                            onClick={() => setCurrentPage("create")}
                            className="bg-pink-300 cursor-pointer hover:bg-[#ff94b3] text-black font-semibold px-4 py-2 rounded shadow"
                        >
                            Adicionar produto
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
                <div>
                    <AdminProductCreate
                        onCancel={() => setCurrentPage("list")}
                        onSuccess={() => setCurrentPage("list")}
                    />
                </div>
            );

        case "edit":
            return (
                <div>
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
}

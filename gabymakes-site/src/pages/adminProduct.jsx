import { useState } from "react";
import AdminProductList from "../components/adminProductList";
import AdminProductCreate from "../components/adminProductCreate";
import AdminProductEdit from "../components/adminProductEdit";
import PageNotFound from "./pageNotFound";
import Breadcrumb from "../components/breadcrumb";

export default function AdminProduct({ page = "list" }) {

    const [currentPage, setCurrentPage] = useState(page);
    const [selectedId, setSelectedId] = useState(null);

    switch (currentPage) {
        case "list":
            return (
                <div>
                    <Breadcrumb />
                    <div className="mb-4">
                        <button
                            onClick={() => setCurrentPage("create")}
                            className="bg-pink-300 hover:bg-[#ff94b3] text-black font-semibold px-4 py-2 rounded shadow"
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
                    <Breadcrumb />
                    <AdminProductCreate
                        onCancel={() => setCurrentPage("list")}
                        onSuccess={() => setCurrentPage("list")}
                    />
                </div>
            );

        case "edit":
            return (
                <div>
                    <Breadcrumb />
                    <AdminProductEdit
                        id={selectedId}
                        onEdit={() => setCurrentPage("list")}
                        onCancel={() => setCurrentPage("list")}
                        onSuccess={() => setCurrentPage("list")}
                    />
                </div >
            );

        default:
            return <PageNotFound />;
    }
}

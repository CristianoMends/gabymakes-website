import { useEffect, useState } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";
import Message from "../components/message";
import LoadingCircles from "../components/loading";
import ProductPopup from "../components/ProductPopup";
import ConfirmationModal from "../components/confirmationModal";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

export default function AdminProductList({ onEdit }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState(null);
  const [idSelecionado, setIdSelecionado] = useState(null);
  const [open, setOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);
  const [search, setSearch] = useState("");
  const [isActive, setIsActive] = useState("all");

  const handleDelete = (productId) => {
    setProductToDelete(productId);
  };

  const confirmDeleteProduct = async () => {
    if (!productToDelete) return;
    setLoading(true);

    try {
      const res = await fetch(`${API_URL}/products/${productToDelete}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });

      if (!res.ok) throw new Error("Erro ao excluir produto");

      setProducts(products.filter((p) => p.id !== productToDelete));
      setMsg({ type: "success", text: "Produto excluído com sucesso!" });
    } catch (err) {
      setMsg({ type: "error", text: err.message });
    } finally {
      setProductToDelete(null);
      setLoading(false);
    }
  };

  const cancelDelete = () => {
    setProductToDelete(null);
  };

  const fetchProducts = () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (search) params.append("description", search);
    if (isActive !== "all") params.append("isActive", isActive === "true");

    fetch(`${API_URL}/products/search?${params.toString()}`)
      .then((res) => res.json())
      .then((data) => setProducts(data))
      .catch(() =>
        setMsg({ type: "error", text: "Erro ao carregar produtos" })
      )
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <div className="bg-[#fafafa] p-6">
      {loading && <LoadingCircles className="mb-4" />}
      {msg && (
        <Message
          type={msg.type}
          message={msg.text}
          onClose={() => setMsg(null)}
        />
      )}

      <div className="bg-white rounded-lg shadow p-4 overflow-x-auto">
        <div className="mb-4 flex gap-4">
          <input
            type="text"
            placeholder="Buscar por nome, marca ou categoria"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border border-gray-300 border rounded px-2 py-1 w-full max-w-sm"
          />
          <select
            value={isActive}
            onChange={(e) => setIsActive(e.target.value)}
            className="border border-gray-300 rounded px-2 py-1"
          >
            <option value="all">Todos</option>
            <option value="true">Ativos</option>
            <option value="false">Inativos</option>
          </select>
          <button
            onClick={fetchProducts}
            className="bg-pink-300 text-white px-4 py-1 rounded cursor-pointer hover:bg-pink-400 transition-colors duration-200"
          >
            Buscar
          </button>
        </div>

        <table className="w-full text-left border-collapse">
          <thead>
            <tr>
              <th className="py-2 px-3">Foto</th>
              <th className="px-3">Nome do Produto</th>
              <th className="px-3">Quantidade</th>
              <th className="px-3">Ativo</th>
              <th className="px-3">Editar</th>
              <th className="px-3">Excluir</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                <td className="py-2 px-3">
                  <img
                    src={product.imageUrl}
                    alt={product.description}
                    className="w-12 h-12 object-cover rounded cursor-pointer"
                    onClick={() => {
                      setIdSelecionado(product.id);
                      setOpen(true);
                    }}
                  />
                </td>
                <td className="px-3">{product.description}</td>
                <td className="px-3">{product.quantity}</td>
                <td className="px-3">{ }{product.isActive ? "Sim" : "Não"}</td>
                <td className="px-3">
                  <button
                    className="text-gray-700 hover:text-purple-500 cursor-pointer"
                    onClick={() => onEdit(product.id)}
                  >
                    <FaEdit />
                  </button>
                </td>
                <td>
                  <button
                    disabled={!product.isActive}
                    type="button"
                    className="text-red-600 hover:text-red-800 cursor-pointer disabled:cursor-not-allowed disabled:text-gray-500"
                    onClick={() => handleDelete(product.id)}
                  >
                    <FaTrash />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="flex justify-end gap-2 mt-4">
          <button
            className="cursor-pointer px-2 py-1 border rounded text-gray-500"
            disabled
          >
            &lt;
          </button>
          <button className="cursor-pointer px-2 py-1 border rounded bg-purple-500 text-white">
            1
          </button>
          <button className="cursor-pointer px-2 py-1 border rounded text-gray-500">
            &gt;
          </button>
        </div>
        <ProductPopup
          productId={idSelecionado}
          isOpen={open}
          onClose={() => setOpen(false)}
        />

        {!!productToDelete &&
          <ConfirmationModal
            isOpen={!!productToDelete}
            title="Confirmar Exclusão"
            message="Tem certeza de que deseja excluir este produto?"
            onConfirm={confirmDeleteProduct}
            onCancel={cancelDelete}
          />
        }
      </div>
    </div>
  );
}

import { useEffect, useState } from "react";
import { FaEdit } from "react-icons/fa";          // ⬅️ Removido FaTrash
import Message from "../components/message";
import LoadingCircles from "../components/loading";
import ProductPopup from "../components/ProductPopup";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

export default function AdminProductList({ onEdit }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState(null);
  const [idSelecionado, setIdSelecionado] = useState(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    fetch(API_URL + "/products")
      .then((res) => res.json())
      .then((data) => setProducts(data))
      .catch(() =>
        setMsg({ type: "error", text: "Erro ao carregar produtos" })
      )
      .finally(() => setLoading(false));
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
        <table className="w-full text-left border-collapse">
          <thead>
            <tr>
              <th className="py-2 px-3">Foto</th>
              <th className="px-3">Nome do Produto</th>
              <th className="px-3">Quantidade em estoque</th>
              <th className="px-3">Editar</th>
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
                <td className="px-3">
                  <button
                    className="text-gray-700 hover:text-purple-500 cursor-pointer"
                    onClick={() => onEdit(product.id)}
                  >
                    <FaEdit />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* paginação fake / estática */}
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
      </div>
    </div>
  );
}

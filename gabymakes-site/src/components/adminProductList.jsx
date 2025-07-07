import { useEffect, useState } from "react";
import { FaEdit } from "react-icons/fa";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

export default function AdminProductList({ onEdit }) {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetch(API_URL + "/products")
      .then((response) => response.json())
      .then((data) => setProducts(data))
      .catch(() => setProducts([]));
  }, []);

  return (
    <div className="bg-[#fafafa] p-6">


      {/* Tabela */}
      <div className="bg-white rounded-lg shadow p-4 overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr>
              <th className="py-2 px-3">Foto</th>
              <th className="px-3">Nome do Produto</th>
              <th className="px-3">Quantidade em estoque</th>
              <th className="px-3">Editar Produto</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product, index) => (
              <tr key={index} className="hover:bg-gray-50 transition-colors">
                <td className="py-2 px-3">
                  <img
                    src={product.imageUrl}
                    alt={product.description}
                    className="w-12 h-12 object-cover rounded"
                  />
                </td>
                <td className="px-3">{product.description}</td>
                <td className="px-3">{product.quantity}</td>
                <td className="px-3">
                  <button className="text-gray-700 hover:cursor-pointer hover:text-pink-500"
                    onClick={() => onEdit(product.id)}>
                    <FaEdit />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Paginação */}
        <div className="flex justify-end gap-2 mt-4">
          <button className="px-2 py-1 border rounded text-gray-500 hover:bg-gray-100" disabled>&lt;</button>
          <button className="px-2 py-1 border rounded bg-purple-500 text-white">1</button>
          <button className="px-2 py-1 border rounded">2</button>
          <span className="px-2 py-1">...</span>
          <button className="px-2 py-1 border rounded">9</button>
          <button className="px-2 py-1 border rounded">10</button>
          <button className="px-2 py-1 border rounded text-gray-500 hover:bg-gray-100">&gt;</button>
        </div>
      </div>
    </div>
  );
}

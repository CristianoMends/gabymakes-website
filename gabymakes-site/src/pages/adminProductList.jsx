import { useEffect, useState } from "react";
import { FaEdit } from "react-icons/fa";
import { Link } from "react-router-dom";

export default function AdminProductList() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetch("http://localhost:3000/products")
      .then((response) => response.json())
      .then((data) => setProducts(data))
      .catch(() => setProducts([]));
  }, []);

  return (
    <div className="bg-[#fafafa] min-h-screen p-6">
      {/* Caminho de navegação */}
      <p className="text-gray-600 mb-4"> <a href="/admin/products">Home </a>&gt; <a href="/admin/products"> administrador</a> &gt; <a href="/admin/products"> produtos </a></p>

      {/* Botão Adicionar Produto */}
      <div className="mb-4">
        <Link
          to="/admin/products/create"
          className="bg-[#FFA5BD] hover:bg-[#ff94b3] text-blcak font-semibold px-5 py-2 rounded shadow"
        >
          Adicionar produto
        </Link>
      </div>

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
                  <Link to={`/admin/products/edit/${product.id}`}>
                    <button className="text-gray-700 hover:cursor-pointer hover:text-pink-500">
                      <FaEdit />
                    </button>
                  </Link>
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

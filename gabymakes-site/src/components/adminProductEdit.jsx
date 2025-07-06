import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

export default function AdminProductEdit({ onEdit, onCancel }) {
  const { id } = useParams();
  const [form, setForm] = useState({
    description: "",
    price: "",
    quantity: "",
    brand: "",
    category: "",
    imageUrl: "",
  });

  useEffect(() => {
    if (!id) return;
    fetch(`${API_URL}/products/${id}`)
      .then((r) => r.json())
      .then((data) =>
        setForm({
          description: data.description,
          price: String(data.price),
          quantity: String(data.quantity),
          brand: data.brand,
          category: data.category,
          imageUrl: data.imageUrl,
        })
      );
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const response = await fetch(`${API_URL}/products/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        description: form.description,
        price: Number(form.price),
        quantity: Number(form.quantity),
        brand: form.brand,
        category: form.category,
        imageUrl: form.imageUrl,
      }),
    });

    if (response.ok) {
      alert("Produto atualizado com sucesso!");
      onEdit?.(); // chama callback se definido
    } else {
      alert("Erro ao atualizar produto.");
    }
  };

  return (
    <div className="bg-[#fafafa] min-h-screen p-6">
      <h2 className="text-xl font-bold mb-4">Editar Produto</h2>
      <form
        onSubmit={handleSubmit}
        className="border rounded p-6 bg-white max-w-5xl mx-auto"
      >
        <div className="flex flex-col gap-4">
          <input
            type="text"
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="Nome do produto"
            className="border rounded px-3 py-2 w-full"
          />
          <input
            type="number"
            name="price"
            value={form.price}
            onChange={handleChange}
            placeholder="Preço"
            className="border rounded px-3 py-2 w-full"
            step="0.01"
          />
          <input
            type="number"
            name="quantity"
            value={form.quantity}
            onChange={handleChange}
            placeholder="Quantidade"
            className="border rounded px-3 py-2 w-full"
          />
          <input
            type="text"
            name="brand"
            value={form.brand}
            onChange={handleChange}
            placeholder="Marca"
            className="border rounded px-3 py-2 w-full"
          />
          <input
            type="text"
            name="category"
            value={form.category}
            onChange={handleChange}
            placeholder="Categoria"
            className="border rounded px-3 py-2 w-full"
          />
          <input
            type="text"
            name="imageUrl"
            value={form.imageUrl}
            onChange={handleChange}
            placeholder="URL da imagem"
            className="border rounded px-3 py-2 w-full"
          />

          <div className="flex gap-3">
            <button
              type="submit"
              className="bg-[#FFA5BD] hover:bg-[#ff94b3] text-white font-semibold px-6 py-2 rounded shadow"
            >
              Salvar alterações
            </button>

            {onCancel && (
              <button
                type="button"
                onClick={onCancel}
                className="px-6 py-2 border rounded shadow"
              >
                Cancelar
              </button>
            )}
          </div>
        </div>
      </form>
    </div>
  );
}

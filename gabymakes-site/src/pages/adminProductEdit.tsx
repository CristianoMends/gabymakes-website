import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

export default function AdminProductEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    description: "",
    price: "",
    quantity: "",
    brand: "",
    category: "",
    imageUrl: "",
  });

  useEffect(() => {
    fetch(`http://localhost:3000/products/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setForm({
          description: data.description,
          price: String(data.price),
          quantity: String(data.quantity),
          brand: data.brand,
          category: data.category,
          imageUrl: data.imageUrl,
        });
      });
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await fetch(`http://localhost:3000/products/${id}`, {
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
      navigate("/admin/products");
    } else {
      alert("Erro ao atualizar produto.");
    }
  };

  return (
    <div className="bg-[#fafafa] min-h-screen p-6">
      <h2 className="text-xl font-bold mb-4">Editar Produto</h2>
      <form onSubmit={handleSubmit} className="border rounded p-6 bg-white max-w-5xl mx-auto">
        {/* Repita os campos do formulário de criação, mas usando value={form.campo} */}
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
          <button
            type="submit"
            className="bg-[#FFA5BD] hover:bg-[#ff94b3] text-white font-semibold px-6 py-2 rounded shadow w-fit"
          >
            Salvar alterações
          </button>
        </div>
      </form>
    </div>
  );
}
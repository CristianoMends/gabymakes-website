import { useState } from "react";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

export default function AdminProductCreate({ onSuccess, onCancel }) {
  const [form, setForm] = useState({
    price: "",
    quantity: "",
    description: "",
    brand: "",
    category: "",
  });
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setFile(e.target.files?.[0] || null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!file) return alert("Selecione uma imagem.");
    setLoading(true);

    try {
      const uploadData = new FormData();
      uploadData.append("file", file);   

      const token = localStorage.getItem("accessToken"); 
      const uploadRes = await fetch(`${API_URL}/upload`, {
        method: "POST",
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        body: uploadData,
      });

      if (!uploadRes.ok) throw new Error("Falha no upload da imagem.");

      const { url: imageUrl } = await uploadRes.json(); 

      /* 2) Cadastro do produto */
      const productRes = await fetch(`${API_URL}/products`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          ...form,
          price: Number(form.price),
          quantity: Number(form.quantity),
          imageUrl,
        }),
      });

      if (!productRes.ok) throw new Error("Erro ao cadastrar produto.");

      alert("Produto cadastrado com sucesso!");
      setForm({ price: "", quantity: "", description: "", brand: "", category: "" });
      setFile(null);
      onSuccess?.();
    } catch (err) {
      alert(err.message || "Erro inesperado.");
    } finally {
      setLoading(false);
    }
  };

  /** ————— Render ————— */
  return (
    <div className="bg-[#fafafa] min-h-screen p-6">
      <form
        onSubmit={handleSubmit}
        className="border rounded p-6 bg-white max-w-5xl mx-auto"
      >
        <div className="grid md:grid-cols-2 gap-6">
          {/* Coluna esquerda */}
          <div className="flex flex-col gap-4">
            <label className="block">
              <span className="mb-1 font-semibold">Preço</span>
              <input
                type="number"
                name="price"
                value={form.price}
                onChange={handleChange}
                placeholder="0,00"
                className="border rounded px-3 py-2 w-full"
                step="0.01"
                min="0"
              />
            </label>

            <label className="block">
              <span className="mb-1 font-semibold">Quantidade disponível</span>
              <input
                type="number"
                name="quantity"
                value={form.quantity}
                onChange={handleChange}
                placeholder="0"
                className="border rounded px-3 py-2 w-full"
                min="0"
              />
            </label>
          </div>

          {/* Coluna direita */}
          <label className="block">
            <span className="mb-1 font-semibold">Descrição</span>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="insira a descrição"
              className="border rounded px-3 py-2 w-full h-40 resize-none"
            />
          </label>

          <label className="block">
            <span className="mb-1 font-semibold">Marca</span>
            <input
              type="text"
              name="brand"
              value={form.brand}
              onChange={handleChange}
              placeholder="insira a marca"
              className="border rounded px-3 py-2 w-full"
            />
          </label>

          <label className="block">
            <span className="mb-1 font-semibold">Categoria</span>
            <input
              type="text"
              name="category"
              value={form.category}
              onChange={handleChange}
              placeholder="insira a categoria"
              className="border rounded px-3 py-2 w-full"
            />
          </label>
        </div>

        {/* Upload e botões */}
        <div className="mt-6 flex flex-col gap-4 md:w-1/2">
          <label className="block">
            <span className="mb-1 font-semibold">Imagem</span>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="border rounded px-3 py-2 w-full"
            />
          </label>

          <div className="flex gap-2">
            <button
              type="submit"
              disabled={loading}
              className="bg-[#FFA5BD] hover:bg-[#ff94b3] disabled:opacity-60 text-white font-semibold px-6 py-2 rounded shadow"
            >
              {loading ? "Salvando…" : "Adicionar"}
            </button>

            {onCancel && (
              <button
                type="button"
                onClick={onCancel}
                className="border px-6 py-2 rounded shadow"
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

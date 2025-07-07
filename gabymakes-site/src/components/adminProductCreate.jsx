import { useState } from "react";
import LoadingCircles from "./loading";
import Message from "./message";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

export default function AdminProductCreate({ onSuccess, onCancel }) {
  const [form, setForm] = useState({
    price: "",
    quantity: "",
    description: "",
    brand: "",
    category: "",
  });
  const categories = [
    // Maquiagem
    "Base",
    "Corretivo",
    "Pó facial",
    "Blush",
    "Sombra",
    "Máscara de cílios",
    "Delineador",
    "Batom",
    "Gloss",
    "Iluminador",
    "Primer",
    "Fixador de maquiagem",

    // Pele
    "Hidratante facial",
    "Protetor solar",
    "Sabonete facial",
    "Esfoliante facial",
    "Tônico facial",
    "Sérum facial",
    "Máscara facial",

    // Corpo e banho
    "Sabonete corporal",
    "Hidratante corporal",
    "Esfoliante corporal",
    "Desodorante",
    "Óleo corporal",
    "Loção pós-sol",

    // Cabelos
    "Shampoo",
    "Condicionador",
    "Máscara capilar",
    "Leave-in",
    "Óleo capilar",
    "Tônico capilar",
    "Finalizador",
    "Gel/Modelador",

    // Unhas
    "Esmalte",
    "Removedor de esmalte",
    "Fortalecedor de unhas",
    "Kit manicure",

    // Fragrâncias
    "Perfume feminino",
    "Perfume masculino",
    "Body splash",
    "Colônia",

    // Masculino
    "Barbeador",
    "Pós-barba",
    "Espuma de barbear",
    "Balm para barba",

    // Infantil
    "Shampoo infantil",
    "Sabonete infantil",
    "Protetor solar infantil",
    "Colônia infantil",

    // Natural/Vegano
    "Orgânico",
    "Vegano",
    "Cruelty-free",
    "Sem parabenos",
  ].sort();


  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setFile(e.target.files?.[0] || null);
  };

  const validateForm = () => {
    const { price, quantity, description, brand, category } = form;

    if (!price || Number(price) <= 0) {
      setMessage({
        type: "error",
        text: "Informe um preço válido."
      })
      return false;
    }
    if (!quantity || Number(quantity) < 0) {
      setMessage({
        type: "error",
        text: "Informe uma quantidade válida."
      })
      return false;
    }
    if (!description.trim()) {
      setMessage({
        type: "error",
        text: "A descrição é obrigatória."
      })
      return false;
    }
    if (!brand.trim()) {
      setMessage({
        type: "error",
        text: "A marca é obrigatória."
      })
      return false;
    }
    if (!category.trim()) {
      setMessage({
        type: "error",
        text: "A categoria é obrigatória."
      })
      return false;
    }
    if (!file) {
      setMessage({
        type: "error",
        text: "Selecione uma imagem para o produto."
      });
      return false;
    }

    return true;
  };


  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;
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

      if (!uploadRes.ok) {
        setMessage({
          type: "error",
          text: "Erro ao fazer upload da imagem."
        });
        throw new Error("Erro ao fazer upload da imagem.");
      }
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

      if (!productRes.ok) {
        setMessage({
          type: "error",
          text: "Erro ao cadastrar produto."
        });
        throw new Error("Erro ao cadastrar produto.");
      }

      setMessage({
        type: "success",
        text: "Produto cadastrado com sucesso!"
      });
      setForm({ price: "", quantity: "", description: "", brand: "", category: "" });
      setFile(null);
      onSuccess?.();
    } catch (err) {
      setMessage({
        type: "error",
        text: err.message || "Erro inesperado."
      });
    } finally {
      setLoading(false);
    }
  };

  /** ————— Render ————— */
  return (
    <>
      {loading && (
        <LoadingCircles />
      )}
      {message && (
        <Message
          type={message.type}
          message={message.text}
          onClose={() => setMessage(null)}
        />
      )}
      <div className="bg-[#fafafa] p-6">
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
              <select
                name="category"
                value={form.category}
                onChange={handleChange}
                className="border rounded px-3 py-2 w-full"
              >
                <option value="">Selecione uma categoria</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat.toUpperCase()}
                  </option>
                ))}
              </select>
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
                className="bg-[#FFA5BD] cursor-pointer hover:bg-[#ff94b3] disabled:opacity-60 text-white font-semibold px-6 py-2 rounded shadow"
              >
                {loading ? "Salvando…" : "Salvar"}
              </button>

              {onCancel && (
                <button
                  type="button"
                  onClick={onCancel}
                  className="border cursor-pointer px-6 py-2 rounded shadow"
                >
                  Cancelar
                </button>
              )}
            </div>
          </div>
        </form>
      </div>
    </>
  );
}

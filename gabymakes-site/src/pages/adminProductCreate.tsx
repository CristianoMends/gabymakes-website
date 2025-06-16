import { useState } from "react";

export default function AdminProductCreate() {
  const [form, setForm] = useState({
    name: "",
    price: "",
    quantity: "",
    description: "",
    image: null as File | null,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setForm({ ...form, image: file });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log(form);
  };

  return (
    <div className="bg-[#fafafa] min-h-screen p-6">
      <p className="text-gray-600 mb-6"><a href="/admin/products">Home </a>&gt; <a href="/admin/products"> administrador</a> &gt; <a href="/admin/products"> produtos </a> &gt; adicionar produto</p>

      <form
        onSubmit={handleSubmit}
        className="border rounded p-6 bg-white max-w-5xl mx-auto"
      >
        <div className="grid md:grid-cols-2 gap-6">
          {/* Coluna esquerda */}
          <div className="flex flex-col gap-4">
            <div>
              <label className="mb-1 font-semibold block">Nome</label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="insira o nome"
                className="border rounded px-3 py-2 w-full"
              />
            </div>

            <div>
              <label className="mb-1 font-semibold block">Preço</label>
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
            </div>

            <div>
              <label className="mb-1 font-semibold block">Quantidade disponível</label>
              <input
                type="number"
                name="quantity"
                value={form.quantity}
                onChange={handleChange}
                placeholder="0"
                className="border rounded px-3 py-2 w-full"
                min="0"
              />
            </div>
          </div>

          {/* Coluna direita */}
          <div>
            <label className="mb-1 font-semibold block">Descrição</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="insira a descrição"
              className="border rounded px-3 py-2 w-full h-40 resize-none"
            />
          </div>
        </div>

        {/* Campo de imagem e botão */}
        <div className="mt-6 flex flex-col gap-4 md:w-1/2">
          <div>
            <label className="mb-1 font-semibold block">Imagem</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="bg-[#FFA5BD] text-white px-4 py-2 rounded cursor-pointer w-fit"
            />
          </div>

          <button
            type="submit"
            className="bg-[#FFA5BD] hover:bg-[#ff94b3] text-white font-semibold px-6 py-2 rounded shadow w-fit"
          >
            adicionar
          </button>
        </div>
      </form>
    </div>
  );
}

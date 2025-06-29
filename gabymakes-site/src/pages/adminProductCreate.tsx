import { useState } from "react";

export default function AdminProductCreate() {
  const [form, setForm] = useState({
    price: "",
    quantity: "",
    description: "",
    brand: "",
    category: "",
    imageUrl: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("description", form.description);
    formData.append("price", form.price);
    formData.append("quantity", form.quantity);
    formData.append("brand", form.brand);
    formData.append("category", form.category);
    formData.append("imageUrl", form.imageUrl);

    const response = await fetch("http://localhost:3000/products", {
      method: "POST",
      headers: {
        "Content-Type": "application/json", // Não definir Content-Type para FormData
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

    try {
      if (response.ok) {
        alert("Produto cadastrado com sucesso!");
        // Limpar formulário ou redirecionar
      } else {
        alert("Erro ao cadastrar produto.");
      }
    } catch (error) {
      alert("Erro de conexão.");
    }
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

           <div>
              <label className="mb-1 font-semibold block">Marca</label>
              <input
                type="text"
                name="brand"
                value={form.brand}
                onChange={handleChange}
                placeholder="insira a marca"
                className="border rounded px-3 py-2 w-full"
              />
            </div>
            <div>
              <label className="mb-1 font-semibold block">Categoria</label>
              <input
                type="text"
                name="category"
                value={form.category}
                onChange={handleChange}
                placeholder="insira a categoria"
                className="border rounded px-3 py-2 w-full"
              />
            </div>

        </div>

        {/* Campo de imagem e botão */}
        <div className="mt-6 flex flex-col gap-4 md:w-1/2">
          <div>
            <label className="mb-1 font-semibold block">Imagem</label>
            <input
              type="text"
              name="imageUrl"
              value={form.imageUrl}
              onChange={handleChange}
              placeholder="insira a URL da imagem"
              className="border rounded px-3 py-2 w-full"
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

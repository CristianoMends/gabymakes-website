import { useState } from "react";
import { HiCheckCircle, HiXCircle } from "react-icons/hi";
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
    "Base", "Corretivo", "Pó facial", "Blush", "Sombra", "Máscara de cílios",
    "Delineador", "Batom", "Gloss", "Iluminador", "Primer", "Fixador de maquiagem",
    "Hidratante facial", "Protetor solar", "Sabonete facial", "Esfoliante facial",
    "Tônico facial", "Sérum facial", "Máscara facial", "Sabonete corporal",
    "Hidratante corporal", "Esfoliante corporal", "Desodorante", "Óleo corporal",
    "Loção pós-sol", "Shampoo", "Condicionador", "Máscara capilar", "Leave-in",
    "Óleo capilar", "Tônico capilar", "Finalizador", "Gel/Modelador", "Esmalte",
    "Removedor de esmalte", "Fortalecedor de unhas", "Kit manicure",
    "Perfume feminino", "Perfume masculino", "Body splash", "Colônia",
    "Barbeador", "Pós-barba", "Espuma de barbear", "Balm para barba",
    "Shampoo infantil", "Sabonete infantil", "Protetor solar infantil",
    "Colônia infantil", "Orgânico", "Vegano", "Cruelty-free", "Sem parabenos", "Maquiagem", "Creme Facial"
  ].sort();

  const [selectedFile, setSelectedFile] = useState(null);

  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = ({ target }) => {
    const file = target.files?.[0];
    setAnalysis(null);
    setSelectedFile(null);
    setForm((prev) => ({ ...prev, imageUrl: "" }));

    if (!file) {
      return;
    }

    const validTypes = ["image/jpeg", "image/png"];
    const maxSizeBytes = 6.1 * 1024 * 1024;

    const sizeOK = file.size <= maxSizeBytes;
    const typeOK = validTypes.includes(file.type);

    const img = new Image();
    img.onload = () => {
      const { width, height } = img;
      const minSizeOK = width >= 400 && height >= 400;
      const ratioOK = Math.abs(width - height) / Math.max(width, height) <= 0.1;

      setAnalysis({
        width,
        height,
        typeOK,
        sizeOK,
        minSizeOK,
        ratioOK,
        fileType: file.type,
        fileSize: file.size,
      });
      setSelectedFile(file);
      setForm((prev) => ({ ...prev, imageUrl: URL.createObjectURL(file) }));
    };
    img.onerror = () => {
      setAnalysis(null);
      setSelectedFile(null);
      setMsg({ type: "error", text: "Não foi possível carregar a imagem para análise. Verifique o arquivo." });
    };
    img.src = URL.createObjectURL(file);
  };

  const validateForm = () => {
    const { price, quantity, description, brand, category } = form;

    if (!price || Number(price) <= 0) {
      setMessage({ type: "error", text: "Informe um preço válido (maior que zero)." });
      return false;
    }
    if (!quantity || Number(quantity) < 0) {
      setMessage({ type: "error", text: "Informe uma quantidade válida (zero ou mais)." });
      return false;
    }
    if (!description.trim()) {
      setMessage({ type: "error", text: "A descrição é obrigatória." });
      return false;
    }
    if (description.length > 500) {
      setMessage({ type: "error", text: "A descrição não pode ter mais de 100 caracteres." });
      return false;
    }
    if (!brand.trim()) {
      setMessage({ type: "error", text: "A marca é obrigatória." });
      return false;
    }
    if (!category.trim()) {
      setMessage({ type: "error", text: "A categoria é obrigatória." });
      return false;
    }
    if (!selectedFile || !analysis || !analysis.typeOK || !analysis.sizeOK || !analysis.minSizeOK) {
      setMessage({ type: "error", text: "Selecione uma imagem válida para o produto com todas as verificações OK." });
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
      uploadData.append("file", selectedFile);

      const token = localStorage.getItem("accessToken");
      const uploadRes = await fetch(`${API_URL}/upload`, {
        method: "POST",
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        body: uploadData,
      });

      if (!uploadRes.ok) {
        const errorData = await uploadRes.json();
        setMessage({
          type: "error",
          text: errorData.message || "Erro ao fazer upload da imagem."
        });
        throw new Error("Erro ao fazer upload da imagem.");
      }
      const { url: imageUrl } = await uploadRes.json();

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
        const errorData = await productRes.json();
        setMessage({
          type: "error",
          text: errorData.message || "Erro ao cadastrar produto."
        });
        throw new Error("Erro ao cadastrar produto.");
      }

      setMessage({
        type: "success",
        text: "Produto cadastrado com sucesso!"
      });

      setForm({ price: "", quantity: "", description: "", brand: "", category: "" });
      setFile(null);
      setAnalysis(null);

      onSuccess?.();
    } catch (err) {
      console.error("Erro no submit do produto:", err);

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
      <div>
        <form
          onSubmit={handleSubmit}
          className="p-2 bg-white mx-auto"
        >
          <div className="grid md:grid-cols-2 gap-6 mb-6">

            <div className="flex flex-col gap-4">
              <label className="block">
                <span className="block text-gray-700 text-sm font-semibold mb-1">Preço (R$)</span>
                <input
                  type="number"
                  name="price"
                  value={form.price}
                  onChange={handleChange}
                  placeholder="Ex: 99.90"
                  className="block w-full p-3 border border-gray-300 rounded-md shadow-sm
                                               focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-transparent
                                               text-gray-700 placeholder-gray-400"
                  step="0.01"
                  min="0"
                />
              </label>

              <label className="block">
                <span className="block text-gray-700 text-sm font-semibold mb-1">Quantidade disponível</span>
                <input
                  type="number"
                  name="quantity"
                  value={form.quantity}
                  onChange={handleChange}
                  placeholder="Ex: 100"
                  className="block w-full p-3 border border-gray-300 rounded-md shadow-sm
                                               focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-transparent
                                               text-gray-700 placeholder-gray-400"
                  min="0"
                />
              </label>
            </div>

            {/* Descrição */}
            <label className="block md:col-span-1">
              <span className="block text-gray-700 text-sm font-semibold mb-1">Descrição do Produto</span>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                placeholder="Descreva o produto, suas características, benefícios, etc."
                className="block w-full p-3 border border-gray-300 rounded-md shadow-sm
                                           focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-transparent
                                           text-gray-700 placeholder-gray-400 h-full min-h-[120px] resize-y"
                maxLength="500"
              />
            </label>
          </div>

          {/* Marca e Categoria */}
          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <label className="block">
              <span className="block text-gray-700 text-sm font-semibold mb-1">Marca</span>
              <input
                type="text"
                name="brand"
                value={form.brand}
                onChange={handleChange}
                placeholder="Ex: Fenty Beauty"
                className="block w-full p-3 border border-gray-300 rounded-md shadow-sm
                                           focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-transparent
                                           text-gray-700 placeholder-gray-400"
              />
            </label>

            <label className="block">
              <span className="block text-gray-700 text-sm font-semibold mb-1">Categoria</span>
              <select
                name="category"
                value={form.category}
                onChange={handleChange}
                className="block w-full p-3 border border-gray-300 rounded-md shadow-sm
                                           focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-transparent
                                           text-gray-700"
              >
                <option value="" disabled>Selecione uma categoria</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </label>
          </div>

          {/* Upload de Imagem */}
          <div className="mb-6">
            <label className="block">
              <span className="block text-gray-700 text-sm font-semibold mb-1">Imagem do Produto</span>
              <input
                type="file"
                accept="image/jpeg, image/png"
                onChange={handleImageChange}
                className="block w-full text-sm cursor-pointer text-gray-500 file:cursor-pointer
                                           file:mr-4 file:py-2 file:px-4
                                           file:rounded-full file:border-0
                                           file:text-sm file:font-semibold
                                           file:bg-pink-50 file:text-pink-700
                                           hover:file:bg-pink-100 cursor-pointer"
              />
            </label>

            <div className="flex flex-col justify-between items-center w-full">
              {/* Preview da Imagem Atual ou Nova */}
              {(form.imageUrl || selectedFile) && (
                <div className="mt-2">
                  <span className="block text-sm text-gray-600 mb-1">Prévia da Imagem:</span>
                  <img
                    src={form.imageUrl}
                    alt="Prévia do Produto"
                    className="h-64 w-64 object-fit"
                  />
                </div>
              )}
            </div>

            {analysis && (
              <div className="mt-4 p-4 border border-gray-200 rounded-lg bg-gray-50 shadow-sm">
                <p className="text-sm font-semibold text-gray-700 mb-2">
                  Diagnóstico da imagem selecionada:
                </p>
                <ul className="text-sm space-y-1">
                  <li className={`flex items-center gap-2 ${analysis.typeOK ? "text-green-700" : "text-red-700"}`}>
                    {analysis.typeOK ? (<HiCheckCircle className="text-green-500" />) : (<HiXCircle className="text-red-500" />)}
                    <span>
                      Formato <strong>{analysis.fileType}</strong> {analysis.typeOK ? "suportado (JPG ou PNG)" : "não suportado (use JPG ou PNG)"}
                    </span>
                  </li>

                  <li className={`flex items-center gap-2 ${analysis.sizeOK ? "text-green-700" : "text-red-700"}`}>
                    {analysis.sizeOK ? (<HiCheckCircle className="text-green-500" />) : (<HiXCircle className="text-red-500" />)}
                    <span>
                      Tamanho <strong>{(analysis.fileSize / 1024 / 1024).toFixed(2)} MB</strong> {analysis.sizeOK ? "(OK)" : "(excede 6 MB)"}
                    </span>
                  </li>

                  <li className={`flex items-center gap-2 ${analysis.minSizeOK ? "text-green-700" : "text-red-700"}`}>
                    {analysis.minSizeOK ? (<HiCheckCircle className="text-green-500" />) : (<HiXCircle className="text-red-500" />)}
                    <span>
                      Dimensão mínima 400×400 px ({analysis.width}×{analysis.height}) {analysis.minSizeOK ? "(OK)" : "(muito pequena)"}
                    </span>
                  </li>
                </ul>
                {(!analysis.typeOK || !analysis.sizeOK || !analysis.minSizeOK) && (
                  <p className="mt-3 text-red-600 text-sm font-medium">Por favor, corrija os problemas da imagem antes de salvar.</p>
                )}
              </div>
            )}
            {selectedFile && !analysis && (
              <p className="mt-2 text-gray-500 text-sm">Analisando imagem...</p>
            )}
          </div>

          {/* Botões de Ação */}
          <div className="flex gap-3 justify-end mt-8"> {/* Ajustei o espaçamento e justificação */}
            {onCancel && (
              <button
                type="button"
                onClick={onCancel}
                className="px-6 py-2 cursor-pointer rounded-md font-semibold border border-gray-300 text-gray-700
                                           hover:bg-gray-100 transition-colors duration-200 shadow-sm
                                           focus:outline-none focus:ring-2 focus:ring-gray-400"
              >
                Cancelar
              </button>
            )}
            <button
              type="submit"
              disabled={
                loading ||
                !form.price || !form.quantity || !form.description || form.description.length > 500 || !form.brand || !form.category ||
                !analysis || !analysis.typeOK || !analysis.sizeOK || !analysis.minSizeOK
              }
              className="bg-pink-500 cursor-pointer text-black px-6 py-2 rounded-md font-semibold
                                       hover:bg-pink-600 transition-colors duration-200 shadow-md
                                       disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-pink-500
                                       focus:outline-none focus:ring-2 focus:ring-pink-400"
            >
              {loading ? (
                <span className="flex items-center">
                  <LoadingCircles className="w-5 h-5 mr-2" /> Salvando...
                </span>
              ) : (
                "Salvar Produto"
              )}
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
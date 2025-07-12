import { useEffect, useState } from "react";
import { HiCheckCircle, HiXCircle } from "react-icons/hi";
import { useParams } from "react-router-dom"; // Importa useParams para obter ID da URL
import LoadingCircles from "../components/loading"; // Certifique-se de que o caminho está correto
import Message from "../components/message";     // Certifique-se de que o caminho está correto
import ConfirmationModal from "../components/confirmationModal"; // Certifique-se de que o caminho está correto

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

const categories = [
  "Base", "Corretivo", "Pó facial", "Blush", "Sombra", "Máscara de cílios", "Delineador",
  "Batom", "Gloss", "Iluminador", "Primer", "Fixador de maquiagem", "Hidratante facial",
  "Protetor solar", "Sabonete facial", "Esfoliante facial", "Tônico facial", "Sérum facial",
  "Máscara facial", "Sabonete corporal", "Hidratante corporal", "Esfoliante corporal",
  "Desodorante", "Óleo corporal", "Loção pós-sol", "Shampoo", "Condicionador", "Máscara capilar",
  "Leave-in", "Óleo capilar", "Tônico capilar", "Finalizador", "Gel/Modelador", "Esmalte",
  "Removedor de esmalte", "Fortalecedor de unhas", "Kit manicure", "Perfume feminino",
  "Perfume masculino", "Body splash", "Colônia", "Barbeador", "Pós-barba", "Espuma de barbear",
  "Balm para barba", "Shampoo infantil", "Sabonete infantil", "Protetor solar infantil",
  "Colônia infantil", "Orgânico", "Vegano", "Cruelty-free", "Sem parabenos",
].sort();

export default function AdminProductEdit({ id: propId, onEdit, onCancel }) {
  const { id: paramId } = useParams();
  const id = propId ?? paramId; // Prioriza o ID passado via prop, senão pega da URL

  const [form, setForm] = useState({
    description: "",
    price: "",
    quantity: "",
    brand: "",
    category: "",
    imageUrl: "", // Para exibir a imagem atual
  });
  const [selectedFile, setSelectedFile] = useState(null); // Para a nova imagem selecionada
  const [analysis, setAnalysis] = useState(null); // Validação da nova imagem

  const [loading, setLoading] = useState(true); // Indica se está carregando dados do produto
  const [isSubmitting, setIsSubmitting] = useState(false); // Indica se está salvando as alterações
  const [msg, setMsg] = useState(null); // Mensagens de feedback
  const [showConfirm, setShowConfirm] = useState(false); // Visibilidade do modal de confirmação
  const [confirming, setConfirming] = useState(false); // Estado de confirmação no modal

  // Efeito para carregar os dados do produto ao montar o componente ou quando o ID muda
  useEffect(() => {
    if (!id) {
      setMsg({ type: "error", text: "ID do produto não informado para edição." });
      setLoading(false);
      return;
    }

    const fetchProductData = async () => {
      setLoading(true);
      try {
        const { data } = await fetchJson(`${API_URL}/products/${id}`);
        setForm({
          description: data.description ?? "",
          price: String(data.price ?? ""),
          quantity: String(data.quantity ?? ""),
          brand: data.brand ?? "",
          category: data.category ?? "",
          imageUrl: data.imageUrl ?? "", // Define a imagem atual
        });
        setAnalysis(null); // Reseta a análise de imagem ao carregar novo produto
        setSelectedFile(null); // Reseta o arquivo selecionado ao carregar novo produto
      } catch (err) {
        console.error("Erro ao carregar dados do produto para edição:", err);
        setMsg({ type: "error", text: "Erro ao carregar dados do produto para edição." });
      } finally {
        setLoading(false);
      }
    };
    fetchProductData();
  }, [id]); // Dependência no ID para recarregar se o produto a ser editado mudar

  const handleChange = ({ target }) =>
    setForm((p) => ({ ...p, [target.name]: target.value }));

  const handleImageChange = ({ target }) => {
    const file = target.files?.[0];
    setAnalysis(null); // Limpa análise anterior
    setSelectedFile(null); // Limpa arquivo selecionado anterior
    setForm((prev) => ({ ...prev, imageUrl: "" })); // Limpa preview se nenhum arquivo for válido

    if (!file) {
      return;
    }

    const validTypes = ["image/jpeg", "image/png"];
    const maxSizeBytes = 6.1 * 1024 * 1024; // 6.1 MB

    const sizeOK = file.size <= maxSizeBytes;
    const typeOK = validTypes.includes(file.type);

    const img = new Image();
    img.onload = () => {
      const { width, height } = img;
      const minSizeOK = width >= 500 && height >= 500;
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
      setSelectedFile(file); // Define o arquivo selecionado para upload
      setForm((prev) => ({ ...prev, imageUrl: URL.createObjectURL(file) })); // Preview local
    };
    img.onerror = () => {
      setAnalysis(null);
      setSelectedFile(null); // Em caso de erro, não use o arquivo
      setMsg({ type: "error", text: "Não foi possível carregar a imagem para análise. Verifique o arquivo." });
    };
    img.src = URL.createObjectURL(file);
  };

  const validateForm = () => {
    const price = Number(form.price);
    const quantity = Number(form.quantity);

    if (!form.description.trim()) {
      setMsg({ type: "error", text: "A descrição é obrigatória." });
      return false;
    }
    if (isNaN(price) || price <= 0) {
      setMsg({ type: "error", text: "Informe um preço válido (maior que zero)." });
      return false;
    }
    if (isNaN(quantity) || !Number.isInteger(quantity) || quantity < 0) {
      setMsg({ type: "error", text: "Informe uma quantidade válida (número inteiro não negativo)." });
      return false;
    }
    if (!form.brand.trim()) {
      setMsg({ type: "error", text: "A marca é obrigatória." });
      return false;
    }
    if (!form.category.trim()) {
      setMsg({ type: "error", text: "A categoria é obrigatória." });
      return false;
    }
    // Validação da nova imagem, se uma foi selecionada
    if (selectedFile) {
      if (!analysis) {
        setMsg({ type: "error", text: "Aguarde a análise da nova imagem ou selecione outra." });
        return false;
      }
      if (!analysis.typeOK || !analysis.sizeOK || !analysis.minSizeOK || !analysis.ratioOK) {
        setMsg({ type: "error", text: "A nova imagem selecionada não atende aos requisitos. Por favor, corrija." });
        return false;
      }
    } else if (!form.imageUrl) { // Se não há nova imagem e nem imagem pré-existente
      setMsg({ type: "error", text: "O produto deve ter uma imagem. Por favor, adicione uma." });
      return false;
    }

    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (loading || isSubmitting || confirming) return; // Impede múltiplos submits

    if (!validateForm()) return;

    setShowConfirm(true); // Abre o modal de confirmação
  };

  const handleAuthError = () => {
    setMsg({ type: "error", text: "Sessão expirada. Redirecionando para o login..." });
    setTimeout(() => {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("currentUser");
      window.location.href = "/login";
    }, 1500);
  };

  const confirmSave = async () => { // Renomeado para evitar conflito com 'confirm' do modal
    if (confirming) return;
    setConfirming(true);
    setIsSubmitting(true); // Indica que o salvamento está em andamento

    try {
      let finalImageUrl = form.imageUrl; // Começa com a imagem atual ou preview da nova

      if (selectedFile) { // Se um novo arquivo foi selecionado, faça o upload
        const fd = new FormData();
        fd.append("file", selectedFile);

        const uploadRes = await fetch(`${API_URL}/upload`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
          body: fd,
        });

        if (!uploadRes.ok) {
          const errorData = await uploadRes.json();
          throw new Error(errorData.message || "Falha no upload da nova imagem.");
        }
        const { url } = await uploadRes.json();
        finalImageUrl = url; // Usa a URL da nova imagem
      }

      // Envia os dados do produto (PATCH)
      const productRes = await fetchJson(`${API_URL}/products/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
        body: JSON.stringify({
          ...form,
          imageUrl: finalImageUrl, // Usa a URL final da imagem
          price: Number(form.price),
          quantity: Number(form.quantity),
        }),
      });

      if (!productRes.res.ok) { // Verifica a resposta do fetchJson
        throw new Error(productRes.data?.message || "Falha ao atualizar o produto.");
      }

      setMsg({ type: "success", text: "Produto atualizado com sucesso!" });
      setShowConfirm(false); // Fecha o modal
      onEdit?.(); // Chama a função de sucesso do componente pai
    } catch (err) {
      if (err.status === 403) {
        handleAuthError();
        return;
      }
      console.error("Erro ao atualizar produto:", err);
      setMsg({
        type: "error",
        text: err.message || `Falha ao atualizar (cód. ${err.status ?? "net"})`,
      });
    } finally {
      setConfirming(false);
      setIsSubmitting(false); // Reseta o estado de salvamento
      setShowConfirm(false); // Garante que o modal feche mesmo em erro
    }
  };

  return (
    <div className="p-2 sm:p-4 md:p-6"> {/* Padding ajustado */}
      {/* Título da seção já vem do AdminProduct pai */}
      {/* <h2 className="text-xl font-bold mb-4">Editar Produto</h2> */}

      {loading && <LoadingCircles className="mb-4" />}

      {msg?.text && (
        <Message
          type={msg.type}
          message={msg.text}
          onClose={() => setMsg(null)}
        />
      )}

      {showConfirm && (
        <ConfirmationModal
          title="Confirmar Alterações"
          message="Tem certeza que deseja salvar as alterações deste produto?"
          confirmText={confirming ? "Salvando..." : "Sim, Salvar"}
          cancelText="Cancelar"
          onConfirm={confirmSave} // Chamada para a nova função confirmSave
          onCancel={() => setShowConfirm(false)}
          disabled={confirming}
        />
      )}

      {!loading && (
        <form
          onSubmit={handleSubmit}
          className="p-6 bg-white rounded-lg shadow-lg border border-gray-200 max-w-4xl mx-auto"
        >
          <div className="grid md:grid-cols-2 gap-6 mb-6">
            {/* Coluna Esquerda: Descrição, Preço, Quantidade */}
            <div className="flex flex-col gap-4">
              <label className="block">
                <span className="block text-gray-700 text-sm font-semibold mb-1">Descrição do Produto</span>
                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  placeholder="Descreva o produto, suas características, benefícios, etc."
                  className="block w-full p-3 border border-gray-300 rounded-md shadow-sm
                                               focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-transparent
                                               text-gray-700 placeholder-gray-400 h-full min-h-[120px] resize-y"
                  required
                />
              </label>

              <label className="block">
                <span className="block text-gray-700 text-sm font-semibold mb-1 mt-5">Preço (R$)</span>
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
                  required
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
                  required
                />
              </label>
            </div>

            {/* Coluna Direita: Marca, Categoria, Imagem */}
            <div className="flex flex-col gap-4">
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
                  required
                />
              </label>

              <label className="block">
                <span className="block text-gray-700 text-sm font-semibold mb-1">Categoria</span>
                <select
                  name="category"
                  value={form.category || ""}
                  onChange={handleChange}
                  className="block w-full p-3 border border-gray-300 rounded-md shadow-sm
                                               focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-transparent
                                               text-gray-700"
                  required
                >
                  <option value="" disabled>Selecione uma categoria</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </label>

              <label className="block">
                <span className="block text-gray-700 text-sm font-semibold mb-1">Imagem do Produto</span>
                <input
                  type="file"
                  accept="image/jpeg, image/png"
                  onChange={handleImageChange}
                  className="block w-full text-sm text-gray-500
                                               file:mr-4 file:py-2 file:px-4 file:cursor-pointer
                                               file:rounded-full file:border-0
                                               file:text-sm file:font-semibold
                                               file:bg-pink-50 file:text-pink-700
                                               hover:file:bg-pink-100 cursor-pointer"
                />
              </label>

              {/* Preview da Imagem Atual ou Nova */}
              {(form.imageUrl || selectedFile) && (
                <div className="mt-2">
                  <span className="block text-sm text-gray-600 mb-1">Prévia da Imagem:</span>
                  <img
                    src={form.imageUrl} // Exibe a URL atual do form (que pode ser a antiga ou o URL.createObjectURL da nova)
                    alt="Prévia do Produto"
                    className="h-32 w-32 object-cover rounded-lg border border-gray-200 shadow-sm"
                  />
                </div>
              )}

              {/* Diagnóstico da Imagem */}
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
                        Dimensão mínima 500×500 px ({analysis.width}×{analysis.height}) {analysis.minSizeOK ? "(OK)" : "(muito pequena)"}
                      </span>
                    </li>
                    <li className={`flex items-center gap-2 ${analysis.ratioOK ? "text-green-700" : "text-red-700"}`}>
                      {analysis.ratioOK ? (<HiCheckCircle className="text-green-500" />) : (<HiXCircle className="text-red-500" />)}
                      <span>Proporção próxima de quadrado {analysis.ratioOK ? "(OK)" : "(desproporcional)"}</span>
                    </li>
                  </ul>
                  {(!analysis.typeOK || !analysis.sizeOK || !analysis.minSizeOK || !analysis.ratioOK) && (
                    <p className="mt-3 text-red-600 text-sm font-medium">Por favor, corrija os problemas da imagem antes de salvar.</p>
                  )}
                </div>
              )}
              {selectedFile && !analysis && (
                <p className="mt-2 text-gray-500 text-sm">Analisando imagem...</p>
              )}
            </div>
          </div>

          {/* Botões de Ação */}
          <div className="flex gap-3 justify-end mt-8">
            {onCancel && (
              <button
                type="button"
                onClick={onCancel}
                className="px-6 py-2 rounded-md font-semibold border border-gray-300 text-gray-700 cursor-pointer
                                           hover:bg-gray-100 transition-colors duration-200 shadow-sm
                                           disabled:opacity-50 disabled:cursor-not-allowed
                                           focus:outline-none focus:ring-2 focus:ring-gray-400"
                disabled={loading || isSubmitting || confirming}
              >
                Cancelar
              </button>
            )}
            <button
              type="submit"
              disabled={
                loading ||
                isSubmitting ||
                confirming ||
                !form.description || !form.price || !form.quantity || !form.brand || !form.category ||
                (selectedFile && (!analysis || !analysis.typeOK || !analysis.sizeOK || !analysis.minSizeOK || !analysis.ratioOK)) ||
                (!selectedFile && !form.imageUrl) // Não permite salvar se não tem imagem
              }
              className="bg-pink-500 text-white px-6 py-2 rounded-md font-semibold cursor-pointer
                                       hover:bg-pink-600 transition-colors duration-200 shadow-md
                                       disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-pink-500
                                       focus:outline-none focus:ring-2 focus:ring-pink-400"
            >
              {isSubmitting ? (
                <span className="flex items-center">
                  <LoadingCircles className="w-5 h-5 mr-2" /> Salvando...
                </span>
              ) : (
                "Salvar Alterações"
              )}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}

async function fetchJson(url, options = {}) {
  const res = await fetch(url, options);
  let data = null;
  try {
    data = await res.clone().json();
  } catch { } // Ignora erro se a resposta não for JSON
  if (!res.ok) {
    const err = new Error(data?.message || res.statusText);
    err.status = res.status;
    err.data = data;
    throw err;
  }
  return { res, data };
}
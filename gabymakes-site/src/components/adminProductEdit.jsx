import { useEffect, useState } from "react";
import { HiCheckCircle, HiXCircle } from "react-icons/hi";
import { useParams } from "react-router-dom";
import LoadingCircles from "../components/loading";
import Message from "../components/message";
import ConfirmationModal from "../components/confirmationModal";

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
  const id = propId ?? paramId;

  const [form, setForm] = useState({
    description: "",
    price: "",
    quantity: "",
    brand: "",
    category: "",
    imageUrl: "",
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [analysis, setAnalysis] = useState(null); // validação da imagem

  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [confirming, setConfirming] = useState(false);

  useEffect(() => {
    if (!id) {
      setMsg({ type: "error", text: "ID do produto não informado." });
      setLoading(false);
      return;
    }

    (async () => {
      try {
        const { data } = await fetchJson(`${API_URL}/products/${id}`);
        setForm({
          description: data.description ?? "",
          price: String(data.price ?? ""),
          quantity: String(data.quantity ?? ""),
          brand: data.brand ?? "",
          category: data.category ?? "",
          imageUrl: data.imageUrl ?? "",
        });
        setAnalysis(null);
        setSelectedFile(null);
      } catch (err) {
        console.error(err);
        setMsg({ type: "error", text: "Erro ao carregar dados do produto." });
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  const handleChange = ({ target }) =>
    setForm((p) => ({ ...p, [target.name]: target.value }));

  const handleImageChange = ({ target }) => {
    const file = target.files?.[0];
    setAnalysis(null);
    if (!file) {
      setSelectedFile(null);
      setForm((prev) => ({ ...prev, imageUrl: "" }));
      return;
    }

    const validTypes = ["image/jpeg", "image/png"];
    const maxSizeBytes = 6.1 * 1024 * 1024;

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
    };
    img.onerror = () => {
      setAnalysis(null);
      setMsg({ type: "error", text: "Não foi possível carregar a imagem." });
    };

    img.src = URL.createObjectURL(file);

    setSelectedFile(file);
    setForm((prev) => ({ ...prev, imageUrl: URL.createObjectURL(file) }));
  };

  const validateForm = () => {
    const price = Number(form.price);
    const quantity = Number(form.quantity);

    if (!form.description.trim()) {
      setMsg({ type: "error", text: "Descrição é obrigatória." });
      return false;
    }
    if (!price || price <= 0) {
      setMsg({ type: "error", text: "Preço inválido." });
      return false;
    }
    if (!Number.isInteger(quantity) || quantity < 0) {
      setMsg({ type: "error", text: "Quantidade inválida." });
      return false;
    }
    if (!form.brand.trim()) {
      setMsg({ type: "error", text: "Marca é obrigatória." });
      return false;
    }
    if (!form.category.trim()) {
      setMsg({ type: "error", text: "Categoria é obrigatória." });
      return false;
    }
    if (selectedFile) {
      if (!analysis) {
        setMsg({ type: "error", text: "Aguarde a análise da imagem." });
        return false;
      }
      if (!analysis.typeOK) {
        setMsg({ type: "error", text: "Formato da imagem não suportado (use JPG ou PNG)." });
        return false;
      }
      if (!analysis.sizeOK) {
        setMsg({ type: "error", text: "Tamanho da imagem excede 6MB." });
        return false;
      }
      if (!analysis.minSizeOK) {
        setMsg({ type: "error", text: "Dimensão mínima da imagem é 500×500 px." });
        return false;
      }
      if (!analysis.ratioOK) {
        setMsg({ type: "error", text: "Imagem deve ter proporção próxima de quadrado." });
        return false;
      }
    }

    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (loading || confirming) return;

    if (!validateForm()) return;

    setShowConfirm(true);
  };

  const handleAuthError = () => {
    setMsg({ type: "error", text: "Sessão expirada. Faça login novamente." });
    setTimeout(() => {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("currentUser");
      window.location.href = "/login";
    }, 1200);
  };

  const confirm = async () => {
    if (confirming) return;
    setConfirming(true);

    try {
      let imageUrl = form.imageUrl;

      if (selectedFile) {
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
          throw new Error("Falha no upload da imagem.");
        }
        const { url } = await uploadRes.json();
        imageUrl = url;
      }

      await fetchJson(`${API_URL}/products/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
        body: JSON.stringify({
          ...form,
          imageUrl,
          price: Number(form.price),
          quantity: Number(form.quantity),
        }),
      });

      setMsg({ type: "success", text: "Produto atualizado com sucesso!" });
      onEdit?.();
    } catch (err) {
      if (err.status === 403) {
        handleAuthError();
        return;
      }
      console.error("Erro ao atualizar produto:", err);
      setMsg({
        type: "error",
        text: err.data?.message || `Falha ao atualizar (cód. ${err.status ?? "net"})`,
      });
    } finally {
      setShowConfirm(false);
      setConfirming(false);
    }
  };

  return (
    <div className="bg-[#fafafa] p-6">
      <h2 className="text-xl font-bold mb-4">Editar Produto</h2>

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
          title="Confirmação"
          message="Tem certeza que deseja salvar as alterações?"
          confirmText={confirming ? "Salvando..." : "Sim"}
          cancelText="Cancelar"
          onConfirm={confirm}
          onCancel={() => setShowConfirm(false)}
          disabled={confirming}
        />
      )}

      {!loading && (
        <form
          onSubmit={handleSubmit}
          className="border rounded p-6 bg-white max-w-5xl mx-auto"
        >
          <div className="flex flex-col gap-4">

            <label>
              Nome do produto:
              <input
                name="description"
                value={form.description}
                onChange={handleChange}
                placeholder="Ex: Fone Bluetooth"
                className="border rounded px-3 py-2 w-full mt-1"
                required
              />
            </label>

            <label>
              Preço:
              <input
                type="number"
                name="price"
                value={form.price}
                onChange={handleChange}
                placeholder="Ex: 199.90"
                className="border rounded px-3 py-2 w-full mt-1"
                step="0.01"
                required
              />
            </label>

            <label>
              Quantidade:
              <input
                type="number"
                name="quantity"
                value={form.quantity}
                onChange={handleChange}
                placeholder="Ex: 10"
                className="border rounded px-3 py-2 w-full mt-1"
                required
              />
            </label>

            <label>
              Marca:
              <input
                name="brand"
                value={form.brand}
                onChange={handleChange}
                placeholder="Ex: Samsung"
                className="border rounded px-3 py-2 w-full mt-1"
              />
            </label>

            <label>
              Categoria:
              <select
                name="category"
                value={form.category || ""}
                onChange={handleChange}
                className="border rounded px-3 py-2 w-full mt-1"
                required
              >
                <option value="" disabled>
                  Selecione uma categoria
                </option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </label>

            <label>
              Imagem do produto:
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="border rounded px-3 py-2 w-full mt-1"
              />
            </label>

            {analysis && (
              <div className="mt-4 p-4 border rounded bg-gray-50">
                <p className="text-sm font-semibold text-gray-700 mb-2">
                  Diagnóstico da imagem selecionada:
                </p>
                <ul className="text-sm space-y-1">
                  <li className="flex items-center gap-2">
                    {analysis.typeOK ? (
                      <HiCheckCircle className="text-green-600" />
                    ) : (
                      <HiXCircle className="text-red-600" />
                    )}
                    <span>
                      Formato <strong>{analysis.fileType}</strong>{" "}
                      {analysis.typeOK
                        ? "suportado"
                        : "não suportado (use JPG ou PNG)"}
                    </span>
                  </li>

                  <li className="flex items-center gap-2">
                    {analysis.sizeOK ? (
                      <HiCheckCircle className="text-green-600" />
                    ) : (
                      <HiXCircle className="text-red-600" />
                    )}
                    <span>
                      Tamanho{" "}
                      <strong>
                        {(analysis.fileSize / 1024 / 1024).toFixed(2)} MB
                      </strong>{" "}
                      {analysis.sizeOK ? "(ok)" : "(excede 6 MB)"}
                    </span>
                  </li>

                  <li className="flex items-center gap-2">
                    {analysis.minSizeOK ? (
                      <HiCheckCircle className="text-green-600" />
                    ) : (
                      <HiXCircle className="text-red-600" />
                    )}
                    <span>
                      Dimensão mínima 500×500 px ({analysis.width}×{analysis.height})
                    </span>
                  </li>

                  <li className="flex items-center gap-2">
                    {analysis.ratioOK ? (
                      <HiCheckCircle className="text-green-600" />
                    ) : (
                      <HiXCircle className="text-red-600" />
                    )}
                    <span>Proporção próxima de quadrado</span>
                  </li>
                </ul>
              </div>
            )}

            {form.imageUrl && !selectedFile && (
              <div>
                <span className="text-sm text-gray-600">Imagem atual:</span>
                <img
                  src={form.imageUrl}
                  alt="Preview"
                  className="h-32 w-32 object-cover rounded border mt-1"
                />
              </div>
            )}

            <div className="flex gap-3">
              <button
                type="submit"
                disabled={
                  loading ||
                  confirming ||
                  (selectedFile &&
                    (!analysis ||
                      !analysis.typeOK ||
                      !analysis.sizeOK ||
                      !analysis.minSizeOK ||
                      !analysis.ratioOK))
                }
                className="bg-pink-300 cursor-pointer hover:bg-pink-400 disabled:opacity-50 text-black font-semibold px-6 py-2 rounded shadow"
              >
                Salvar alterações
              </button>

              {onCancel && (
                <button
                  type="button"
                  onClick={onCancel}
                  className="bg-pink-300 cursor-pointer hover:bg-pink-400 disabled:opacity-50 text-black font-semibold px-6 py-2 rounded shadow"
                  disabled={loading || confirming}
                >
                  Cancelar
                </button>
              )}
            </div>
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
  } catch { }
  if (!res.ok) {
    const err = new Error(data?.message || res.statusText);
    err.status = res.status;
    err.data = data;
    throw err;
  }
  return { res, data };
}

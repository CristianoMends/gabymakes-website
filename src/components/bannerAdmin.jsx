import { useEffect, useState } from "react";
import ProductCard from "../components/ProductCard";
import { HiCheckCircle, HiXCircle } from "react-icons/hi";
import LoadingCircles from "../components/loading";
import Message from "../components/message";
import ConfirmationModal from "../components/confirmationModal";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

export default function BannerAdmin() {
    const [banners, setBanners] = useState([]);
    const [newBanner, setNewBanner] = useState({ imageUrl: "", description: "" });
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [fileAnalysis, setFileAnalysis] = useState(null);
    const [previewImage, setPreviewImage] = useState(null);

    const [selectedFile, setSelectedFile] = useState(null);


    const [msg, setMsg] = useState(null);

    const [showConfirm, setShowConfirm] = useState(false);
    const [confirming, setConfirming] = useState(false);
    const [confirmAction, setConfirmAction] = useState(null);
    const [confirmTitle, setConfirmTitle] = useState("");
    const [confirmMessage, setConfirmMessage] = useState("");

    useEffect(() => {
        setLoading(true);
        fetch(`${API_URL}/banners`)
            .then((res) => res.json())
            .then((data) => setBanners(Array.isArray(data) ? data : []))
            .catch(() => setBanners([]));
        setLoading(false);
    }, []);

    function openConfirmation({ title, message, onConfirm }) {
        setConfirmTitle(title);
        setConfirmMessage(message);
        setConfirmAction(() => onConfirm);
        setShowConfirm(true);
    }

    async function handleAdd() {
        if (!selectedFile || !newBanner.description) {
            setMsg({ type: "error", text: "Preencha a descrição e selecione uma imagem válida." });
            return;
        }

        openConfirmation({
            title: "Salvar banner?",
            message: "Deseja salvar este novo banner?",
            onConfirm: async () => {
                setConfirming(true);
                setLoading(true);
                setShowConfirm(false);

                try {
                    const formData = new FormData();
                    formData.append("file", selectedFile);
                    const uploadRes = await fetch(`${API_URL}/upload`, {
                        method: "POST",
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem("accessToken")}`
                        },
                        body: formData,
                    });
                    const uploadData = await uploadRes.json();
                    const imageUrl = uploadData.url;

                    const res = await fetch(`${API_URL}/banners`, {
                        method: "POST",
                        headers: getAuthHeaders(),
                        body: JSON.stringify({ imageUrl, description: newBanner.description }),
                    });
                    if (!res.ok) throw new Error("Erro na resposta do servidor");

                    const data = await res.json();
                    setBanners((prev) => [...prev, data]);
                    setNewBanner({ imageUrl: "", description: "" });
                    setFileAnalysis(null);
                    setPreviewImage(null);
                    setSelectedFile(null);
                    setMsg({ type: "success", text: "Banner salvo com sucesso." });

                } catch (err) {
                    setMsg({ type: "error", text: "Erro ao adicionar banner. Por favor, tente novamente." });
                }

                setLoading(false);
                setConfirming(false);
            },
        });
    }


    function handleRemove(id) {
        openConfirmation({
            title: "Remover banner?",
            message: "Tem certeza que deseja excluir este banner?",
            onConfirm: async () => {
                setConfirming(true);
                setLoading(true);
                setShowConfirm(false);
                try {
                    const res = await fetch(`${API_URL}/banners/${id}`, { method: "DELETE" });
                    if (!res.ok) throw new Error("Erro na resposta do servidor");
                    setBanners((prev) => prev.filter((b) => b.id !== id));
                    setMsg({ type: "success", text: "Banner removido com sucesso." });
                } catch (err) {
                    setMsg({ type: "error", text: "Erro ao remover banner. Por favor, tente novamente." });
                }
                setLoading(false);
                setConfirming(false);
            },
        });
    }

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const validTypes = ["image/jpeg", "image/png"];
        const maxSizeBytes = 6.1 * 1024 * 1024;
        const sizeOK = file.size <= maxSizeBytes;
        const typeOK = validTypes.includes(file.type);

        const img = new Image();
        const previewUrl = URL.createObjectURL(file);
        img.src = previewUrl;
        setPreviewImage(previewUrl);

        img.onload = () => {
            const { width, height } = img;
            const minSizeOK = width >= 500 && height >= 500;
            const bannerRatio = 1920 / 720;
            const actualRatio = width / height;
            const ratioOK = Math.abs(actualRatio - bannerRatio) <= 0.5;

            const analysis = {
                width,
                height,
                typeOK,
                sizeOK,
                minSizeOK,
                ratioOK,
                fileType: file.type,
                fileSize: file.size,
            };
            setFileAnalysis(analysis);

            const isValid = typeOK && sizeOK && minSizeOK && ratioOK;
            if (!isValid) {
                setMsg({
                    type: "error",
                    text:
                        "A imagem selecionada não atende aos requisitos técnicos. Por favor, verifique o formato, tamanho, resolução e proporção da imagem.",
                });
                setSelectedFile(null);
                return;
            }

            setMsg(null);
            setSelectedFile(file); // armazena o arquivo, mas não envia
        };

        img.onerror = () => {
            setMsg({ type: "error", text: "Erro ao carregar a imagem para análise." });
            setFileAnalysis(null);
            setPreviewImage(null);
            setSelectedFile(null);
        };
    };


    return (
        <div className="container mx-auto p-4 sm:p-6 lg:p-8 bg-gray-50 min-h-screen">
            {(loading || uploading) && <LoadingCircles className="mb-4" />}

            {msg && <Message
                type={msg.type}
                message={msg.text}
                onClose={() => setMsg(null)}
            />
            }



            {showConfirm && (
                <ConfirmationModal
                    title={confirmTitle}
                    message={confirmMessage}
                    confirmText={confirming ? "Processando..." : "Confirmar"}
                    cancelText="Cancelar"
                    onConfirm={confirmAction}
                    onCancel={() => setShowConfirm(false)}
                    disabled={confirming}
                />
            )}

            <h2 className="text-3xl font-extrabold text-gray-800 mb-6 text-center">Gerenciar Banners</h2>

            <div className="bg-white rounded-lg shadow-lg mb-8 border border-gray-200 flex flex-col gap-4 p-6">
                <h3 className="text-xl font-semibold text-gray-700 mb-4">Adicionar Nova Seção</h3>
                <div className="flex flex-col gap-4 md:flex-row md:items-end">

                    <input
                        type="text"
                        placeholder="Descrição"
                        value={newBanner.description}
                        onChange={(e) => setNewBanner({ ...newBanner, description: e.target.value })}
                        //className="border rounded px-2 py-[6px] border border-gray-300 "
                        className="border border-gray-300 px-2 py-[6px] rounded-md focus:outline-none focus:ring-2 focus:ring-pink-400 text-gray-700"
                        disabled={loading || uploading}
                    />
                    <label className="bg-pink-300 hover:bg-pink-400 text-gray-900 font-semibold px-4 py-2 rounded cursor-pointer text-center">
                        Escolher Imagem
                        <input
                            type="file"
                            accept="image/jpeg,image/png"
                            onChange={handleImageUpload}
                            disabled={loading || uploading}
                            className="hidden"
                        />
                    </label>
                    <button
                        onClick={handleAdd}
                        className="bg-pink-300 text-gray-900 font-semibold hover:bg-pink-400 px-4 py-2 rounded cursor-pointer"
                        disabled={loading || uploading}
                    >
                        {loading ? "Salvando..." : "Salvar"}
                    </button>
                </div>
            </div>

            {previewImage && (
                <div className="bg-white rounded-lg shadow-lg mb-8 border border-gray-200 flex justify-center">
                    <img src={previewImage} alt="Preview" className="w-full max-w-5xl rounded shadow border" />
                </div>
            )}

            {fileAnalysis && (
                <div className="mb-6 p-4 border border-gray-200 rounded bg-white">
                    <p className="text-sm font-semibold text-gray-700 mb-2">Análise detalhada do arquivo de imagem:</p>
                    <ul className="text-sm space-y-1">
                        <li className={`flex items-center gap-2 ${fileAnalysis.typeOK ? "text-green-700" : "text-red-700"}`}>
                            {fileAnalysis.typeOK ? <HiCheckCircle className="text-green-500" /> : <HiXCircle className="text-red-500" />}
                            <span>
                                Formato do arquivo: <strong>{fileAnalysis.fileType}</strong> {fileAnalysis.typeOK ? "(Aceito)" : "(Formato não suportado)"}
                            </span>
                        </li>
                        <li className={`flex items-center gap-2 ${fileAnalysis.sizeOK ? "text-green-700" : "text-red-700"}`}>
                            {fileAnalysis.sizeOK ? <HiCheckCircle className="text-green-500" /> : <HiXCircle className="text-red-500" />}
                            <span>
                                Tamanho do arquivo: {(fileAnalysis.fileSize / 1024 / 1024).toFixed(2)} MB {fileAnalysis.sizeOK ? "(Dentro do limite permitido)" : "(Arquivo muito grande)"}
                            </span>
                        </li>
                        <li className={`flex items-center gap-2 ${fileAnalysis.minSizeOK ? "text-green-700" : "text-red-700"}`}>
                            {fileAnalysis.minSizeOK ? <HiCheckCircle className="text-green-500" /> : <HiXCircle className="text-red-500" />}
                            <span>
                                Resolução da imagem: {fileAnalysis.width}×{fileAnalysis.height} pixels {fileAnalysis.minSizeOK ? "(Adequada para exibição)" : "(Resolução abaixo do recomendado)"}
                            </span>
                        </li>
                        <li className={`flex items-center gap-2 ${fileAnalysis.ratioOK ? "text-green-700" : "text-red-700"}`}>
                            {fileAnalysis.ratioOK ? <HiCheckCircle className="text-green-500" /> : <HiXCircle className="text-red-500" />}
                            <span>
                                Proporção da imagem: próxima de 1920×720 {fileAnalysis.ratioOK ? "(Conforme padrão)" : "(Proporção inadequada)"}
                            </span>
                        </li>
                    </ul>
                </div>
            )}

            <ul className="bg-white rounded-lg shadow-lg mb-8 border border-gray-200 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {banners.map((b) => (
                    <li key={b.id} className="border border-gray-300 border rounded shadow p-4 bg-white">
                        <img src={b.imageUrl} alt="Banner" className="w-full h-64 object-cover rounded mb-4" />
                        <div className="flex justify-between items-center">
                            <strong className="text-lg">{b.description}</strong>
                            <button onClick={() => handleRemove(b.id)} className="text-red-600 px-4 py-2 rounded-md border border-red-400
                                                   hover:bg-red-50 hover:text-red-700 transition-colors duration-200
                                                   disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer" disabled={loading}>
                                Remover
                            </button>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
}

function getAuthHeaders() {
    const token = localStorage.getItem("accessToken");
    return token
        ? { Authorization: `Bearer ${token}`, "Content-Type": "application/json" }
        : { "Content-Type": "application/json" };
}

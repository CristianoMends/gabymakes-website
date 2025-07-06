import { IoClose } from 'react-icons/io5';

export default function ConfirmationModal({
    title = 'Tem certeza?',
    message = 'Essa ação não pode ser desfeita.',
    onConfirm,
    onCancel,
    confirmText = 'Confirmar',
    cancelText = 'Cancelar'
}) {
    return (
        <div className="fixed inset-0 z-[9999] bg-black/30 flex items-center justify-center px-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6 relative">
                <button
                    onClick={onCancel}
                    className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
                    aria-label="Fechar"
                >
                    <IoClose size={24} />
                </button>

                <h2 className="text-lg font-bold mb-2 text-gray-800">{title}</h2>
                <p className="text-sm text-gray-600 mb-6">{message}</p>

                <div className="flex justify-end gap-3">
                    <button
                        onClick={onCancel}
                        className="px-4 py-2 border border-gray-300 rounded text-sm text-gray-700 hover:bg-gray-100"
                    >
                        {cancelText}
                    </button>
                    <button
                        onClick={onConfirm}
                        className="px-4 py-2 bg-pink-400 hover:bg-pink-500 text-white rounded text-sm font-semibold"
                    >
                        {confirmText}
                    </button>
                </div>
            </div>
        </div>
    );
}

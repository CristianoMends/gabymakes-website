import { IoCloseCircleOutline } from 'react-icons/io5';

export default function Message({ type, message, onClose }) {
    const getClasses = (messageType) => {
        switch (messageType) {
            case 'success':
                return 'bg-green-100 border-green-400 text-green-700';
            case 'error':
                return 'bg-red-100 border-red-400 text-red-700';
            case 'warning':
                return 'bg-yellow-100 border-yellow-400 text-yellow-700';
            case 'info':
            default:
                return 'bg-blue-100 border-blue-400 text-blue-700';
        }
    };

    const typeClasses = getClasses(type);

    return (
        <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-[9999] w-[90%] max-w-sm sm:w-auto">
            <div
                className={`p-3 sm:p-4 rounded-md border-l-4 shadow-md flex items-center justify-between ${typeClasses}`}
                role="alert"
            >
                <p className="font-bold text-sm sm:text-base mr-2 sm:mr-4 break-words">{message}</p>
                {onClose && (
                    <button
                        onClick={onClose}
                        className="p-1 rounded-full hover:bg-opacity-75 cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-2"
                        style={{
                            backgroundColor:
                                type === 'success'
                                    ? '#d4edda'
                                    : type === 'error'
                                        ? '#f8d7da'
                                        : type === 'warning'
                                            ? '#fff3cd'
                                            : '#d1ecf1',
                            color:
                                type === 'success'
                                    ? '#155724'
                                    : type === 'error'
                                        ? '#721c24'
                                        : type === 'warning'
                                            ? '#856404'
                                            : '#0c5460',
                        }}
                        aria-label="Fechar mensagem"
                    >
                        <IoCloseCircleOutline size={20} />
                    </button>
                )}
            </div>
        </div>
    );
}

import { PulseLoader } from "react-spinners";
const Loading = () => {
    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-white/10 backdrop-blur-sm">
            <div className="relative w-16 h-16 sm:w-20 sm:h-20">
                <div className="absolute inset-0 border-white opacity-50"></div>
                <PulseLoader
                    loading={true}
                    color='#fba6d4'
                />
            </div>
        </div>
    );
};

export default Loading;

const LoadingCircles = () => {
    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-white/10 backdrop-blur-sm">
            <div className="relative w-16 h-16 sm:w-20 sm:h-20">
                <div className="absolute inset-0 rounded-full border-4 border-solid border-white opacity-50"></div>
                <div
                    className="
            absolute inset-0 rounded-full border-4 border-solid
            border-t-pink-300 border-r-pink-300 border-b-transparent border-l-transparent
            animate-spin
          "
                ></div>
            </div>
        </div>
    );
};

export default LoadingCircles;

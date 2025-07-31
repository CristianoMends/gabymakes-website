import { useState, useEffect, useRef } from 'react';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import LoadingCircles from '../components/loading';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export default function Banner() {
  const [banners, setBanners] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const timeoutRef = useRef(null);
  const [fadeKey, setFadeKey] = useState(0);

  const resetTimeout = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  };

  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const response = await fetch(`${API_URL}/banners`);
        if (!response.ok) {
          throw new Error(`Erro HTTP! Status: ${response.status}`);
        }
        const data = await response.json();
        const validBanners = data.filter(banner => banner.imageUrl);
        setBanners(validBanners);
      } catch (err) {
        console.error("Erro ao carregar banners:", err);
        setError("Não foi possível carregar os banners.");
      } finally {
        setLoading(false);
      }
    };

    fetchBanners();
  }, []);

  useEffect(() => {
    resetTimeout();
    if (banners.length > 1) {
      timeoutRef.current = setTimeout(
        () => {
          setCurrentIndex((prevIndex) =>
            prevIndex === banners.length - 1 ? 0 : prevIndex + 1
          );
          setFadeKey(prevKey => prevKey + 1);
        },
        5000
      );
    }
    return () => resetTimeout();
  }, [currentIndex, banners.length, fadeKey]);

  const goToNext = () => {
    resetTimeout();
    setCurrentIndex((prevIndex) =>
      prevIndex === banners.length - 1 ? 0 : prevIndex + 1
    );
    setFadeKey(prevKey => prevKey + 1);
  };

  const goToPrevious = () => {
    resetTimeout();
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? banners.length - 1 : prevIndex - 1
    );
    setFadeKey(prevKey => prevKey + 1);
  };

  const goToSlide = (index) => {
    resetTimeout();
    setCurrentIndex(index);
    setFadeKey(prevKey => prevKey + 1);
  };

  if (loading) {
    return (
      <LoadingCircles />
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen bg-red-100 text-red-700">
        {error}
      </div>
    );
  }

  if (banners.length === 0) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-100 text-gray-500">

      </div>
    );
  }

  const currentBanner = banners[currentIndex];

  return (
    <div className="relative w-full overflow-hidden">
      <div className="relative w-full h-[20vh] sm:h-[50vh] md:h-[60vh] lg:h-[80vh] flex items-center justify-center bg-white max-w-screen">

        <img
          key={fadeKey}
          src={currentBanner.imageUrl}
          alt={currentBanner.description}
          className="w-full h-full object-cover object-center 
                   transition-opacity duration-700 ease-in-out opacity-100"
          loading="lazy"
        />

        {/* Botões de navegação */}
        {banners.length > 1 && (
          <>
            <button
              onClick={goToPrevious}
              className="hidden sm:flex cursor-pointer absolute left-4 top-1/2 -translate-y-1/2 bg-pink-400 bg-opacity-50 text-black p-2 sm:p-3 rounded-full
                     hover:bg-opacity-75 transition duration-300 focus:outline-none focus:ring-2 focus:ring-white"
              aria-label="Banner anterior"
            >
              <FaChevronLeft size={20} />
            </button>
            <button
              onClick={goToNext}
              className="hidden sm:flex cursor-pointer absolute right-4 top-1/2 -translate-y-1/2 bg-pink-400 bg-opacity-50 text-black p-2 sm:p-3 rounded-full
                     hover:bg-opacity-75 transition duration-300 focus:outline-none focus:ring-2 focus:ring-white"
              aria-label="Próximo banner"
            >
              <FaChevronRight size={20} />
            </button>
          </>
        )}

        {/* Indicadores */}
        {banners.length > 1 && (
          <div className="absolute bottom-3 sm:bottom-4 flex space-x-1 sm:space-x-2">
            {banners.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`h-2 w-2 sm:h-3 sm:w-3 rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-white
                ${currentIndex === index ? 'bg-white scale-125' : 'bg-gray-400 bg-opacity-70 hover:bg-white'}`}
                aria-label={`Ir para o slide ${index + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );

}
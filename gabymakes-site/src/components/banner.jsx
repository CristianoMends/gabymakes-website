import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import banner from '../assets/banner-content.png'

export default function Banner () {
    return(
    <div className="flex items-center justify-center bg-white w-full h-96 shadow-none border-none">
      <div className="relative w-full h-full rounded-md shadow-md overflow-hidden flex items-center justify-center">
        <div className="flex items-center">
          <img
            src={banner}
            alt="Makeup Banner"
            className="object-cover w-full h-full"
          />
        </div>
        <div>
          <button className="absolute left-2 top-1/2 -translate-y-1/2 bg-pink-200 p-2 rounded-full text-pink-700 hover:bg-pink-300">
            <FaChevronLeft />
          </button>
        </div>
        <div>
          <button className="absolute right-2 top-1/2 -translate-y-1/2 bg-pink-200 p-2 rounded-full text-pink-700 hover:bg-pink-300">
            <FaChevronRight />
          </button>
        </div>

        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex space-x-1">
          <div className="w-2 h-2 bg-black rounded-full"></div>
          <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
          <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
          <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
        </div>
      </div>
    </div>
    )
}
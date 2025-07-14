import React from 'react';

export default function CategoriesBar() {
    const highlights = [
        { name: "MAQUIAGEM", link: "/maquiagem" },
        { name: "CABELOS", link: "/cabelos" },
        { name: "SKINCARE", link: "/skincare" },
    ];

    return (
        <nav className="w-full bg-pink-200 py-3 px-4 shadow-sm">
            <ul className="flex flex-wrap justify-center gap-x-8 gap-y-2 sm:gap-x-12 md:gap-x-16 lg:gap-x-20">
                {highlights.map((item) => (
                    <li key={item.name}>
                        <a
                            href={item.link}
                            className="text-gray-800 text-sm sm:text-base font-semibold uppercase tracking-wide
                         hover:text-pink-700 transition-colors duration-200 ease-in-out
                         focus:outline-none focus:ring-2 focus:ring-pink-400 focus:ring-offset-2"
                            aria-label={`Ver ${item.name}`}
                        >
                            {item.name}
                        </a>
                    </li>
                ))}
            </ul>
        </nav>
    );
}
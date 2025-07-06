import React, { useEffect } from 'react';
import HeaderVariant from '../components/header-variant';
import Breadcrumb from '../components/breadcrumb';
import Footer from '../components/footer';
import profileImage from '../assets/logo-bg-transparent-1.png';

export default function AboutPage() {
    useEffect(() => {
        document.title = 'Sobre Nós - GabyMakes';
    }, []);

    return (
        <div className="bg-white min-h-screen">
            <HeaderVariant />
            <Breadcrumb />
            <main className="container mx-auto py-10 px-4 sm:px-6 lg:px-8">
                <div className="max-w-3xl mx-auto text-center mb-8">
                    <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight sm:text-4xl">
                        Sobre GabyMakes
                    </h2>
                    <p className="mt-4 text-lg text-gray-500">
                        Conheça a história por trás da nossa paixão por beleza prática e produtos feitos com carinho.
                    </p>
                </div>

                <div className="md:flex md:items-center md:space-x-8 mb-8">
                    <div className="md:flex-shrink-0">
                        <img
                            className="h-48 w-full object-cover rounded-md"
                            src={profileImage}
                            alt="Foto da Gaby"
                        />
                    </div>
                    <div className="mt-4 md:mt-0">
                        <h3 className="text-xl font-semibold text-gray-900">Olá, eu sou a Gaby!</h3>
                        <p className="mt-2 text-gray-600">
                            Tudo começou com a minha paixão por encontrar soluções de beleza que fossem não apenas eficazes, mas também práticas para o dia a dia corrido. A GabyMakes nasceu desse desejo de compartilhar produtos que realmente fazem a diferença, selecionados com muito cuidado e pensando em você.
                        </p>
                        <p className="mt-2 text-gray-600">
                            Acreditamos que a beleza deve ser acessível e descomplicada, permitindo que você se sinta confiante e radiante sem precisar de muito esforço. Cada produto em nossa loja é escolhido a dedo para garantir qualidade e praticidade.
                        </p>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}
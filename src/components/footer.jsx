import { FaInstagram, FaFacebookF } from 'react-icons/fa';
import logo from '../assets/logo-bg-transparent-1.png';
import { Link } from 'react-router-dom';

export default function Footer() {
    return (
        <footer className="bg-white-100 border-t border-gray-300 text-black p-10 break-words mt-[200px]">
            {/* Container principal para as colunas */}
            <div className="md:flex md:justify-between md:items-start mb-8">
                {/* Logo e Descrição */}
                <div className="mb-6 md:mb-0 max-w-xs">
                    <Link to="/" className="inline-block mb-2">
                        <img src={logo} alt="Gaby Makes Logo" className="h-16" />
                    </Link>
                    <p className="text-sm">
                        Beleza prática para o seu dia a dia. Produtos selecionados com carinho para você se sentir ainda mais confiante.
                    </p>
                </div>

                {/* Atendimento */}
                <div className="mb-6 md:mb-0">
                    <h4 className="font-semibold uppercase mb-2">Atendimento</h4>
                    <ul className="text-sm space-y-1">
                        <li>Tel/WhatsApp: (88) 99459-5237</li>
                        <li>Email: <a href="mailto:bysampaio20@gmail.com" className="hover:underline">bysampaio20@gmail.com</a></li>
                        <li>
                            <Link to="https://maps.app.goo.gl/ugX24tGk84tfFTH97" target='_blank' className="text-blue-500 hover:underline cursor-pointer">
                                Rua Valdevino Cabral, 212, Centro, Ibaretama,CE
                            </Link>
                        </li>
                        <li>Seg à Sex: 7:30h às 11h e 13:30 às 16:00</li>
                        <li>Sáb: 7:30h às 11h</li>
                    </ul>
                </div>

                {/* Navegação */}
                <div className="mb-6 md:mb-0">
                    <h4 className="font-semibold uppercase mb-2">Navegação</h4>
                    <ul className="text-sm space-y-1">
                        <li><Link to="/sobre" className="hover:underline">Sobre Nós</Link></li>
                        {/* Adicione outros links de navegação aqui */}
                    </ul>
                </div>

                {/* Redes Sociais */}
                <div className="text-center md:text-right">
                    <h4 className="font-semibold uppercase mb-2">Siga-nos</h4>
                    <div className="flex justify-center md:justify-end space-x-4">
                        <Link to="https://www.instagram.com/gaby_make_acessorios" target='_blank' className="bg-black text-white p-2 rounded-full hover:opacity-80">
                            <FaInstagram size={20} />
                        </Link>
                    </div>
                </div>
            </div>

            {/* Direitos Autorais */}
            <div className="w-full text-center text-sm text-gray-500 mt-[100px]">
                Copyright © 2025 GabyMakes - Todos os direitos reservados
            </div>
        </footer>
    );
}
import cardContent from '../assets/card-content.png'

export default function ProductCard () {
    return(
        <div className="w-[300px] h-auto flex flex-col items-center border pt-4">
            <div className="w-[260] aspect-[16/11] overflow-hidden">
                <img
                    src={cardContent}
                    alt="Produto massa"
                    className="w-full h-full object-cover"
                />
            </div>
            <div className="p-4 flex flex-col gap-2">
                <h3 className="text-xl font-semibold">Essentielle Paris</h3>
                <p>
                    Uma fragrância floral e envolvente que combina notas suaves de pétalas de rosa, jasmim branco e toques amadeirados de sândalo.
                </p>

                <h3 className="text-xl font-semibold">R$ 189,90</h3>
            </div>
        </div>
    )
}
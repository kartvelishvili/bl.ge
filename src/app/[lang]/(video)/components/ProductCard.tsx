import React from "react";
import Link from "next/link";

interface ProductCardProps {
    product: {
        id: number;
        name: string;
        image: string;
    };
    idx: number;
    locale: string
}

const ProductCard: React.FC<ProductCardProps> = ({ product, idx, locale }) => {
    const backgroundUrl = `/images/product-categories-background-${
        (idx + 1) % 2 === 0 ? "even" : "odd"
    }.png`;


    return (
        <Link className="flex flex-col items-center justify-center gap-3.5 max-w-[334px] w-full transition-transform duration-300 hover:-translate-y-2" href={`/${locale}/products?productId=${product.id}`}>
            <div
                className="flex items-center justify-center bg-[#191D22] h-[180px] sm:h-[240px] md:h-[386px] w-full rounded-[32px] border-solid border-2 border-[#2C3033]"
                style={{
                    backgroundImage: `url('${backgroundUrl}')`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                }}
            >
                <img
                    src={product.image}
                    alt={product.name}
                    className="h-[118px]  sm:h-[178px]  md:h-[338px] object-contain"
                />
            </div>
            <h2 className="font-dejavuSans font-bold text-base text-[#FFFFFFCC]">
                {product.name}
            </h2>
        </Link>
    );
};

export default ProductCard;
"use client";
import React, { useEffect, useRef, useState } from "react";
import ProductCard from "./ProductCard";
import ContentWrapper from "@/components/ContentWrapper/ContentWrapper";

interface ProductsGridProps {
  products: {
    name: string;
    image: string;
    id: number;
  }[];
  locale: string
}

const ProductsGrid: React.FC<ProductsGridProps> = ({ products, locale }) => {
  const [isVisible, setIsVisible] = useState(false);
  const wineInfo = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.5 },
    );

    if (wineInfo.current) {
      observer.observe(wineInfo.current);
    }

    return () => {
      if (wineInfo.current) {
        observer.unobserve(wineInfo.current);
      }
    };
  }, []);

  return (
    <ContentWrapper
      wrapperClasses={`mt-[32px] sm:mt-[48px] md:mt-[132px]`}
      contentClasses={`grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 transition-all duration-[2s] ease-in-out gap-6 ${isVisible ? "opacity-100 translate-y-[0]" : "opacity-0 translate-y-[60px]"} `}
      ref={wineInfo}
    >
      {products.map((product, idx) => (
        <ProductCard locale={locale} key={idx} product={product} idx={idx} />
      ))}
    </ContentWrapper>
  );
};

export default ProductsGrid;

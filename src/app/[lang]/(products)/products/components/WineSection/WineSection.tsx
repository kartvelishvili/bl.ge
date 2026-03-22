"use client";
import React, { useEffect, useState } from "react";
import styles from "../Products/Products.module.scss";
import { WineSectionProps } from "../types";
import { WineCard } from "../WineCard/WineCard";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import Link from "next/link";
import "swiper/css";
import "swiper/css/navigation";

export const WineSection: React.FC<WineSectionProps> = ({
  iconSrc,
  wines,
  locale,
  companyId,
}) => {
  const [isMobile, setIsMobile] = useState(false);
  const [leftIconSrc, setLeftIconSrc] = useState('/icons/arrow-left.svg')
  const [rightIconSrc, setRightIconSrc] = useState('/icons/arrow-right.svg')

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const wineLimit = isMobile ? 3 : 5;
  const shouldDisplayNavigationButtons = wines.length > wineLimit;
  const shouldRenderShadows = shouldDisplayNavigationButtons;

  return (
    <section className={styles.wineSection}>
      {shouldRenderShadows && (
        <>
          <div
            className={`absolute ${styles.shadowLeft} left-0 top-0 h-full w-[25%] z-10 pointer-events-none`}
          ></div>
          <div
            className={`absolute ${styles.shadow} right-0 top-0 h-full w-[25%]  z-10 pointer-events-none`}
          ></div>
        </>
      )}
      <img
        loading="lazy"
        src={iconSrc}
        className={styles.sectionIcon}
        draggable={false}
      />
      <div className="flex items-center justify-center relative">
        {shouldDisplayNavigationButtons && (
          <button
              onMouseOver={() => setLeftIconSrc('/icons/arrow-left-active.svg')}
              onMouseOut={() => setLeftIconSrc('/icons/arrow-left.svg')}
            className={`${styles.carouselButton} prevButton-${companyId}`}
          >
            <img
              src={leftIconSrc}
              alt="Previous"
              width={40}
              height={40}
              draggable={false}
            />
          </button>
        )}

        <Swiper
          className={`${styles.wineGrid} ${wines.length < wineLimit ? styles.centerGrid : ""}`}
          grabCursor={true}
          slidesPerView={3}
          pagination={{
            el: `.p-${companyId}`,
            clickable: true,
          }}
          navigation={{
            nextEl: `.nextButton-${companyId}`,
            prevEl: `.prevButton-${companyId}`,
          }}
          breakpoints={{
            768: {
              slidesPerView: 3,
            },
            1024: {
              slidesPerView: 5,
            },
          }}
          modules={[Navigation, Pagination]}
        >
          {wines.map((wine) => (
            <SwiperSlide key={wine.id}>
              <Link
                href={`/${locale}/products/${wine.id}`}
                draggable={false}
                className={styles.wineColumn}
                role="listitem"
              >
                <WineCard
                  title={wine.name?.[locale]}
                  subtitle={wine.productCategory.name?.[locale]}
                  imageSrc={wine.image.url}
                  href={""}
                />
              </Link>
            </SwiperSlide>
          ))}
          <div className={`custom-pagination p-${companyId} mt-6`}></div>
        </Swiper>
        {shouldDisplayNavigationButtons && (
          <button
              onMouseOver={() =>setRightIconSrc('/icons/arrow-right-active.svg')}
              onMouseOut={() => setRightIconSrc('/icons/arrow-right.svg')}
            className={`${styles.carouselButton} nextButton-${companyId}`}
          >
            <img
              src={rightIconSrc}
              alt="Next"
              width={40}
              height={40}
              draggable={false}
            />
          </button>
        )}
      </div>
    </section>
  );
};

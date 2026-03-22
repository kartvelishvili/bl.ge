"use client";
import styles from "./SommelierBlog.module.scss";
import { IBlog } from "@/interfaces/blog.interface";
import Link from "next/link";
import { LocaleType } from "@/types/locale.type";
import React, { useEffect, useRef, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import { useRouter } from "next/navigation";

interface Props {
  locale: LocaleType;
  blogs: IBlog[];
  dictionary: Record<string, string>;
}

export default function SommelierBlog(props: Props) {
  const [isVisible] = useState(false);
  const [isBeginning, setIsBeginning] = useState(true);
  const [isEnd, setIsEnd] = useState(false);
  const [hiddenIndex, setHiddenIndex] = useState<number>(3);
  const [visibleButtons, setVisibleButtons] = useState<Record<number, boolean>>(
    {}
  );
  const wineListRef = useRef<HTMLDivElement | null>(null);
  const router = useRouter();
  const swiperRef = useRef<any>(null);

  const handleNextSlide = () => {
    if (swiperRef.current) {
      swiperRef.current.slideNext();
      setHiddenIndex(swiperRef.current.realIndex + 3); 
    }
  };

  const handleButtonClick = (index: number) => {
    setVisibleButtons((prev) => ({ ...prev, [index]: true }));
  };

  const handleSlideChange = (swiper: any) => {
    setIsBeginning(swiper.isBeginning);
    setIsEnd(swiper.isEnd);
    setHiddenIndex(swiper.realIndex + 3); 
  };

  useEffect(() => {
    if (swiperRef.current && swiperRef.current.swiper) {
      swiperRef.current.swiper.on("slideChange", () => {

        setHiddenIndex(swiperRef.current.swiper.realIndex + 3);
      });
    }
  }, []);

  return (
    <div
      className={`${styles.container} ${isVisible ? styles.visible : ""}`}
      ref={wineListRef}
      style={{ position: "relative" }}
    >
      <h2 className={`${styles.title} font-dejavuSans`}>
        {props.dictionary?.["ᲡᲘᲐᲮᲚᲔᲔᲑᲘ"]}
      </h2>

      <div className="flex items-center gap-4 justify-center w-full">
        <Swiper
          ref={swiperRef}
          className={styles.blogGrid}
          onSwiper={(swiper) => (swiperRef.current = swiper)}
          onSlideChange={(swiper) => handleSlideChange(swiper)}
          slidesPerView={3.5}
          spaceBetween={21}
          modules={[Navigation]}
          speed={1000}
          effect="slide"
          loop={true}
          navigation
          breakpoints={{
            320: { slidesPerView: 1, spaceBetween: 14 },
            768: { slidesPerView: 2, spaceBetween: 16 },
            1024: { slidesPerView: 3.5, spaceBetween: 20 },
          }}
        >
          {[...props.blogs, ...props.blogs, ...props.blogs].map(
            (blog, index) => (
              <SwiperSlide key={`${blog.id}-${index}`} className={styles.slide}>
                <Link
                  href={`/${props.locale}/blogs/${blog.id}`}
                  className={styles.card}
                  onClick={(e) => {
                    if (index === hiddenIndex) {
                      e.preventDefault();
                    }
                  }}
                  style={{
                    pointerEvents: index === hiddenIndex ? "none" : "auto",
                    opacity: index === hiddenIndex ? 0.5 : 1,
                  }}
                >
                  <div className={styles.imageWrapper}>
                    <img src={blog.file.url} className={styles.image} />
                    <div className={styles.imageOverlay}></div>
                  </div>

                  <div
                    className={`${styles.infoWrapper} ${
                      index === hiddenIndex
                        ? styles.hiddenText
                        : styles.visibleText
                    }`}
                  >
                    <div className={styles.info}>
                      <h2 className={styles.blogTitle}>
                        {blog.title[props.locale]}
                      </h2>
                      <p className={`${styles.description} line-clamp-3`}>
                        {blog.description[props.locale]}
                      </p>
                    </div>
                    {visibleButtons[index] ? (
                      <button
                        onClick={() =>
                          router.push(`/${props?.locale}/blogs/${blog.id}`)
                        }
                        className={`${styles.button} hover:bg-[#d2ae6d1a]`}
                      >
                        {props.dictionary["ᲡᲠᲣᲚᲐᲓ ᲜᲐᲮᲕᲐ"]}
                      </button>
                    ) : (
                      <button
                        onClick={() => handleButtonClick(index)}
                        className={`${styles.button} hover:bg-[#d2ae6d1a]`}
                      >
                        {props.dictionary["ᲡᲠᲣᲚᲐᲓ ᲜᲐᲮᲕᲐ"]}
                      </button>
                    )}
                  </div>
                </Link>
              </SwiperSlide>
            )
          )}
        </Swiper>
        <button
          className={`nextButton flex-shrink-0 hidden md:block`}
          onClick={handleNextSlide}
          style={{
            opacity: isEnd ? 0.5 : 1,
            cursor: isEnd ? "not-allowed" : "pointer",
            position: "absolute",
            top: "50%",
            right: "10px",
            transform: "translateY(-50%)",
            zIndex: 2,
          }}
        >
          <img
            src="/icons/arrow-right.svg"
            alt="Next"
            width={40}
            height={40}
            draggable={false}
          />
        </button>
      </div>
    </div>
  );
}

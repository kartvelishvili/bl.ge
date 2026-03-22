"use client";
import React, { useEffect, useRef, useState } from "react";
import styles from "./WineInfo.module.scss";
import { Swiper, SwiperSlide } from "swiper/react";
import { EffectFade, Pagination } from "swiper/modules";
import {IBlog} from "@/interfaces/blog.interface";
import Link from "next/link";

interface Props {
  dictionary: Record<string, string>
  blogs: IBlog[];
  locale: 'en' | 'ge' | 'ru'
}

const WineInfo: React.FC<Props> = (props) => {
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
    <div ref={wineInfo} className={styles.wineWrapper}>
      <Swiper
        slidesPerView={1}
        effect="fade"
        fadeEffect={{ crossFade: true }}
        modules={[Pagination, EffectFade]}
        pagination={{ el: ".custom-pagination", clickable: true }}
      >
        {props.blogs.map((blog) => (
          <SwiperSlide key={blog.id}>
            <div
              className={`${styles.wineInfo} ${isVisible ? styles.visible : ""}`}
              style={{ backgroundImage: `url(${blog.file.url})` }}
            >
              <div className={styles.wineInfoWrapper}>
                <h2 className={styles.title}>{blog.title?.[props.locale]}</h2>
                <p className={`${styles.text} line-clamp-7`}>
                  {blog.description?.[props.locale]}
                </p>
                <Link href={`/${props.locale}/about-us/${blog.id}`} className='hover:bg-[#d2ae6d1a]'>
                  <button className={`${styles.button}`}>
                    {props.dictionary?.["ᲡᲠᲣᲚᲐᲓ ᲜᲐᲮᲕᲐ"]}
                  </button>
                </Link>
              </div>
            </div>
          </SwiperSlide>
        ))}
        <div className="custom-pagination relative !bottom-12 z-20"></div>
      </Swiper>
    </div>
  );
};

export default WineInfo;

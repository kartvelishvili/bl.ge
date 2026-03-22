"use client";

import React, { useRef, useEffect, useState } from "react";
import styles from "./WineSlider.module.scss";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/effect-coverflow";
import { EffectCoverflow, Autoplay } from "swiper/modules";
import {ICompany} from "@/interfaces/company.interface";
import {LocaleType} from "@/types/locale.type";
import Image from "next/image";
import Link from "next/link";

interface Props {
    data: ICompany[];
    locale: LocaleType
}

const WineSlider: React.FC<Props> = (props) => {
  const data = props.data;
  const initialSlide = Math.floor(data.length / 2);
  const sectionRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) setIsVisible(true);
      },
      { threshold: 0.2 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => { if (sectionRef.current) observer.unobserve(sectionRef.current); };
  }, []);

  return (
      <div ref={sectionRef} className={`${styles.sliderContainer} ${isVisible ? styles.visible : ''}`}>
          <div className={styles.titleWrapper}>
            <div className={styles.titleLine} />
            <h3 className={styles.title}>ᲡᲐᲕᲐᲭᲠᲝ ᲜᲘᲨᲜᲔᲑᲘ</h3>
            <div className={styles.titleLine} />
          </div>
          <Swiper
              effect={"coverflow"}
              grabCursor={true}
              centeredSlides={true}
              initialSlide={initialSlide}
              slidesPerView={'auto'}
              loop={data.length > 3}
              speed={600}
              autoplay={{ delay: 3000, disableOnInteraction: false }}
              coverflowEffect={{
                  rotate: 0,
                  stretch: 0,
                  depth: 120,
                  modifier: 2.5,
                  slideShadows: false,
              }}
              modules={[EffectCoverflow, Autoplay]}
              className={styles.slider}
          >
              {data.map((company) => (
                  <SwiperSlide key={company.id} className={styles.sliderItem}>
                      <Link href={`/${props.locale}/products?companyId=${company.id}`} className={styles.slideLink} role="listitem">
                          <Image
                              src={company.file.url}
                              alt={company.name}
                              className={styles.sliderImage}
                              width={270}
                              height={215}
                              draggable={false}
                              style={{ width: 'auto', height: 'auto' }}
                          />
                      </Link>
                  </SwiperSlide>
              ))}
          </Swiper>
      </div>
  );
};

export default WineSlider;

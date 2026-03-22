"use client";

import React, { useRef, useState, useEffect } from "react";
import styles from "./WineSlider.module.scss";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/effect-coverflow";
import "swiper/css/pagination";
import { EffectCoverflow, Pagination } from "swiper/modules";
import {ICompany} from "@/interfaces/company.interface";
import {LocaleType} from "@/types/locale.type";
import Image from "next/image";
import Link from "next/link";

const wines = [
  { id: 1, name: "Alaverdi", image: "/alaverdi.jpg" },
  { id: 2, name: "GoldTbilisi", image: "/goldtbilisi.jpg" },
  { id: 3, name: "Berikoni", image: "/berikoni.jpg" },
  { id: 4, name: "Sabado", image: "/sabado.png" },
  { id: 5, name: "Rioneli", image: "/rioneli.jpg" },
  { id: 6, name: "Kolxa", image: "/kolxida.jpg" },
  { id: 7, name: "Enguri", image: "/enguri.jpg" },
];

interface Props {
    data: ICompany[];
    locale: LocaleType
}

const WineSlider: React.FC<Props> = (props) => {
  const data = props.data
  const initialSlide = Math.floor(data.length / 2);

  {
    return (
        <div className={styles.sliderContainer}>
            <h3 className='font-dejavuSans text-2xl color-[#8D8D8D]'>ᲡᲐᲕᲐᲭᲠᲝ ᲜᲘᲨᲜᲔᲑᲘ</h3>
            <Swiper
                effect={"coverflow"}
                grabCursor={true}
                centeredSlides={true}
                initialSlide={initialSlide}
                slidesPerView={'auto'}
                coverflowEffect={{
                    rotate: 0,
                    stretch: 0,
                    depth: 100,
                    modifier: 2.5,
                    slideShadows: false,
                }}
                modules={[EffectCoverflow]}
                className={styles.slider}
            >
                {data.map((company) => (
                    <SwiperSlide key={company.id} className={styles.sliderItem}>
                        <Link href={`/${props.locale}/products?companyId=${company.id}`} className={'w-full h-full'} role="listitem">
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
  }
};

export default WineSlider;

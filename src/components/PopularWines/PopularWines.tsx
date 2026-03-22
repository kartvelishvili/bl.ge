"use client";
import React, { useEffect, useRef, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { IProductItem } from "@/interfaces/product-item.interface";
import { LocaleType } from "@/types/locale.type";
import ContentWrapper from "@/components/ContentWrapper/ContentWrapper";
import { EffectFade, Navigation, Pagination } from "swiper/modules";
import Image from "next/image";

interface Props {
  items: IProductItem[];
  locale: LocaleType;
  dictionary: Record<string, string>;
}

const PopularWines: React.FC<Props> = (props) => {
  const [isVisible, setIsVisible] = useState(false);
  const [animate, setAnimate] = useState(true);
  const [leftIconSrc, setLeftIconSrc] = useState("/icons/arrow-left.svg");
  const [rightIconSrc, setRightIconSrc] = useState("/icons/arrow-right.svg");
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
      ref={wineInfo}
      wrapperClassesInline={{
        transition: "opacity 2s ease-out, transform 2s ease-out",
      }}
      wrapperClasses={`h-[538px]  sm:h-[575px] md:h-[631px] my-[172px] ${isVisible ? "opacity-1 translate-y-[0px]" : "opacity-0 translate-y-[60px]"}`}
      contentClasses="bg-[#171B1F] relative flex items-center justify-center rounded-[48px] border-2 border-[#2E3235] border-solid"
    >
      <button
        className={`w-40 h-40 prevButton relative cursor-pointer hidden md:block left-5`}
        onMouseOver={() => setLeftIconSrc("/icons/arrow-left-active.svg")}
        onMouseOut={() => setLeftIconSrc("/icons/arrow-left.svg")}
      >
        <img
          src={leftIconSrc}
          alt="Previous"
          width={40}
          height={40}
          draggable={false}
        />
      </button>
      <Swiper
        className="sm:pt-[24px] h-full"
        modules={[Pagination, Navigation]}
        navigation={{ prevEl: ".prevButton", nextEl: ".nextButton" }}
        onSlideChangeTransitionEnd={() => setAnimate(true)}
        onSlideChange={() => {
          setAnimate(false);
        }}
        pagination={{ el: ".custom-pagination", clickable: true }}
      >
        {props.items.map((i) => (
          <SwiperSlide key={i.id}>
            <div className="flex flex-col gap-6 sm:gap-[30px] md:gap-[51px] items-center justify-start p-4 sm:pl-8 sm:pt-[24px] sm:pb-[16px] sm:py-[32px] md:pt-[54px] md:pb-[32px] md:px-[125px]">
              <h2 className="text-[#8D8D8D] font-dejavuSans font-normal text-base sm:text-2xl md:text-3xl">
                {props.dictionary["ᲞᲝᲞᲣᲚᲐᲠᲣᲚᲘ ᲦᲕᲘᲜᲝᲔᲑᲘ"]}
              </h2>
              <div className="flex items-center sm:justify-between md:jusify-center w-full">
                <div className="flex items-center flex-wrap justify-between gap-4 sm:gap-[56px] sm:self-start sm:w-[401px] md:w-full">
                  <div className="sm:w-fit md:w-[401px] flex flex-col gap-2 items-start justify-center">
                    <div className="flex flex-col items-start justify-center gap-2">
                      <h3 className="font-dejavuSans text-base sm:text-2xl md:text-[32px]/[40px] text-[#BBAA58]">
                        {i.name[props.locale]}
                      </h3>
                      <span className="font-dejavuSans text-sm sm:text-base font-bold text-[#BBAA58]">
                        {i.productCategory.name[props.locale]}
                      </span>
                    </div>
                    <p className="font-dejavuSans text-xs sm:text-sm/[22px] md:text-base/[32px] text-white">
                      {i.description[props.locale]}
                    </p>
                  </div>
                  <div className="sm:w-fit w-full flex justify-start sm:gap-0 gap-[80px]  items-center sm:justify-between">
                    <div className="sm:w-fit md:w-[327px] flex flex-col items-start justify-center gap-4 sm:grid sm:grid-cols-2 sm:gap-x-[48px] sm:gap-y-[64px]">
                      <div className="flex flex-col items-start justify-center">
                        <h4 className="font-dejavuSans text-sm sm:text-base text-[#BBAA58]">
                          {props.dictionary["შემადგენლობა"]}
                        </h4>
                        <span className="font-dejavuSans text-sm sm:text-base text-white">
                          {i.composition?.[props.locale]}
                        </span>
                      </div>
                      <div className="flex flex-col items-start justify-center">
                        <h4 className="font-dejavuSans text-sm sm:text-base text-[#BBAA58]">
                          {props.dictionary["მევენახეობა"]}
                        </h4>
                        <span className="font-dejavuSans text-sm sm:text-base text-white">
                          {i.viticulture?.[props.locale]}
                        </span>
                      </div>
                      <div className="flex flex-col items-start justify-center">
                        <h4 className="font-dejavuSans text-sm sm:text-base text-[#BBAA58]">
                          {props.dictionary["დაძველება"]}
                        </h4>
                        <span className="font-dejavuSans text-sm sm:text-base text-white">
                          {i.aged?.[props.locale]}
                        </span>
                      </div>
                      <div className="flex flex-col items-start justify-center">
                        <h4 className="font-dejavuSans text-sm sm:text-base text-[#BBAA58]">
                          {props.dictionary["ალკოჰოლი"]}
                        </h4>
                        <span className="font-dejavuSans text-sm sm:text-base text-white">
                          {i.alcohol}%
                        </span>
                      </div>
                    </div>
                    <Image
                      className="block sm:hidden h-[237px]"
                      src={i.image.url}
                      width={58}
                      height={237}
                      alt="Wine Bottle"
                      style={{
                        objectFit: "contain",
                        width: "auto",
                        transition: "top 2s ease-out",
                      }}
                    />
                  </div>
                  <div className="w-[200px] h-[400px] relative hidden md:block">
                    <Image
                      src={i.image.url}
                      width={167}
                      height={730}
                      alt="Wine Bottle"
                      className={`h-[730px] rounded-[48px] absolute ${isVisible && animate ? "top-[-30px]" : "top-[500px]"}`}
                      style={{
                        objectFit: "contain",
                        width: "auto",
                        transition: `${animate ? "top 2s ease-out" : ""}`,
                      }}
                    />
                  </div>
                </div>
                <div className="w-[200px] h-[400px] relative hidden sm:block md:hidden">
                  <Image
                    src={i.image.url}
                    width={118}
                    height={401}
                    alt="Wine Bottle"
                    className={`h-[401px] rounded-[48px] absolute`}
                    style={{
                      objectFit: "contain",
                      width: "auto",
                      transition: "top 2s ease-out",
                    }}
                  />
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
        <div
          className="custom-pagination relative top-[-32px]"
          style={{ top: "-32px", zIndex: "9999999" }}
        ></div>
      </Swiper>
      <button
        className={`nextButton absolute cursor-pointer hidden md:block z-20 right-5`}
        onMouseOver={() => setRightIconSrc("/icons/arrow-right-active.svg")}
        onMouseOut={() => setRightIconSrc("/icons/arrow-right.svg")}
      >
        <img
          src={rightIconSrc}
          alt="Previous"
          width={40}
          height={40}
          draggable={false}
        />
      </button>
    </ContentWrapper>
  );
};

export default PopularWines;

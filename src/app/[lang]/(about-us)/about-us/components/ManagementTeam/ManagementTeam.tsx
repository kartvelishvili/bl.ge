"use client";
import ContentWrapper from "@/components/ContentWrapper/ContentWrapper";
import { Swiper, SwiperSlide } from "swiper/react";

import { Pagination } from "swiper/modules";
import {FC, useEffect, useRef, useState} from "react";
import { IManagementTeam } from "@/interfaces/management-team.interface";
import { LocaleType } from "@/types/locale.type";
import ManagementTeamBack from "../../../../../../../public/images/management-team-back.png";
import BoleroLogoSecond from '@/../public/icons/bolero-logo-second.svg'
import Image from "next/image";

interface Props {
  data: IManagementTeam[];
  locale: LocaleType;
  dictionary: Record<string, string>;
}

const ManagementTeam: FC<Props> = (props) => {
  const [activeSlide, setActiveSlide] = useState(1);
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
      wrapperClassesInline={{
        transition: "opacity 2s ease-out, transform 2s ease-out",
      }}
      wrapperClasses={`md:pt-16 pt-8 md:pb-40 sm:pb-32 pb-16 ${isVisible ? "opacity-1 translate-y-[0px]" : "opacity-0 translate-y-[60px]"}`}
    >
      <div
        ref={wineInfo}
        className="flex flex-col gap-6 sm:gap-8 items-center  justify-center"
      >
        <div className="w-full flex justify-between items-center">
          <h2 className="font-dejavuSans md:text-2xl sm:text-lg text-base">
            {props.dictionary?.["ᲛᲔᲜᲔᲯᲛᲔᲜᲢᲘᲡ ᲒᲣᲜᲓᲘ"]}
          </h2>
          <span className="font-darkerGrotesque font-medium md:text-2xl text-base">
            {activeSlide}/{props.data.length}
          </span>
        </div>
        <div className="relative w-full">
          <Swiper
            slidesPerView={1}
            breakpoints={{
              768: {
                slidesPerView: 2,
              },
            }}
            style={{ backgroundImage: `url(${ManagementTeamBack.src})` }}
            spaceBetween={10}
            modules={[Pagination]}
            onSlideChange={(swiper) => setActiveSlide(swiper.activeIndex + 1)}
            pagination={{
              clickable: true,
              el: ".custom-pagination",
            }}
          >
            {props.data?.map((team) => (
              <SwiperSlide key={team.id}>
                <div
                  style={{
                    backgroundImage: `url(${ManagementTeamBack.src})`,
                    backgroundPosition: "right top",
                    backgroundColor: "#191D22",
                    backgroundSize: "contain",
                  }}
                  className="w-full relative bg-no-repeat md:h-[296px] bg-transparent sm:h-[324px] h-[155px] rounded-[12px] border-[#FFFFFF33] border-solid border-[1px] sm:py-6 md:px-6 sm:px-2 px-2 px-0 py-[5px] flex items-center justify-start md:gap-10 gap-2"
                >
                  <div className="absolute top-2 right-2">
                    <Image  src={BoleroLogoSecond} alt={'Bolero Logo'} width={47} height={52} />
                  </div>
                  <img
                    src={team.image.url}
                    alt={"Giorgi Kartvelishvili"}
                    className="w-[111px] sm:w-[222px] md:w-fit h-full rounded-lg"
                  />
                  <div className="md:w-[553px] w-fit flex flex-col sm:gap-6 md:gap-2 gap-2">
                    <h2 className="font-dejavuSans md:text-2xl sm:text-base text-xs text-white">
                      {team.firstName[props.locale]}{" "}
                      {team.lastName[props.locale]}
                    </h2>
                    <p className="font-dejavuSans md:text-base/8 sm:text-sm text-xs text-[#FFFFFFCC] text-left">
                      {team.profession[props.locale]}
                    </p>
                  </div>
                </div>
              </SwiperSlide>
            ))}
            <div className="custom-pagination mt-6"></div>
          </Swiper>
        </div>
      </div>
    </ContentWrapper>
  );
};

export default ManagementTeam;

"use client";
import { ICompany } from "@/interfaces/company.interface";
import styles from "./Products.module.scss";
import { FC, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";

interface Props {
  companies: ICompany[];
  locale: string;
}

const Companies: FC<Props> = (props) => {
  const searchParams = useSearchParams();
  const router = useRouter();

  return (
    <div
      className={`flex no-scrollbar items-center md:min-h-[115px] md:max-h-[106px] justify-start gap-[24px] sm:px-[124px] md:px-14 px-4 md:py-3 py-4 max-w-full w-full overflow-x-auto ${styles.border} cursor-grab active:cursor-grabbing`}
    >
      <Swiper
        slidesPerView="auto"
        spaceBetween={24}
        modules={[Pagination]}
        className={"flex flex-col items-center justify-center"}
        pagination={{
          clickable: true,
          el: ".custom-pagination",
        }}
        grabCursor={true}
      >
        {props.companies.map((company) => {
          const params = new URLSearchParams(searchParams.toString());
          const currentParam = params.get("companyId");
          const isActive = Number(currentParam) === company.id;

          if (currentParam && Number(currentParam) === company.id) {
            params.delete("companyId", currentParam);
          } else {
            params.set("companyId", company.id.toString());
          }

          return (
            <SwiperSlide
              style={{
                width: "fit-content",
                height: "48px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
              key={company.id}
              onClick={() =>
                router.push(`/${props.locale}/products?${params.toString()}`)
              }
            >
              <img
                draggable={false}
                src={
                  isActive
                    ? company.activeFile?.url
                    : company.secondaryFile?.url
                }
                alt={company.name}
                className="max-h-[32px] max-w-[180px]"
              />
            </SwiperSlide>
          );
        })}
        <div className="custom-pagination hidden-on-mobile mt-6"></div>
      </Swiper>
    </div>
  );
};

export default Companies;

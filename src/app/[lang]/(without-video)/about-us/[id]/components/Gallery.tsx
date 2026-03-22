"use client";
import { Swiper, SwiperSlide } from "swiper/react";
import { IFile } from "@/interfaces/file.interface";
import { FC } from "react";
import { Pagination } from "swiper/modules";

interface Props {
  gallery: IFile[];
}

const Gallery: FC<Props> = (props) => {
  return (
      <div>
          <Swiper
              slidesPerView={1}
              spaceBetween={10}
              modules={[Pagination]}
              pagination={{
                  clickable: true,
                  el: ".custom-pagination",
              }}
              className="w-full"
          >
              {props.gallery.map((g) => (
                  <SwiperSlide key={g.id}>
                      <img
                          src={g.url}
                          alt={"Blog Test Image"}
                          draggable={false}
                          className="h-[274.76px] sm:h-[677px] md:h-[624px] w-full object-cover rounded-3xl"
                      />
                  </SwiperSlide>
              ))}
          </Swiper>
          <div className="custom-pagination mt-6"></div>
      </div>
  );
};

export default Gallery;

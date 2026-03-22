import ContentWrapper from "@/components/ContentWrapper/ContentWrapper";
import Image from "next/image";
import BlogImage from "../../../../../../public/bolero.png";
import { get } from "@/lib/api/get-function";
import { FC } from "react";
import { IBlog } from "@/interfaces/blog.interface";
import {Swiper, SwiperSlide} from "swiper/react";
import Gallery from "@/app/[lang]/(without-video)/about-us/[id]/components/Gallery";

const SingleBlogPage: FC<{ params: any }> = async ({ params }) => {
  const { id, lang } = await params;

  const blog = await get<IBlog>({ url: "blogs", id });

  return (
    <ContentWrapper
      contentClasses={"flex flex-col gap-14"}
      wrapperClasses="md:pt-16 sm:pt-8 pt-5"
    >
      <div className="flex flex-col md:gap-12 sm:gap-[72px] gap-14">
        <div className="flex sm:flex-row flex-col items-start sm:items-center justify-center sm:justify-between">
          <h1 className="font-dejavuSans font-regular md:text-[32px] sm:text-2xl text-base text-[#BBAA58]">
            {(blog.title as any)[lang]}
          </h1>
        </div>
        <Gallery gallery={blog.gallery} />
        <div className="text-white  py-6 sm:py-4 md:py-6 border">
          <p className="font-dejavuSans  text-base font-normal leading-8 text-center decoration-slice">
            {(blog.description as any)[lang]}
          </p>
        </div>
      </div>
    </ContentWrapper>
  );
};

export default SingleBlogPage;

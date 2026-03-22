import ContentWrapper from "@/components/ContentWrapper/ContentWrapper";
import { get } from "@/lib/api/get-function";
import { IBlog } from "@/interfaces/blog.interface";
import { NextPage } from "next";
import dayjs from "dayjs";
import "dayjs/locale/ka";
import "dayjs/locale/en";
import "dayjs/locale/ru";
import "react-image-gallery/styles/image-gallery.css";
import Gallery from "@/app/[lang]/(without-video)/blogs/[id]/components/Gallery";

const SingleBlogPage: NextPage<{ params: any }> = async ({ params }) => {
  const { id, lang } = await params;
  const blog = await get<IBlog>({ url: "blogs", id });

  let t = "წ";

  if (lang === "en") {
    t = "yr.";
  } else if (lang === "ru") {
    t = "г.";
  }

  const locale = lang === 'ge' ? 'ka' : lang

  return (
    <ContentWrapper
      contentClasses={"flex flex-col gap-14"}
      wrapperClasses="md:pt-16 sm:pt-8 pt-5"
    >
      <div className="flex flex-col md:gap-6 sm:gap-5 gap-4">
        <div className="flex sm:flex-row flex-col items-start sm:items-center justify-center sm:justify-between">
          <h1 className="font-notoSansGe font-semibold md:text-[32px] sm:text-2xl text-base">
            {(blog.title as any)[lang]}
          </h1>
          <span className="text-[#D2AE6D] text-base md:text-[20px] font-notoSansGeo">
            {dayjs(blog.createdAt).locale(locale).format(`DD MMMM YYYY ${t}`)}
          </span>
        </div>
        <div className="flex items-start flex-wrap sm:flex-nowrap gap-5 md:gap-8">
          <img
            src={blog.file.url}
            alt={"Blog Test Image"}
            className="w-full h-auto md:w-[684px] rounded-xl"
          />
          <p className="font-dejavuSans custom-scrollbar text-[12px] md:max-h-[360px] overflow-y-auto sm:text-[14px] md:text-[16px] text-[rgba(255, 255, 255, 0.8)] w-[676px]">
            {(blog.description as any)[lang]}
          </p>
        </div>
      </div>
      <div
        style={{ scrollbarWidth: "none" }}
        className="border-t border-b py-6  border-white border-opacity-20 flex items-center md:justify-start justify-start gap-4 max-w-full overflow-y-auto"
      >
        <Gallery images={blog.gallery} />
      </div>
    </ContentWrapper>
  );
};

export default SingleBlogPage;

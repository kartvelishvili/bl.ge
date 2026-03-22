'use client'
import ContentWrapper from "@/components/ContentWrapper/ContentWrapper";
import BlogCard from "@/app/[lang]/(about-us)/about-us/components/BlogCard/BlogCard";
import { IBlog } from "@/interfaces/blog.interface";
import {FC, useEffect, useRef, useState} from "react";
import { LocaleType } from "@/types/locale.type";

interface Props {
  data: IBlog[];
  locale: LocaleType;
  dictionary: Record<string, string>
}

const Blogs: FC<Props> = (props) => {
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
      ref={wineInfo}
      wrapperClasses={`md:py-40 sm:py-32 py-16 ${isVisible ? 'opacity-1 translate-y-[0px]' : 'opacity-0 translate-y-[60px]'}`}
      wrapperClassesInline={{
        transition: "opacity 2s ease-out, transform 2s ease-out",
      }}
      contentClasses="flex items-center  md:justify-between justify-center flex-wrap md:gap-0 gap-14"
    >
      {props.data.map((b) => (
        <BlogCard
          dictionary={props.dictionary}
          key={b.id}
          data={b}
          locale={props.locale}
        />
      ))}
    </ContentWrapper>
  );
};

export default Blogs;

"use client";
import ContentWrapper from "@/components/ContentWrapper/ContentWrapper";
import AboutUsImage from "../../../../../../../public/images/about-us.png";
import { FC, useEffect, useRef, useState } from "react";

interface Props {
  dictionary: Record<string, string>;
}

const Description: FC<Props> = (props) => {
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
      wrapperClasses={`md:h-[751px] sm:h-[524px] h-[405px]  ${isVisible ? 'opacity-1 translate-y-[0px]' : 'opacity-0 translate-y-[60px]'} `}
      contentClasses="flex flex-col gap-6 items-center justify-center"
      wrapperClassesInline={{
        backgroundImage: `url(${AboutUsImage.src})`,
        transition: "opacity 2s ease-out, transform 2s ease-out",
      }}
    >
      <h2 className="font-dejavuSans md:text-3xl sm:text-2xl text-base text-[#BBAA58]">
        BOLERO & COMPANY
      </h2>
      <p className="text-center font-dejavuSans md:text-base/8 text-xs hidden sm:block">
        {props.dictionary?.["management-team-description"]}
      </p>
      <p className="text-center font-dejavuSans md:text-base/8 text-xs block sm:hidden">
        {props.dictionary?.["management-team-description"]}
      </p>
    </ContentWrapper>
  );
};

export default Description;

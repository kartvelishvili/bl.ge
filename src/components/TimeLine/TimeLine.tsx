"use client";
import React, {FC, useEffect, useRef, useState} from "react";
import DesktopGeorgian from "@/components/TimeLine/components/DekstopGeorgian";
import DesktopEnglish from "@/components/TimeLine/components/DesktopEnglish";
import DesktopRussian from "@/components/TimeLine/components/DesktopRussian";
import MobileGeorgian from "@/components/TimeLine/components/MobileGeorgian";
import MobileEnglish from "@/components/TimeLine/components/MobileEnglish";
import MobileRussian from "@/components/TimeLine/components/MobileRussian";

interface Props {
  backgroundImageUrl: string;
  locale: string;
  dictionary: Record<string, string>;
}

const Timeline: FC<Props> = (props) => {
  const wineListRef = useRef<HTMLDivElement | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

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

    if (wineListRef.current) {
      observer.observe(wineListRef.current);
    }

    return () => {
      if (wineListRef.current) {
        observer.unobserve(wineListRef.current);
      }
    };
  }, []);

  const handleMouseDown = (e: any) => {
    setIsDragging(true);
    setStartX(e.clientX);
    setScrollLeft(e.currentTarget.scrollLeft);
  };

  const handleMouseLeave = () => {
    setIsDragging(false);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseMove = (e: any) => {
    if (!isDragging) return;
    const moveX = e.clientX - startX;
    e.currentTarget.scrollLeft = scrollLeft - moveX;
  };

  return (
      <>
        <style jsx>{`
            @keyframes zoomInOut {
                0% {
                    background-size: 100%;
                }
                100% {
                    background-size: 130%;
                }
            }
        `}</style>
  <div
      ref={wineListRef}
      className="w-full max-w-full overflow-x-scroll h-[327px] sm:h-[637px] flex flex-col items-start justify-end overflow-hiddem relative"
      style={{
        scrollbarWidth: "none",
        backgroundImage: `url(${props.backgroundImageUrl})`,
        backgroundPosition: 'center center',
        animation: isVisible ? 'zoomInOut 2s ease-in-out forwards' : 'none',
      }}
  >
    <h3 className="absolute left-1/2 top-8 transform -translate-x-1/2 -translate-y-1/2 pt-8 font-notoSansGeorigan sm:text-[24px] md:text-2xl text-base font-semibold text-[#D2AE6D] text-center ">
        {props.dictionary['ᲥᲐᲠᲗᲣᲚᲘ ᲦᲕᲘᲜᲘᲡ ᲘᲡᲢᲝᲠᲘᲐ']}
      </h3>
      <div
          className="h-full flex flex-col items-start justify-start w-full overflow-x-scroll mt-[80px] p-0 sm:pl-[214px] sm:pr-[214px]"
          onMouseDown={handleMouseDown}
          onMouseLeave={handleMouseLeave}
          onMouseUp={handleMouseUp}
          onMouseMove={handleMouseMove}
          style={{
              scrollbarWidth: "none",
          }}
      >
          {props.locale === 'ge' && (
              <>
                  <DesktopGeorgian />
                  <MobileGeorgian />
              </>
          )}
          {props.locale === 'en' && (
              <>
                  <DesktopEnglish />
                  <MobileEnglish />
              </>
          )}
          {props.locale === 'ru' && (
              <>
                  <DesktopRussian />
                  <MobileRussian />
              </>
          )}

      </div>
  </div>
      </>
  );
};

export default Timeline;

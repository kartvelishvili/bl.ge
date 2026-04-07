"use client";
import React, { useState } from "react";
import styles from "./BoleroWines.module.scss";
import { IProductItem } from "@/interfaces/product-item.interface";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import Link from "next/link";
import { LocaleType } from "@/types/locale.type";

const PdfModal = ({ url, pageUrl, onClose }: { url: string; pageUrl: string; onClose: () => void }) => {
  const proxyUrl = `/api/pdf?url=${encodeURIComponent(url)}`;
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(pageUrl).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className={styles.pdfOverlay} onClick={onClose}>
      <div className={styles.pdfModal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.pdfToolbar}>
          <button className={styles.pdfCopyLink} onClick={handleCopy} title="Copy link">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
              <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
            </svg>
            <span>{pageUrl.replace('https://', '')}</span>
            <span className={styles.pdfCopiedBadge} data-visible={copied}>Copied!</span>
          </button>
          <a href={proxyUrl} download className={styles.pdfDownloadBtn}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
            Download
          </a>
          <button className={styles.pdfCloseBtn} onClick={onClose}>✕</button>
        </div>
        <iframe src={proxyUrl} className={styles.pdfFrame} />
      </div>
    </div>
  );
};

interface Props {
  item: IProductItem;
  similarItems: IProductItem[];
  locale: LocaleType;
  dictionary: Record<string, string>;
}

export const BoleroWines: React.FC<Props> = (props) => {
  const [leftIconSrc, setLeftIconSrc] = useState("/icons/arrow-left.svg");
  const [rightIconSrc, setRightIconSrc] = useState("/icons/arrow-right.svg");
  const [imagesLeftIconSrc, setImagesLeftIconSrc] = useState(
    "/icons/arrow-left.svg",
  );
  const [imagesRightIconSrc, setImagesRightIconSrc] = useState(
    "/icons/arrow-left.svg",
  );
  const [pdfOpen, setPdfOpen] = useState(false);

  const glasses = [
    {
      key: "wine",
      src: "/cups/wine.svg",
      width: 19.11,
      height: 45.2,
    },
    {
      key: "burgundy",
      src: "/cups/burgundy.svg",
      width: 17.2,
      height: 54,
    },
    {
      key: "cordial",
      src: "/cups/cordial.svg",
      width: 23.43,
      height: 51,
    },
    {
      key: "champagne",
      src: "/cups/champagne.svg",
      width: 14.5,
      height: 37.9,
    },
    {
      key: "cognac",
      src: "/cups/cognac.svg",
      width: 26.83,
      height: 31.7,
    },
  ];

  for (const g of glasses) {
    if (g.key === props.item.glass) {
      g.src = `/cups/${g.key}-active.svg`;
      break;
    }
  }
  
  const images = props.item?.images?.length ? [props.item.image, ...props.item.images] : []; 

  return (
    <main className={styles.container}>
      <div className={styles.productInfo}>
        <div className={styles.leftColumn}>
          <h2 className={styles.heading}>{props.item.name[props.locale]}</h2>
          <h4 className={styles.subtitle}>
            {props.item.productCategory.name[props.locale]}
          </h4>
          <p className={styles.paragraph}>
            {props.item.description[props.locale]}
          </p>
          <div className={styles.wineSpecs}>
            <div className={styles.specItem}>
              <span className={styles.specLabel}>
                {props.dictionary["ფერი"]}:
              </span>
              <span className={styles.specValue}>
                {props.item.color[props.locale]}
              </span>
            </div>
            <div className={styles.specItem}>
              <span className={styles.specLabel}>
                {props.dictionary?.["ტემპერატურა:"]}
              </span>
              <span className={styles.specValue}>
                {props.item.temperature}°C
              </span>
            </div>
            <div className={styles.specItem}>
              <span className={styles.specLabel}>
                {props.dictionary?.["ალკოჰოლი:"]}
              </span>
              <span className={styles.specValue}>{props.item.alcohol}%</span>
            </div>
            <div className={styles.specItem}>
              <span className={styles.specLabel}>
                {props.dictionary?.["ტიპი:"]}
              </span>
              <span className={styles.specValue}>
                {props.item.productCategory.name[props.locale]}
              </span>
            </div>
            {props.item.volume && (
              <div className={styles.specItem}>
                <span className={styles.specLabel}>
                  {props.dictionary?.["მოცულობა"]}:
                </span>
                <span className={styles.specValue}>
                  {props.item.volume[props.locale]}
                </span>
              </div>
            )}
          </div>
          <div className={styles.tastingBox}>
            <div className={styles.tastingSection}>
              <h3>{props.dictionary?.["დეგუსტაცია"]}</h3>
              <div className={styles.tastingChart}>
                <div className={styles.chartItem}>
                  <span className={styles.chartLabel}>
                    {props.dictionary?.["ხილისებრი ტონები"]}
                  </span>
                  <div className={styles.chartBar}>
                    <div
                      className={styles.barFill}
                      style={{ width: `${props.item.fruitTones}%` }}
                    />
                  </div>
                </div>
                <div className={styles.chartItem}>
                  <span className={styles.chartLabel}>
                    {props.dictionary?.["ტანინები"]}
                  </span>
                  <div className={styles.chartBar}>
                    <div
                      className={styles.barFill}
                      style={{ width: `${props.item.tannins}%` }}
                    />
                  </div>
                </div>
                <div className={styles.chartItem}>
                  <span className={styles.chartLabel}>
                    {props.dictionary?.["სიტკბო"]}
                  </span>
                  <div className={styles.chartBar}>
                    <div
                      className={styles.barFill}
                      style={{ width: `${props.item.sweetness}%` }}
                    />
                  </div>
                </div>
                <div className={styles.chartItem}>
                  <span className={styles.chartLabel}>
                    {props.dictionary?.["სხეული"]}
                  </span>
                  <div className={styles.chartBar}>
                    <div
                      className={styles.barFill}
                      style={{ width: `${props.item.body}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className={styles.divider} />
            <div className={styles.glassSection}>
              <h3>{props.dictionary?.["ბოკალის ტიპი"]}</h3>
              <div className={styles.glassTypes}>
                {glasses.map((g) => (
                  <Image
                    key={g.src}
                    src={g.src}
                    width={g.width}
                    height={g.height}
                    alt={""}
                  />
                ))}
              </div>
            </div>
          </div>
          <div className={styles.characteristics}>
            <div className={styles.dishes}>
              <h3>{props.dictionary["კერძებთან შეხამება"]}</h3>
              <div className={styles.foodContainer}>
                {props.item.foods.map((food) => (
                  <div className={styles.foods} key={food.id}>
                    <h4 className={styles.foodHeading}>
                      {food.name[props.locale]}
                    </h4>
                    <img
                      src={food.image.url}
                      width={40}
                      height={40}
                      draggable={false}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
          <button
            className={styles.btn}
            onClick={() => setPdfOpen(true)}
          >
            {props.item.alcohol >= 40
              ? props.dictionary["დისტილაციის პროცესი"]
              : props.dictionary?.["ვინიფიკაცია"]}
          </button>
          {pdfOpen && (
            <PdfModal
              url={props.item.vinification.url}
              pageUrl={`https://bolero.ge/${props.locale}/products/${props.item.id}`}
              onClose={() => setPdfOpen(false)}
            />
          )}
          {" "}
        </div>
        <div className={styles.rightColumn}>
          <div
            className={
              "flex justify-center items-center gap-2" +
              " " +
              styles.productImage
            }
          >
            <button
              className={`${styles.carouselButton} ${!images.length ? "hidden" : ""} flex-shrink-0 prevButton`}
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
            {!!images?.length && (
              <Swiper
                slidesPerView={1}
                modules={[Navigation]}
                className={"w-full"}
                navigation={{
                  nextEl: ".nextButton",
                  prevEl: ".prevButton",
                }}
              >
                {images.map((image) => (
                  <SwiperSlide
                    className={"!flex-shrink-0 !w-fit"}
                    key={image.id}
                  >
                    <img src={image.url} />
                  </SwiperSlide>
                ))}
              </Swiper>
            )}
            <button
              className={`${styles.carouselButton} ${!images.length ? "hidden" : ""} nextButton flex-shrink-0`}
              onMouseOver={() =>
                setRightIconSrc("/icons/arrow-right-active.svg")
              }
              onMouseOut={() => setRightIconSrc("/icons/arrow-right.svg")}
            >
              <img
                src={rightIconSrc}
                alt="Next"
                width={40}
                height={40}
                style={{ marginLeft: "51px" }}
                draggable={false}
              />
            </button>
            {!images.length && (
              <img
                src={props.item.image.url}
                alt="Sabado Wine"
                className={styles.productImage}
                draggable={false}
              />
            )}
          </div>
          <div className={styles.ratings}>
            {props.item.awards.map((award) => {
              return (
                <React.Fragment key={award.id}>
                  <div className="w-[92px] h-[92px] bg-[#3D4145] rounded-full hidden sm:flex items-center justify-center">
                    <Image
                      src={award.url}
                      alt={award.url}
                      width={80}
                      height={80}
                    />
                  </div>
                  <Image
                    src={award.url}
                    alt={award.url}
                    className={"sm:hidden block"}
                    width={80}
                    height={80}
                  />
                </React.Fragment>
              );
            })}
          </div>
        </div>
      </div>
      <div className={`${styles.relatedProducts} border`}>
        <div className={styles.productsCarousel}>
          <h3>{props.dictionary?.["აღმოაჩინეთ ჩვენი პროდუქტები"]}</h3>
          <button
            className={`${styles.carouselButton}  prevButton`}
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
            slidesPerView={1}
            breakpoints={{
              320: {
                slidesPerView: 2,
              },
              768: {
                slidesPerView: 3,
              },
            }}
            className={styles.carouselItems}
            modules={[Navigation]}
            navigation={{ nextEl: ".nextButton", prevEl: ".prevButton" }}
          >
            {props.similarItems.map((item) => (
              <SwiperSlide key={item.id} className={styles.carouselItem}>
                <Link
                  href={`/${props.locale}/products/${item.id}`}
                  role="listitem"
                >
                  <div className="flex flex-col items-center justify-center">
                    <img
                      src={item.image.url}
                      alt="Wine"
                      draggable={false}
                      className={styles.anotherProductImage}
                    />
                    <div className="flex flex-col items-center">
                      <span className={styles.wineName}>
                        {item.name[props.locale]}
                      </span>
                      <span className={styles.wineType}>
                        {item.productCategory.name[props.locale]}
                      </span>
                    </div>
                  </div>
                </Link>
              </SwiperSlide>
            ))}
          </Swiper>
          <button
            className={`${styles.carouselButton} nextButton`}
            onMouseOver={() => setRightIconSrc("/icons/arrow-right-active.svg")}
            onMouseOut={() => setRightIconSrc("/icons/arrow-right.svg")}
          >
            <img
              src={rightIconSrc}
              alt="Next"
              width={40}
              height={40}
              style={{ marginLeft: "51px" }}
              draggable={false}
            />
          </button>
        </div>
      </div>
    </main>
  );
};

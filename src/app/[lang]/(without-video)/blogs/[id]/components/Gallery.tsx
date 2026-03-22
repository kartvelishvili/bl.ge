"use client";
import { FC, useState } from "react";
import { IFile } from "@/interfaces/file.interface";
import ImageGallery from "react-image-gallery";

interface Props {
  images: IFile[];
}

const Gallery: FC<Props> = (props) => {
  const images = props.images.map((b) => ({
    original: b.url,
    thumbnail: b.url,
  }));
  const [isOpen, setIsOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const openGallery = (index: number) => {
    setCurrentIndex(index);
    setIsOpen(true);
  };

  // @ts-ignore
  return (
    <div>
      <div style={{ display: "flex", gap: "24px", cursor: "pointer" }}>
        {images.map((img, index) => (
          <img
            key={index}
            className="md:max-w-[336px] object-cover w-auto  h-[300px] rounded-lg"
            src={img.original}
            alt={`Image ${index + 1}`}
            width={150}
            style={{ borderRadius: "8px" }}
            onClick={() => openGallery(index)}
          />
        ))}
      </div>
      {isOpen && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            background: "rgba(0,0,0,0.8)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1000,
          }}
        >
          <div style={{ width: "80%", maxWidth: "800px" }}>
            <ImageGallery
              items={images}
              startIndex={currentIndex}
              renderLeftNav={(onClick) => (
                <img
                  className='image-gallery-left-nav absolute pointer z-20 mr-2'
                  src={"/icons/arrow-left.svg"}
                  onClick={onClick}
                />
              )}
              renderRightNav={(onClick) => (
                  <img
                      className='image-gallery-right-nav absolute pointer z-20 ml-2'
                      src={"/icons/arrow-right.svg"}
                      onClick={onClick}
                  />
              )}
              showThumbnails={false}
              showPlayButton={false}
              showFullscreenButton={false}
            />
          </div>
          <button
            onClick={() => setIsOpen(false)}
            style={{
              position: "absolute",
              top: "20px",
              right: "20px",
              border: "none",
              padding: "10px",
              cursor: "pointer",
              fontSize: "16px",
            }}
          >
            ✖
          </button>
        </div>
      )}
    </div>
  );
};

export default Gallery;

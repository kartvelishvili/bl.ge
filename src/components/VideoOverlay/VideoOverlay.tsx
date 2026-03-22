"use client";

import { FC, ReactNode, useEffect, useState } from "react";

interface Props {
  children: ReactNode;
}

const VideoOverlay: FC<Props> = (props) => {
  const [isVideoHydrated, setIsVideoHydrated] = useState(false);
  const [isVideoPlayed, setIsVideoPlayed] = useState<boolean>(false);
  const IS_VIDEO_PLAYED_KEY = "isVideoPlayed";

  useEffect(() => {
    setIsVideoHydrated(true);

    const isVideoPlayed =
      sessionStorage.getItem(IS_VIDEO_PLAYED_KEY) === "true";
    setIsVideoPlayed(isVideoPlayed);

    const body = document.getElementsByTagName("body")[0];

    if (body) {
      body.style.overflowY = "hidden";
    }
  }, []);

  const handleVideoEnd = () => {
    const body = document.getElementsByTagName("body")[0];
    body.style.overflowY = "auto";
    setIsVideoPlayed(true);
    sessionStorage.setItem(IS_VIDEO_PLAYED_KEY, "true");
  };


  if (isVideoPlayed) {
    return props.children;
  }

  return (
      <>
      <div style={{ display: isVideoPlayed ? 'block' : 'none' }}>{props.children}</div>
      <div style={{ display: !isVideoPlayed ? 'block' : 'none' }} className='min-w-full min-h-screen bg-[#071115]'>
    <video
      src={"/bolero-last.mp4"}
      onEnded={handleVideoEnd}
      autoPlay
      muted
      playsInline
      className="w-full fixed h-full"
      style={{ zIndex: "9999999999999" }}
    />
      </div>
      </>
  );
};

export default VideoOverlay;

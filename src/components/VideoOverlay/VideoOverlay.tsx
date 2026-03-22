"use client";

import { FC, ReactNode, useEffect, useState } from "react";

interface Props {
  children: ReactNode;
  videoEnabled?: boolean;
}

const VideoOverlay: FC<Props> = (props) => {
  const [isVideoPlayed, setIsVideoPlayed] = useState<boolean>(false);
  const IS_VIDEO_PLAYED_KEY = "isVideoPlayed";

  useEffect(() => {
    const played = sessionStorage.getItem(IS_VIDEO_PLAYED_KEY) === "true";
    setIsVideoPlayed(played);

    // If video is disabled via admin settings, skip it
    if (props.videoEnabled === false || played) {
      if (props.videoEnabled === false) setIsVideoPlayed(true);
      const body = document.getElementsByTagName("body")[0];
      if (body) body.style.overflowY = "auto";
      return;
    }

    const body = document.getElementsByTagName("body")[0];
    if (body) {
      body.style.overflowY = "hidden";
    }
  }, [props.videoEnabled]);

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

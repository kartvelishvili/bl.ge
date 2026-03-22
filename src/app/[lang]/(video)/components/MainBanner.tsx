'use client'
import {FC, useEffect} from "react";


const MainBanner: FC = () => {
    useEffect(() => {
        const video = document.getElementById("video") as HTMLVideoElement;
        if (video) {
            video.removeAttribute("controls");
            video.setAttribute("playsinline", "");
            video.setAttribute("webkit-playsinline", "");
        }
    }, []);
    return (
        <div
            className="relative flex items-center justify-center flex-col h-[256px] sm:h-[324px] md:h-[921px] bg-cover bg-center pt-8 sm:pt-14 md:pt-0">
            <video
                id='video'
                autoPlay
                loop
                muted
                playsInline={true}
                controls={false}
                className="absolute top-0 left-0 w-full h-full object-cover"
            >
                <source src={'/landing.mp4'} type="video/mp4"/>
                Your browser does not support the video tag.
            </video>
            <div
                className="absolute top-0 left-0 w-full h-full"
                style={{
                    background: 'linear-gradient(180deg, rgba(0,0,0,0.94) 6%, rgba(255,255,255,0) 56%)'
                }}
            />
        </div>
    );
};

export default MainBanner;


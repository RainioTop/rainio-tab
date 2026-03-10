import React from 'react';
import './Background.css';

interface BackgroundProps {
    videoSrc: string;
    opacity?: number;
    brightness?: number;
    autoPlay?: boolean;
    loop?: boolean;
    muted?: boolean;
}

const Background: React.FC<BackgroundProps> = ({
                                                   videoSrc,
                                                   opacity = 0.9,
                                                   brightness = 0.8,
                                                   autoPlay = true,
                                                   loop = true,
                                                   muted = true,
                                               }) => {
    return (
        <video
            className="background-video"
            src={videoSrc}
            autoPlay={autoPlay}
            loop={loop}
            muted={muted}
            playsInline
            preload="auto"
            style={{
                opacity,
                filter: `brightness(${brightness})`,
            }}
        >
            <p>您的浏览器不支持视频播放，请更新浏览器版本</p>
        </video>
    );
};

export default Background;
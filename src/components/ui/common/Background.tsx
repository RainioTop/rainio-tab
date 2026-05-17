import React from 'react';
import './Background.css';

interface BackgroundProps {
    videoSrc: string;
    wallpaperType?: 'color' | 'url';
    wallpaperValue?: string;
    isFullScreen?: boolean;
    opacity?: number;
    brightness?: number;
    autoPlay?: boolean;
    loop?: boolean;
    muted?: boolean;
}

const Background: React.FC<BackgroundProps> = ({
    videoSrc,
    wallpaperType,
    wallpaperValue,
    isFullScreen = false,
    opacity = 0.9,
    brightness = 0.8,
    autoPlay = true,
    loop = true,
    muted = true,
}) => {
    const hasWallpaper = wallpaperType && wallpaperValue;

    if (hasWallpaper) {
        const bgStyle: React.CSSProperties = wallpaperType === 'color'
            ? { backgroundColor: wallpaperValue, opacity: 1 }
            : { backgroundImage: `url(${wallpaperValue})`, backgroundSize: 'cover', backgroundPosition: 'center', opacity: 1 };

        if (isFullScreen) {
            bgStyle.position = 'fixed';
            bgStyle.top = 0;
            bgStyle.left = 0;
            bgStyle.width = '100vw';
            bgStyle.height = '100vh';
        }

        return <div className="background-color" style={bgStyle} />;
    }

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

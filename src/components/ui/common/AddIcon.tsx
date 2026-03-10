import React, {type CSSProperties, useRef} from 'react';
import './AddIcon.css';

interface GlassAddIconProps {
    /** 按钮尺寸（数字为px值，字符串支持任意CSS单位） */
    size?: number | string;
    /** 自定义类名 */
    className?: string;
    /** 自定义样式 */
    style?: CSSProperties;
    /** 点击事件 */
    onClick?: () => void;
    /** 加号颜色 */
    tintColor?: string;
    /** 整体透明度 */
    opacity?: number;
    /** 是否禁用（兼容原有属性） */
    disabled?: boolean;
}

const AddIcon: React.FC<GlassAddIconProps> = ({
                                                  size = 44,
                                                  className = '',
                                                  style,
                                                  onClick,
                                                  // tintColor = 'rgba(255, 255, 255, 0.8)',
                                                  opacity = 1,
                                                  disabled = false
                                              }) => {
    const containerRef = useRef<HTMLDivElement>(null);

    // 容器基础样式
    const containerStyle: CSSProperties = {
        width: typeof size === 'number' ? `${size}px` : size,
        height: typeof size === 'number' ? `${size}px` : size,
        opacity,
        ...style
    };

    // 加号样式（支持自定义颜色）
    // const plusStyle = (isVertical: boolean): CSSProperties => ({
    //     width: isVertical ? '2.5px' : '30%',
    //     height: isVertical ? '30%' : '2.5px',
    //     background: tintColor
    // });

    // 空函数（禁用交互时使用）
    const handleEmpty = () => {
    };

    return (
        <div
            ref={containerRef}
            className={`glass-add-icon apple-style ${className}`}
            style={containerStyle}
            onClick={disabled ? handleEmpty : onClick}
            aria-disabled={disabled}
        >
            {/* 毛玻璃层 */}
            <div className="glass-layer"/>

            {/* 加号容器 */}
            <div className="plus-container">
                {/*<div className="plus-item horizontal" style={plusStyle(false)} />*/}
                {/*<div className="plus-item vertical" style={plusStyle(true)} />*/}
                <svg fill="none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                    <path
                        d="M11 4h2v7h7v2h-7v7h-2v-7H4v-2h7V4z"
                        fill="#F5F5F5"
                        transform="scale(1.5)"
                        transform-origin="center"
                    />
                </svg>
            </div>

            {/* 高光效果 */}
            <div className="highlight"/>

            {/* 底部阴影 */}
            <div className="bottom-shadow"/>
        </div>
    );
};

export default AddIcon;
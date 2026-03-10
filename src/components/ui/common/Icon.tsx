import React, {useState, useEffect, useRef} from 'react';
import './Icon.css';
import CloseIcon from './CloseIcon';

interface IconProps {
    src: string;
    alt: string;
    onRemove?: (event: React.MouseEvent) => void;
    size?: string | number;
    className?: string;
    isEditMode?: boolean;
    animationDuration?: number;
    opacityConfig?: [number | null, number | null]; // 修改为数组参数
}

const Icon: React.FC<IconProps> = ({
                                       src,
                                       alt,
                                       onRemove,
                                       size = '100%',
                                       className = '',
                                       isEditMode = true,
                                       animationDuration = 300,
                                       opacityConfig = [null, null] // 默认不使用
                                   }) => {
    const [isCloseVisible, setIsCloseVisible] = useState(isEditMode);
    const [shouldRenderClose, setShouldRenderClose] = useState(isEditMode);
    const [isHovered, setIsHovered] = useState(false);
    const closeTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const animationFrameRef = useRef<number | null>(null);

    const handleRemoveClick = (event: React.MouseEvent) => {
        event.stopPropagation();
        onRemove?.(event);
    };

    const handleMouseEnter = () => {
        setIsHovered(true);
    };

    const handleMouseLeave = () => {
        setIsHovered(false);
    };

    // 清理定时器和动画帧
    useEffect(() => {
        return () => {
            if (closeTimeoutRef.current) {
                clearTimeout(closeTimeoutRef.current);
            }
            if (animationFrameRef.current) {
                cancelAnimationFrame(animationFrameRef.current);
            }
        };
    }, []);

    // 使用 useLayoutEffect 来同步处理 DOM 更新
    useEffect(() => {
        if (isEditMode) {
            // 显示关闭按钮
            if (!shouldRenderClose) {
                setShouldRenderClose(true);
            }
            // 使用微任务确保 DOM 更新后再触发动画
            const timer = setTimeout(() => {
                setIsCloseVisible(true);
            }, 0);
            return () => clearTimeout(timer);
        } else {
            // 隐藏关闭按钮
            setIsCloseVisible(false);
            if (closeTimeoutRef.current) {
                clearTimeout(closeTimeoutRef.current);
            }
            closeTimeoutRef.current = setTimeout(() => {
                setShouldRenderClose(false);
            }, animationDuration);
        }
    }, [isEditMode, animationDuration, shouldRenderClose]);

    // 构建样式对象
    const containerStyle: React.CSSProperties = {
        width: size,
        height: size,
        userSelect: "none"
    };

    // 解构 opacityConfig
    const [normalOpacity, hoverOpacity] = opacityConfig;

    // 根据是否悬停和应用哪个透明度
    let currentOpacity: number | null = null;

    if (isHovered && hoverOpacity !== null) {
        // 悬停时使用 hoverOpacity
        currentOpacity = Math.max(0, Math.min(1, hoverOpacity));
    } else if (normalOpacity !== null) {
        // 非悬停时使用 normalOpacity
        currentOpacity = Math.max(0, Math.min(1, normalOpacity));
    }

    // 只有在有透明度值时才设置
    if (currentOpacity !== null) {
        containerStyle.opacity = currentOpacity;
    }

    // 检查是否需要鼠标事件
    const hasHoverEffect = hoverOpacity !== null;

    return (
        <div
            className={`icon ${className} ${isEditMode ? 'icon--closable' : ''}`}
            style={containerStyle}
            onMouseEnter={hasHoverEffect ? handleMouseEnter : undefined}
            onMouseLeave={hasHoverEffect ? handleMouseLeave : undefined}
        >
            <img
                src={src}
                alt={alt}
                className="icon__image"
            />
            {shouldRenderClose && (
                <button
                    className={`icon__close ${
                        isCloseVisible ? 'icon__close--visible' : 'icon__close--hidden'
                    }`}
                    onClick={handleRemoveClick}
                    style={{
                        transitionDuration: `${animationDuration}ms`,
                        animationDuration: `${animationDuration}ms`
                    }}
                >
                    <CloseIcon/>
                </button>
            )}
        </div>
    );
};

export default Icon;
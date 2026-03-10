import "./App.css";
import {useEffect, useState} from 'react';

import Background from '@/components/ui/common/Background';
// import SettingsPopover from "@/components/ui/common/SettingsPopover.tsx";
import TimeDisplay from "@/components/ui/common/TimeDisplay.tsx";
import SearchInput from '@/components/ui/common/SearchInput';
import QuoteText from '@/components/ui/common/QuoteText';
import AppDock from '@/components/ui/common/AppDock';

/*
用到的素材网站:
APP ICON: https://jiejingku.net/icon/
像素字体: https://github.com/TakWolf/ark-pixel-font
壁纸: https://www.bizhihui.com/p/22152.html
动态壁纸: https://motionbgs.com/mario-pixel-room
像素风图标: https://pixelarticons.com/
*/

function App() {
    const [seconds, setSeconds] = useState(0);
    const [minutes, setMinute] = useState(0);
    const [hours, setHours] = useState(0);
    const [quoteText, setQuoteText] = useState([""]);
    const [textAlignment, setTextAlignment] = useState<'left' | 'center' | 'right' | 'justify' | 'start' | 'end' | 'inherit'>('right');

    // 获取名言的函数
    const fetchQuote = async () => {
        try {
            let sentence: string;
            let source: string;
            const rand = Math.random()
            if (rand > 0.9) {
                // 一言接口
                const response = await fetch('https://v1.hitokoto.cn/');
                const data = await response.json();
                sentence = `『${data.hitokoto}』`;
                source = `  —— ${data.from_who || ''}${`《` + data.from + `》 ` || ''}`;
            } else if (rand > 0.6) {
                const response = await fetch('https://v1.jinrishici.com/all.json');
                const data = await response.json();
                sentence = `『${data.content}』`;
                source = `  —— ${data.author || ''}${`《` + data.origin + `》 ` || ''}`;
            } else if (rand > 0.2) {
                const response = await fetch('https://api.xygeng.cn/one');
                const data = await response.json();
                sentence = `『${data['data'].content}』`;
                source = `  —— ${data['data'].name || ''}${`《` + (data?.['data']?.origin || '').replace(/[《》]/g, '') + `》 ` || ''}`;
            } else {
                const response = await fetch('https://uapis.cn/api/v1/saying');
                const data = await response.json();
                sentence = `『${data.text}』`;
                source = ``;
            }

            if (sentence.length > source.length - 2) {
                setTextAlignment('right');
            } else {
                setTextAlignment('left');
            }
            setQuoteText([`${sentence} \n${source}`]);
        } catch (error) {
            console.error('获取一言失败:', error);
            // 失败时使用默认文本
            setQuoteText(["『接口暂时罢工，但你依旧闪闪发光！』 \n—— 快乐发电站"]);
        }
    };

    useEffect(() => {
        const updateTime = () => {
            const now = new Date();
            setSeconds(now.getSeconds());
            setMinute(now.getMinutes());
            setHours(now.getHours());
        };

        // 立即更新一次
        updateTime();

        // 计算到下一秒开始的时间
        const now = new Date();
        const delay = 1000 - now.getMilliseconds();

        const timeout = setTimeout(() => {
            updateTime();
            // 之后每秒执行
            const interval = setInterval(updateTime, 1000);
            return () => clearInterval(interval);
        }, delay);

        return () => clearTimeout(timeout);
    }, []);

    // 组件挂载时获取名言
    useEffect(() => {
        fetchQuote();
    }, []);

    function useResponsiveFontSize(baseSize = 80, scaleFactor = 0.08) {
        const [fontSize, setFontSize] = useState(baseSize);

        useEffect(() => {
            const updateFontSize = () => {
                setFontSize(Math.min(baseSize, window.innerWidth * scaleFactor));
            };

            updateFontSize();
            window.addEventListener('resize', updateFontSize);
            return () => window.removeEventListener('resize', updateFontSize);
        }, [baseSize, scaleFactor]);

        return fontSize;
    }

    const clock_fontSize = useResponsiveFontSize(120, 0.08);
    const clock_split_fontSize = useResponsiveFontSize(60, 0.08);
    const clock_div_fontSize = useResponsiveFontSize(160, 0.01);
    const search_input_fontSize = Math.min(60, useResponsiveFontSize(160, 0.08));
    const text_type_fontSize = useResponsiveFontSize(20, 0.015);


    return (
        <div className="app-container">
            {/* TODO 背景: 支持壁纸和视频(10MB以下) */}
            <Background videoSrc="bg.mp4"/>

            {/* TODO 设置项完善 */}
            {/* <SettingsPopover/> */}

            {/* 时间显示 */}
            <TimeDisplay hours={hours} minutes={minutes} seconds={seconds} clockFontSize={clock_fontSize}
                         clockSplitFontSize={clock_split_fontSize} clockDivFontSize={clock_div_fontSize}/>

            {/* 搜索框 */}
            <SearchInput searchInputFontSize={search_input_fontSize}/>

            {/* 每日一句 */}
            <QuoteText text={quoteText} fontSize={text_type_fontSize} textAlign={textAlignment}/>

            {/* Dock 栏 */}
            <AppDock/>

        </div>
    );
}

export default App;
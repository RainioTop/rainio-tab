import "./App.css";
import {useEffect, useState, useCallback} from 'react';

import Background from '@/components/ui/common/Background';
import SettingsModal from "@/components/ui/common/SettingsModal.tsx";
import TimeDisplay from "@/components/ui/common/TimeDisplay.tsx";
import SearchInput from '@/components/ui/common/SearchInput';
import QuoteText from '@/components/ui/common/QuoteText';
import AppDock from '@/components/ui/common/AppDock';
import { settingsRepository } from '@/db';
import { DEFAULT_UI_APPEARANCE_CONFIG, type UIAppearanceConfigType } from '@/types/UIAppearanceConfig';

const SEARCH_URLS: Record<string, string> = {
    baidu: 'https://www.baidu.com/s?wd=',
    google: 'https://www.google.com/search?q=',
    bing: 'https://www.bing.com/search?q=',
    sogou: 'https://www.sogou.com/web?query=',
    custom: '',
};

function App() {
    const [seconds, setSeconds] = useState(0);
    const [minutes, setMinute] = useState(0);
    const [hours, setHours] = useState(0);
    const [quoteText, setQuoteText] = useState([""]);
    const [textAlignment, setTextAlignment] = useState<'left' | 'center' | 'right' | 'justify' | 'start' | 'end' | 'inherit'>('right');
    const [uiConfig, setUiConfig] = useState<UIAppearanceConfigType | null>(null);

    const handleConfigChange = useCallback((config: UIAppearanceConfigType) => {
        setUiConfig(config);
    }, []);

    useEffect(() => {
        settingsRepository.get().then(saved => {
            if (saved) {
                setUiConfig(saved);
            } else {
                const defaults: UIAppearanceConfigType = {
                    id: 'ui_appearance_global',
                    ...DEFAULT_UI_APPEARANCE_CONFIG,
                    createdAt: Date.now(),
                };
                setUiConfig(defaults);
                settingsRepository.save(DEFAULT_UI_APPEARANCE_CONFIG);
            }
        });
    }, []);

    const fetchQuote = async () => {
        try {
            let sentence: string;
            let source: string;
            const rand = Math.random()
            if (rand > 0.9) {
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

        const now = new Date();
        const delay = 1000 - now.getMilliseconds();

        const timeout = setTimeout(() => {
            updateTime();
            const interval = setInterval(updateTime, 1000);
            return () => clearInterval(interval);
        }, delay);

        return () => clearTimeout(timeout);
    }, []);

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

    const component = uiConfig?.component;
    const wallpaper = uiConfig?.wallpaper;
    const browser = uiConfig?.browser;
    const font = uiConfig?.font;

    const showWallpaper = wallpaper?.type === 'url' && wallpaper.url;
    const wallpaperType = showWallpaper ? 'url' as const : undefined;
    const wallpaperValue = showWallpaper ? wallpaper.url : undefined;
    const searchUrl = SEARCH_URLS[browser?.searchEngine ?? 'bing'] || SEARCH_URLS.bing;
    const newTab = browser?.tabOpenType === 'new';

    return (
        <div className="app-container" style={{
            fontFamily: font?.family !== 'system' ? font?.family : undefined,
            fontSize: font?.size ? `${font.size}px` : undefined,
        }}>
            <Background
                videoSrc="bg.mp4"
                wallpaperType={wallpaperType}
                wallpaperValue={wallpaperValue}
                isFullScreen={wallpaper?.isFullScreen}
            />

            <SettingsModal onConfigChange={handleConfigChange}/>

            {component?.clock !== false && (
                <TimeDisplay hours={hours} minutes={minutes} seconds={seconds} clockFontSize={clock_fontSize}
                             clockSplitFontSize={clock_split_fontSize} clockDivFontSize={clock_div_fontSize}/>
            )}

            {component?.searchBar !== false && (
                <SearchInput searchInputFontSize={search_input_fontSize} searchEngine={searchUrl}/>
            )}

            {component?.yiyan !== false && (
                <QuoteText text={quoteText} fontSize={text_type_fontSize} textAlign={textAlignment}/>
            )}

            <AppDock openInNewTab={newTab}/>
        </div>
    );
}

export default App;

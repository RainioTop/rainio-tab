import React, {useState} from 'react';
import {InputGroup, InputGroupButton, InputGroupInput} from "@/components/ui/shadcn/input-group.tsx";
import searchSvg from '@/assets/search.svg';
import './SearchInput.css';

interface SearchInputProps {
    searchInputFontSize: number;
    placeholder?: string;
    searchEngine?: string; // 支持自定义搜索引擎，默认必应
}

const SearchInput: React.FC<SearchInputProps> = ({
                                                     searchInputFontSize,
                                                     placeholder = "搜索 Bing...",
                                                     searchEngine = "https://www.bing.com/search?q="
                                                 }) => {
    const [keyword, setKeyword] = useState('');

    // 搜索逻辑
    const search = () => {
        if (keyword.trim()) {
            window.location.href = `${searchEngine}${encodeURIComponent(keyword)}`;
        }
    };

    // 回车触发搜索
    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') search();
    };

    return (
        <InputGroup className="input-group" style={{height: searchInputFontSize}}>
            <InputGroupInput
                className="input-group-input"
                placeholder={placeholder}
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                onKeyDown={handleKeyDown}
                style={{userSelect: "none"}}
            />
            <InputGroupButton className="input-group-button" onClick={search}>
                <img src={searchSvg} className="input-group-button-icon" alt="搜索"/>
            </InputGroupButton>
        </InputGroup>
    );
};

export default SearchInput;
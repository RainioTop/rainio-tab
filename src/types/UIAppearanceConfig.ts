// ===================== 1. 通用类型 =====================
export type FontFamilyEnum = 'system' | 'microsoft yahei' | 'simsun' | 'arial' | 'custom';
export const FontFamily = {
    SYSTEM: 'system' as FontFamilyEnum,
    MICROSOFT_YAHEI: 'microsoft yahei' as FontFamilyEnum,
    SIMSUN: 'simsun' as FontFamilyEnum,
    ARIAL: 'arial' as FontFamilyEnum,
    CUSTOM: 'custom' as FontFamilyEnum
} as const;

export type WallpaperTypeEnum = 'blob' | 'color' | 'url';
export const WallpaperType = {
    BLOB: 'blob' as WallpaperTypeEnum,
    COLOR: 'color' as WallpaperTypeEnum,
    URL: 'url' as WallpaperTypeEnum
} as const;

export type SearchEngineEnum = 'baidu' | 'google' | 'bing' | 'sogou' | 'custom';
export const SearchEngine = {
    BAIDU: 'baidu' as SearchEngineEnum,
    GOOGLE: 'google' as SearchEngineEnum,
    BING: 'bing' as SearchEngineEnum,
    SOGOU: 'sogou' as SearchEngineEnum,
    CUSTOM: 'custom' as SearchEngineEnum
} as const;

export type TabOpenTypeEnum = 'current' | 'new';
export const TabOpenType = {
    CURRENT_TAB: 'current' as TabOpenTypeEnum,
    NEW_TAB: 'new' as TabOpenTypeEnum
} as const;

export interface WallpaperBlobMeta {
    name: string;
    type: string;
    size: number;
    lastModified: number;
}

// ===================== 2. 核心配置类型（可序列化版本，不含 Blob） =====================
export interface UIAppearanceConfigType {
    id: string;
    font: {
        family: FontFamilyEnum;
        customFamily?: string;
        size: number;
        weight: 'normal' | 'bold' | 'lighter' | number;
    };
    wallpaper: {
        type: WallpaperTypeEnum;
        blobDataUrl?: string; // Base64 用于序列化（替代 Blob）
        blobMeta?: WallpaperBlobMeta;
        color?: string;
        url?: string;
        isFullScreen: boolean;
        opacity: number;
    };
    component: {
        clock: boolean;
        yiyan: boolean;
        searchBar: boolean;
        quickNav: boolean;
    };
    browser: {
        searchEngine: SearchEngineEnum;
        customSearchEngineUrl?: string;
        tabOpenType: TabOpenTypeEnum;
        isNewTabDefault: boolean;
    };
    createdAt: number;
    updatedAt?: number;
}

// ===================== 3. 默认配置 =====================
export const DEFAULT_UI_APPEARANCE_CONFIG: Omit<UIAppearanceConfigType, 'id' | 'createdAt'> = {
    font: {
        family: FontFamily.SYSTEM,
        size: 14,
        weight: 'normal'
    },
    wallpaper: {
        type: WallpaperType.COLOR,
        color: '#f5f5f5',
        isFullScreen: true,
        opacity: 1
    },
    component: {
        clock: true,
        yiyan: true,
        searchBar: true,
        quickNav: true
    },
    browser: {
        searchEngine: SearchEngine.BAIDU,
        tabOpenType: TabOpenType.NEW_TAB,
        isNewTabDefault: true
    }
};

// ===================== 4. 全量导出数据结构 =====================
// Export wallpaper only includes fields with UI controls
export interface ExportWallpaper {
    url?: string;
    isFullScreen: boolean;
}

export interface FullExportData {
    version: '1.0';
    exportedAt: number;
    uiAppearance: {
        id: string;
        font: UIAppearanceConfigType['font'];
        wallpaper: ExportWallpaper;
        component: UIAppearanceConfigType['component'];
        browser: UIAppearanceConfigType['browser'];
    };
    dockItems: Array<{
        id: string;
        iconDataUrl?: string; // base64
        iconName?: string;
        sort?: number;
        link?: string;
        isEnabled?: boolean;
        // base config fields
        iconSrc?: string;
        iconAlt?: string;
        label?: string;
        url?: string;
    }>;
}

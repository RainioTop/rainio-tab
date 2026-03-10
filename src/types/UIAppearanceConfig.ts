import type {RxDocument, RxCollection, RxDatabase} from 'rxdb';

// ===================== 1. 通用类型+常量定义（替代 enum，兼容 isolatedModules） =====================
/** 字体类型 - 类型约束 */
export type FontFamilyEnum = 'system' | 'microsoft yahei' | 'simsun' | 'arial' | 'custom';
/** 字体类型 - 常量引用（等价于 enum 的便捷取值） */
export const FontFamily = {
    SYSTEM: 'system' as FontFamilyEnum,
    MICROSOFT_YAHEI: 'microsoft yahei' as FontFamilyEnum,
    SIMSUN: 'simsun' as FontFamilyEnum,
    ARIAL: 'arial' as FontFamilyEnum,
    CUSTOM: 'custom' as FontFamilyEnum
} as const;

/** 壁纸类型 - 类型约束 */
export type WallpaperTypeEnum = 'blob' | 'color' | 'url';
/** 壁纸类型 - 常量引用 */
export const WallpaperType = {
    BLOB: 'blob' as WallpaperTypeEnum,
    COLOR: 'color' as WallpaperTypeEnum,
    URL: 'url' as WallpaperTypeEnum
} as const;

/** 搜索引擎类型 - 类型约束 */
export type SearchEngineEnum = 'baidu' | 'google' | 'bing' | 'sogou' | 'custom';
/** 搜索引擎类型 - 常量引用 */
export const SearchEngine = {
    BAIDU: 'baidu' as SearchEngineEnum,
    GOOGLE: 'google' as SearchEngineEnum,
    BING: 'bing' as SearchEngineEnum,
    SOGOU: 'sogou' as SearchEngineEnum,
    CUSTOM: 'custom' as SearchEngineEnum
} as const;

/** 标签页打开方式 - 类型约束 */
export type TabOpenTypeEnum = 'current' | 'new';
/** 标签页打开方式 - 常量引用 */
export const TabOpenType = {
    CURRENT_TAB: 'current' as TabOpenTypeEnum,
    NEW_TAB: 'new' as TabOpenTypeEnum
} as const;

// ===================== 2. 通用类型（壁纸 Blob 元信息） =====================
/** 壁纸 Blob 元信息（存储 Blob 相关属性） */
export interface WallpaperBlobMeta {
    name: string; // 文件名（如 "wallpaper.jpg"）
    type: string; // MIME 类型（如 "image/jpeg"）
    size: number; // 大小（字节）
    lastModified: number; // 最后修改时间戳
}

// ===================== 3. 核心配置类型 =====================
/** UI 外观核心配置（单例，全局唯一） */
export interface UIAppearanceConfigType {
    id: string; // 固定值 "ui_appearance_global"（单例标识）
    // ---------- 基础外观配置 ----------
    font: {
        family: FontFamilyEnum; // 字体类型
        customFamily?: string; // 自定义字体（仅 family = CUSTOM 时生效）
        size: number; // 字体大小（px），默认 14
        weight: 'normal' | 'bold' | 'lighter' | number; // 字重，默认 normal
    };
    wallpaper: {
        type: WallpaperTypeEnum; // 壁纸类型
        blob?: Blob; // 壁纸 Blob（仅 type = BLOB 时生效）
        blobMeta?: WallpaperBlobMeta; // 壁纸 Blob 元信息（仅 type = BLOB 时生效）
        color?: string; // 纯色背景值（仅 type = COLOR 时生效，如 #ffffff）
        url?: string; // 远程 URL（仅 type = URL 时生效）
        isFullScreen: boolean; // 是否全屏显示，默认 true
        opacity: number; // 透明度（0-1），默认 1
    };
    // ---------- 组件显隐配置 ----------
    component: {
        clock: boolean; // 是否显示时钟，默认 true
        yiyan: boolean; // 是否显示一言组件，默认 true
        searchBar: boolean; // 是否显示搜索栏，默认 true
        quickNav: boolean; // 是否显示快捷导航，默认 true
    };
    // ---------- 浏览器行为配置 ----------
    browser: {
        searchEngine: SearchEngineEnum; // 默认搜索引擎
        customSearchEngineUrl?: string; // 自定义搜索引擎 URL（仅 searchEngine = CUSTOM 时生效）
        tabOpenType: TabOpenTypeEnum; // 链接打开方式，默认 NEW_TAB
        isNewTabDefault: boolean; // 是否默认打开新标签页，默认 true
    };
    // ---------- 通用字段 ----------
    createdAt: number; // 创建时间戳
    updatedAt?: number; // 更新时间戳
}

// ===================== 4. 文档方法（单例配置的实例方法） =====================
export type UIAppearanceDocMethods = {
    // 获取配置摘要（用于调试/日志）
    getConfigSummary: () => string;
    // 更新壁纸（支持 Blob/纯色/URL 三种类型）
    updateWallpaper: (
        type: WallpaperTypeEnum,
        payload: {
            blob?: Blob;
            blobMeta?: WallpaperBlobMeta;
            color?: string;
            url?: string;
        }
    ) => Promise<UIAppearanceDocument>;
    // 切换组件显隐状态（如切换时钟/一言）
    toggleComponent: (componentKey: 'clock' | 'yiyan' | 'searchBar' | 'quickNav') => Promise<UIAppearanceDocument>;
    // 重置配置为默认值
    resetToDefault: () => Promise<UIAppearanceDocument>;
};

// ===================== 5. 集合方法（全局配置的静态方法） =====================
export type UIAppearanceCollectionMethods = {
    // 获取全局唯一的配置（单例），无则创建默认配置
    getGlobalConfig: () => Promise<UIAppearanceDocument>;
    // 备份配置（返回可序列化的对象，不含 Blob）
    backupConfig: () => Promise<Omit<UIAppearanceConfigType, 'wallpaper.blob'>>;
    // 恢复配置（支持导入备份）
    restoreConfig: (backupData: Omit<UIAppearanceConfigType, 'wallpaper.blob'>) => Promise<UIAppearanceDocument>;
};

// ===================== 6. RxDB 核心类型封装 =====================
/** 单个 UI 外观配置文档（单例） */
export type UIAppearanceDocument = RxDocument<UIAppearanceConfigType, UIAppearanceDocMethods>;

/** UI 外观配置集合（仅存储一条单例数据） */
export type UIAppearanceCollection = RxCollection<
    UIAppearanceConfigType,
    UIAppearanceDocMethods,
    UIAppearanceCollectionMethods
>;

/** 数据库集合映射 */
export interface UIAppearanceDatabaseCollections {
    ui_appearance: UIAppearanceCollection;
}

/** 最终的 UI 外观数据库类型 */
export type UIAppearanceDatabase = RxDatabase<UIAppearanceDatabaseCollections>;

// ===================== 7. 辅助类型/常量（简化业务层使用） =====================
/** 默认配置（业务层初始化用） */
export const DEFAULT_UI_APPEARANCE_CONFIG: Omit<UIAppearanceConfigType, 'id' | 'createdAt'> = {
    font: {
        family: FontFamily.SYSTEM, // 改用常量对象取值
        size: 14,
        weight: 'normal'
    },
    wallpaper: {
        type: WallpaperType.COLOR, // 改用常量对象取值
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
        searchEngine: SearchEngine.BAIDU, // 改用常量对象取值
        tabOpenType: TabOpenType.NEW_TAB, // 改用常量对象取值
        isNewTabDefault: true
    }
};
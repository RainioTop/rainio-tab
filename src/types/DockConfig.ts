import type {RxDocument, RxCollection} from 'rxdb';

// ===================== 1. 补充 Blob 元信息类型（通用） =====================
/**
 * Dock 图标 Blob 元信息（记录 Blob 的格式、大小、名称等）
 */
export interface IconBlobMeta {
    name: string; // 图标文件名（如 "home.png"）
    type: string; // MIME 类型（如 "image/png"、"image/jpeg"）
    size: number; // Blob 大小（字节）
    lastModified: number; // 文件最后修改时间戳
}

// ===================== 2. 核心类型：Dock 栏单个图标项（含 Blob） =====================
export interface DockItemType {
    id: string; // 唯一标识（必选）
    iconBlob: Blob; // 图标 Blob 数据（核心修改：存储二进制数据）
    iconMeta: IconBlobMeta; // 图标元信息（必须，用于解析 Blob）
    iconName: string; // 图标显示名称（如 "首页"、"设置"）
    sort: number; // 排序优先级（数字越小越靠前）
    link?: string; // 跳转链接（可选）
    isEnabled: boolean; // 是否启用该图标（默认 true）
    createdAt: number; // 创建时间戳（改用数字更易处理）
    updatedAt?: number; // 更新时间戳（可选）
}

// ===================== 3. 文档方法：单个 Dock 项（含 Blob 操作） =====================
export type DockDocMethods = {
    // 获取 Dock 项完整信息（含 Blob 元信息）
    getFullInfo: () => string;
    // 更新排序
    updateSort: (newSort: number) => Promise<DockDocument>;
    // 切换启用/禁用状态
    toggleEnabled: () => Promise<DockDocument>;
    // 新增：将 Blob 转换为 Base64 URL（用于前端展示）
    getIconBase64Url: () => Promise<string>;
    // 新增：更新图标 Blob（替换图标）
    updateIconBlob: (newBlob: Blob, newMeta: IconBlobMeta) => Promise<DockDocument>;
};

// ===================== 4. 集合方法：Dock 栏整体操作（含 Blob 筛选） =====================
export type DockCollectionMethods = {
    // 统计启用的 Dock 图标数量
    countEnabled: () => Promise<number>;
    // 按排序升序获取所有 Dock 项
    findAllSorted: () => Promise<DockDocument[]>;
    // 根据图标名称模糊搜索
    searchByName: (keyword: string) => Promise<DockDocument[]>;
    // 新增：筛选指定格式的图标（如仅显示 png 格式）
    findByMimeType: (mimeType: string) => Promise<DockDocument[]>;
    // 新增：统计所有图标 Blob 总大小（字节）
    getTotalIconSize: () => Promise<number>;
};

// ===================== 5. RxDB 核心类型封装 =====================
// 单个 Dock 文档（包含 Blob 类型）
export type DockDocument = RxDocument<DockItemType, DockDocMethods>;

// Dock 集合
export type DockCollection = RxCollection<
    DockItemType,
    DockDocMethods,
    DockCollectionMethods
>;

// 数据库集合映射（集合名 = dock）
// export interface DockDatabaseCollections {
//     dock: DockCollection;
// }

// 最终的 Dock 数据库类型
// export type DockDatabase = RxDatabase<DockDatabaseCollections>;
//
// // ===================== 6. 可选：Dock 全局配置类型 =====================
// export interface DockGlobalConfigType {
//     id: string; // 固定为 "dock_global_config"（单例）
//     position: 'top' | 'bottom' | 'left' | 'right';
//     isShow: boolean;
//     size: 'small' | 'medium' | 'large';
//     bgColor?: string;
// }
import type {
    DockDocument,
    DockCollection,
    IconBlobMeta
} from '@/types/DockConfig';

/**
 * Dock 文档实例方法（单个图标项的操作）
 */
export const dockDocMethods = {
    // 获取 Dock 项完整信息（含 Blob 元信息）
    getFullInfo: function (this: DockDocument) {
        const sizeKB = (this.iconMeta.size / 1024).toFixed(2);
        return `图标名称：${this.iconName}，格式：${this.iconMeta.type}，大小：${sizeKB}KB，排序：${this.sort}，状态：${this.isEnabled ? '启用' : '禁用'}`;
    },

    // 更新 Dock 项排序
    updateSort: async function (this: DockDocument, newSort: number) {
        this.sort = newSort;
        this.updatedAt = Date.now();
        return await this.save();
    },

    // 切换图标启用/禁用状态
    toggleEnabled: async function (this: DockDocument) {
        this.isEnabled = !this.isEnabled;
        this.updatedAt = Date.now();
        return await this.save();
    },

    // 将 Blob 转换为 Base64 URL（前端展示用）
    getIconBase64Url: async function (this: DockDocument) {
        return new Promise((resolve) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result as string);
            reader.readAsDataURL(this.iconBlob);
        });
    },

    // 更新图标 Blob（替换图标）
    updateIconBlob: async function (this: DockDocument, newBlob: Blob, newMeta: IconBlobMeta) {
        this.iconBlob = newBlob;
        this.iconMeta = newMeta;
        this.updatedAt = Date.now();
        return await this.save();
    },
};

/**
 * Dock 集合静态方法（整体 Dock 栏的操作）
 */
export const dockCollectionMethods = {
    // 统计启用的 Dock 图标数量
    countEnabled: async function (this: DockCollection) {
        const enabledItems = await this.find({
            selector: {isEnabled: true},
        }).exec();
        return enabledItems.length;
    },

    // 按排序号升序获取所有 Dock 项
    findAllSorted: async function (this: DockCollection) {
        return await this.find()
            .sort({sort: 'asc'})
            .exec();
    },

    // 根据图标名称模糊搜索
    searchByName: async function (this: DockCollection, keyword: string) {
        if (!keyword) return this.findAllSorted();

        return await this.find({
            selector: {
                iconName: {$regex: keyword, $options: 'i'}, // 不区分大小写
            },
        }).exec();
    },

    // 筛选指定格式的图标（如 image/png）
    findByMimeType: async function (this: DockCollection, mimeType: string) {
        return await this.find({
            selector: {'iconMeta.type': mimeType},
        }).exec();
    },

    // 统计所有图标 Blob 总大小（字节）
    getTotalIconSize: async function (this: DockCollection) {
        const allItems = await this.find().exec();
        return allItems.reduce((total, item) => total + item.iconMeta.size, 0);
    },

    // 批量更新排序（传入 { id: newSort } 映射）
    batchUpdateSort: async function (this: DockCollection, sortMap: Record<string, number>) {
        const ids = Object.keys(sortMap);
        const items = await this.find({selector: {id: {$in: ids}}}).exec();

        const updatePromises = items.map((item) => {
            item.sort = sortMap[item.id];
            item.updatedAt = Date.now();
            return item.save();
        });

        return await Promise.all(updatePromises);
    },
};
import Dexie, {type Table} from 'dexie';
import type {DockItemType} from '@/types/DockConfig';

// ========== 1. 定义 Dexie 数据库类 ==========
class AppDB extends Dexie {
    // 定义 Dock 表（主键 id，索引字段用于优化查询）
    dock!: Table<DockItemType, string>;

    constructor() {
        super('dock-config-db');

        // 数据库版本 & 表结构定义（无任何函数，纯字段声明）
        this.version(1).stores({
            dock: 'id, iconName, sort, isEnabled, createdAt' // id 为主键，其余为索引字段
        });

        // 数据库初始化完成回调
        this.on('populate', () => {
            console.log('数据库初始化完成');
        });
    }
}

// ========== 2. 创建数据库单例 ==========
export const db = new AppDB();

// ========== 3. 封装 Dock 表操作方法（替代 RxDB 的文档/集合方法） ==========
export const dockRepository = {
    // 初始化数据库（兼容原有 getDB 方法命名）
    getDB: () => db,

    // 按排序升序获取所有 Dock 项
    findAllSorted: async (): Promise<DockItemType[]> => {
        return db.dock.orderBy('sort').toArray();
    },

    // 根据图标名称模糊搜索
    searchByName: async (keyword: string): Promise<DockItemType[]> => {
        if (!keyword) return dockRepository.findAllSorted();
        return await db.dock
            .filter(item => item.iconName.toLowerCase().includes(keyword.toLowerCase()))
            // .orderBy('sort')
            .toArray();
    },

    // 按 ID 查询单个项
    findOne: async (id: string): Promise<DockItemType | undefined> => {
        return await db.dock.get(id);
    },

    // 插入新项
    insert: async (item: Omit<DockItemType, 'createdAt' | 'updatedAt'> & {
        createdAt?: number,
        updatedAt?: number
    }): Promise<DockItemType> => {
        const finalItem = {
            ...item,
            createdAt: item.createdAt || Date.now(),
            updatedAt: item.updatedAt || Date.now()
        };
        await db.dock.add(finalItem);
        return finalItem;
    },

    // 切换启用/禁用状态
    toggleEnabled: async (id: string): Promise<DockItemType | undefined> => {
        const item = await dockRepository.findOne(id);
        if (!item) return undefined;

        const updatedItem = {
            ...item,
            isEnabled: !item.isEnabled,
            updatedAt: Date.now()
        };
        await db.dock.update(id, updatedItem);
        return updatedItem;
    },

    // 更新排序值
    updateSort: async (id: string, newSort: number): Promise<DockItemType | undefined> => {
        const item = await dockRepository.findOne(id);
        if (!item) return undefined;

        const updatedItem = {
            ...item,
            sort: newSort,
            updatedAt: Date.now()
        };
        await db.dock.update(id, updatedItem);
        return updatedItem;
    },

    // 批量更新排序
    batchUpdateSort: async (sortMap: Record<string, number>): Promise<DockItemType[]> => {
        const ids = Object.keys(sortMap);
        const items = await db.dock.bulkGet(ids);
        const updatedItems: DockItemType[] = [];

        for (const item of items) {
            if (item) {
                const updatedItem = {
                    ...item,
                    sort: sortMap[item.id],
                    updatedAt: Date.now()
                };
                await db.dock.update(item.id, updatedItem);
                updatedItems.push(updatedItem);
            }
        }
        return updatedItems;
    },

    // 删除项
    remove: async (id: string): Promise<boolean> => {
        await db.dock.delete(id);
        return true;
    },

    // 统计启用的图标数量
    // countEnabled: async (): Promise<number> => {
    //     return await db.dock.where('isEnabled').equals(true).count();
    // }
};

// 兼容原有导出方式（无需修改业务层导入）
export const getDB = dockRepository.getDB;
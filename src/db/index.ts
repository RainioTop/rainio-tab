import Dexie, {type Table} from 'dexie';
import type {DockItemType} from '@/types/DockConfig';
import type {UIAppearanceConfigType} from '@/types/UIAppearanceConfig';

class AppDB extends Dexie {
    dock!: Table<DockItemType, string>;
    uiAppearance!: Table<UIAppearanceConfigType, string>;

    constructor() {
        super('dock-config-db');

        this.version(2).stores({
            dock: 'id, iconName, sort, isEnabled, createdAt',
            uiAppearance: 'id'
        });

        this.on('populate', () => {
            console.log('数据库初始化完成');
        });
    }
}

export const db = new AppDB();

// ========== Dock 表操作 ==========
export const dockRepository = {
    getDB: () => db,

    findAllSorted: async (): Promise<DockItemType[]> => {
        return db.dock.orderBy('sort').toArray();
    },

    searchByName: async (keyword: string): Promise<DockItemType[]> => {
        if (!keyword) return dockRepository.findAllSorted();
        return await db.dock
            .filter(item => item.iconName.toLowerCase().includes(keyword.toLowerCase()))
            .toArray();
    },

    findOne: async (id: string): Promise<DockItemType | undefined> => {
        return await db.dock.get(id);
    },

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

    remove: async (id: string): Promise<boolean> => {
        await db.dock.delete(id);
        return true;
    },

    // 获取所有 dock 数据（用于导出）
    findAll: async (): Promise<DockItemType[]> => {
        return db.dock.toArray();
    },

    // 清空表（用于导入覆盖）
    clearAll: async (): Promise<void> => {
        await db.dock.clear();
    }
};

// ========== UI Appearance 配置操作 ==========
const SETTINGS_ID = 'ui_appearance_global';

export const settingsRepository = {
    get: async (): Promise<UIAppearanceConfigType | undefined> => {
        return db.uiAppearance.get(SETTINGS_ID);
    },

    save: async (config: Omit<UIAppearanceConfigType, 'id' | 'createdAt' | 'updatedAt'>): Promise<UIAppearanceConfigType> => {
        const existing = await settingsRepository.get();
        const now = Date.now();
        const fullConfig: UIAppearanceConfigType = {
            id: SETTINGS_ID,
            ...config,
            createdAt: existing?.createdAt || now,
            updatedAt: now
        };
        if (existing) {
            await db.uiAppearance.put(fullConfig);
        } else {
            await db.uiAppearance.add(fullConfig);
        }
        return fullConfig;
    },

    clearAll: async (): Promise<void> => {
        await db.uiAppearance.clear();
    }
};

export const getDB = dockRepository.getDB;

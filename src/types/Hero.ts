import type {RxDocument, RxCollection, RxDatabase} from 'rxdb';

// 1. 定义英雄文档类型
export interface HeroDocType {
    id: string;
    name: string;
    power?: string;
    age?: number;
    createdAt: string;
}

// 2. 定义文档方法
export type HeroDocMethods = {
    // 获取英雄介绍
    introduce: () => string;
    // 增加年龄
    increaseAge: (years: number) => Promise<HeroDocument>;
};

// 3. 定义集合方法
export type HeroCollectionMethods = {
    // 统计所有英雄
    countAll: () => Promise<number>;
    // 按年龄段查找
    findByAge: (min: number, max?: number) => Promise<HeroDocument[]>;
};

// 4. 定义 RxDocument
export type HeroDocument = RxDocument<HeroDocType, HeroDocMethods>;

// 5. 定义 RxCollection
export type HeroCollection = RxCollection<HeroDocType, HeroDocMethods, HeroCollectionMethods>;

// 6. 定义数据库集合
export interface MyDatabaseCollections {
    heroes: HeroCollection;
}

// 7. 定义 RxDatabase
export type MyDatabase = RxDatabase<MyDatabaseCollections>;
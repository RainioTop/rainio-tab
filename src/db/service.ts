import {createRxDatabase} from 'rxdb';
import {getRxStorageDexie} from 'rxdb/plugins/storage-dexie';
import {heroSchema} from '../schemas/heroSchema.ts';
import type {
    HeroDocMethods,
    HeroCollectionMethods,
    MyDatabase,
    MyDatabaseCollections
} from '../types/Hero';
// 文档方法实现
const heroDocMethods: HeroDocMethods = {
    // 英雄自我介绍
    introduce: function (this: any) {
        let intro = `My name is ${this.name}`;
        if (this.age) {
            intro += `, I'm ${this.age} years old`;
        }
        if (this.power) {
            intro += `, and my power is ${this.power}`;
        }
        return intro + '.';
    },

    // 增加年龄
    increaseAge: async function (this: any, years: number) {
        const newAge = (this.age || 0) + years;
        this.age = newAge;
        return this.save();
    }
};

// 集合静态方法实现
const heroCollectionMethods: HeroCollectionMethods = {
    // 统计英雄数量
    countAll: async function (this: any) {
        const allHeroes = await this.find().exec();
        return allHeroes.length;
    },

    // 按年龄段查找
    findByAge: async function (this: any, min: number, max?: number) {
        const selector: any = {age: {$gte: min}};
        if (max !== undefined) {
            selector.age.$lte = max;
        }
        return this.find({selector}).exec();
    }
};

// 简单数据库类
export class SimpleDatabase {
    private static instance: SimpleDatabase;
    private db: MyDatabase | null = null;

    private constructor() {
    }

    // 单例模式
    static getInstance(): SimpleDatabase {
        if (!SimpleDatabase.instance) {
            SimpleDatabase.instance = new SimpleDatabase();
        }
        return SimpleDatabase.instance;
    }

    // 初始化数据库
    async init(): Promise<MyDatabase> {
        if (this.db) {
            return this.db;
        }

        try {
            // 创建数据库
            this.db = await createRxDatabase<MyDatabaseCollections>({
                name: 'simple-heroes-db',
                storage: getRxStorageDexie(), // 内存存储，最简单
                ignoreDuplicate: false
            });

            console.log('Database created successfully');

            // 添加集合
            await this.db.addCollections({
                heroes: {
                    schema: heroSchema,
                    methods: heroDocMethods,
                    statics: heroCollectionMethods
                }
            });

            console.log('Heroes collection added');
            return this.db;

        } catch (error) {
            console.error('Failed to initialize database:', error);
            throw error;
        }
    }

    // 获取数据库实例
    getDatabase(): MyDatabase {
        if (!this.db) {
            throw new Error('Database not initialized. Call init() first.');
        }
        return this.db;
    }

    // 关闭数据库
    async close(): Promise<void> {
        if (this.db) {
            await this.db.close();
            this.db = null;
            console.log('Database closed');
        }
    }
}
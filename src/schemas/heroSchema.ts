// 使用内存存储，最简单，无需额外依赖
import type {RxJsonSchema} from "rxdb";
import type {HeroDocType} from "@/types/Hero.ts";

// 英雄模式定义
export const heroSchema: RxJsonSchema<HeroDocType> = {
    title: 'hero schema',
    version: 0,
    primaryKey: 'id',
    type: 'object',
    properties: {
        id: {
            type: 'string',
            maxLength: 100
        },
        name: {
            type: 'string',
            maxLength: 100
        },
        power: {
            type: 'string',
            maxLength: 100
        },
        age: {
            type: 'number',
            minimum: 0,
            maximum: 1000
        },
        createdAt: {
            type: 'string',
            format: 'date-time'
        }
    },
    required: ['id', 'name'],
    indexes: ['name']
};
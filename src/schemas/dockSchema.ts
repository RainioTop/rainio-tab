import type { RxJsonSchema } from 'rxdb';
import type { DockItemType } from '@/types/DockConfig';

// 纯 JSON Schema（仅基础类型约束，无函数/复杂校验）
export const dockSchema: RxJsonSchema<DockItemType> = {
    title: 'dock item schema',
    description: 'Dock 栏图标配置',
    version: 0,
    primaryKey: 'id',
    type: 'object',
    properties: {
        id: {
            type: 'string',
            maxLength: 100
        },
        // Blob 类型仅声明为 object（Dexie 原生支持存储 Blob）
        iconBlob: {
            type: 'object'
        },
        iconMeta: {
            type: 'object',
            properties: {
                name: { type: 'string' },
                type: { type: 'string' },
                size: { type: 'number', minimum: 1 },
                lastModified: { type: 'number', minimum: 0 }
            },
            required: ['name', 'type', 'size', 'lastModified']
        },
        iconName: {
            type: 'string',
            minLength: 1,
            maxLength: 20
        },
        sort: {
            type: 'integer'
        },
        link: {
            type: 'string',
            format: 'uri'
        },
        isEnabled: {
            type: 'boolean'
        },
        createdAt: {
            type: 'integer'
        },
        updatedAt: {
            type: 'integer'
        }
    },
    // 必传字段（无默认值，业务层强制赋值）
    required: ['id', 'iconBlob', 'iconMeta', 'iconName', 'sort', 'isEnabled', 'createdAt']
};
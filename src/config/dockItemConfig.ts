// src/config/dockItemConfig.ts (独立配置文件，方便维护和扩展)
export type DockItemConfig = {
    id: string; // 唯一标识，用于持久化/增删改查
    iconSrc: string;
    iconAlt: string;
    label: string;
    url: string; // 抽离url，与点击逻辑解耦
    isEditModeFixed?: boolean; // 标记是否在编辑模式下固定显示（如文件夹）
};

// 基础静态配置（可扩展、可持久化）
export const BASE_DOCK_ITEMS: DockItemConfig[] = [
    // {
    //     id: 'photoshop',
    //     iconSrc: '/icons/dock/photoshop.png',
    //     iconAlt: 'Photoshop',
    //     label: 'Photoshop',
    //     url: 'https://ps.gaoding.com/',
    // },
    // {
    //     id: 'newsnow',
    //     iconSrc: '/icons/dock/newsnow.png',
    //     iconAlt: 'NewsNow',
    //     label: 'NewsNow',
    //     url: 'https://newsnow.busiyi.world/c/focus',
    // },
    // {
    //     id: 'bilibili',
    //     iconSrc: '/icons/dock/bilibili.png',
    //     iconAlt: '哔哩哔哩',
    //     label: '哔哩哔哩',
    //     url: 'https://www.bilibili.com/',
    // },
    // {
    //     id: 'copilot',
    //     iconSrc: '/icons/dock/copilot.png',
    //     iconAlt: 'Copilot',
    //     label: 'Copilot',
    //     url: 'https://copilot.microsoft.com/',
    // },
    // {
    //     id: 'excalidraw',
    //     iconSrc: '/icons/dock/excalidraw.png',
    //     iconAlt: 'Excalidraw',
    //     label: 'Excalidraw',
    //     url: 'https://excalidraw.com/',
    // },
    // {
    //     id: '5caec427-3f6e-40c3-ae0e-6242eafc0fa5',
    //     iconSrc: '/icons/dock/floder.png',
    //     iconAlt: '文件夹',
    //     label: '文件夹',
    //     url: '', // 无跳转
    //     isEditModeFixed: true, // 编辑模式下也不隐藏
    // },
];

// 新增按钮的配置（单独抽离，方便控制）
export const ADD_ITEM_CONFIG = {
    id: 'add-icon',
    iconSrc: '', // 特殊标记，用于渲染AddIcon
    iconAlt: '新增图标',
    label: '新增图标',
    url: '',
};
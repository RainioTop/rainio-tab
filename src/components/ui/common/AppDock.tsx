import React, {useState, useMemo, useEffect} from 'react';
import {Switch} from "@/components/ui/shadcn/switch";
import Dock from '@/components/ui/reactbits/Dock';
import Icon from '@/components/ui/common/Icon';
import AddIcon from "@/components/ui/common/AddIcon";
import {AddIconForm} from "@/components/ui/common/AddIconCard";
import {type DockItemConfig, BASE_DOCK_ITEMS, ADD_ITEM_CONFIG} from '@/config/dockItemConfig.ts';
import './AppDock.css';
import {dockRepository} from "@/db";
import CloseIcon from './CloseIcon';
import {toast} from "sonner";

const AppDock: React.FC = () => {
    const [isChecked, setIsChecked] = useState(false);
    // 维护动态Dock数据（支持增删改查、持久化）
    const [dockItems, setDockItems] = useState<DockItemConfig[]>([]);
    // 控制表单显示隐藏
    const [showAddIconForm, setShowAddIconForm] = useState(false);

    const deleteDockItem = async (itemId: string, itemName: string) => {
        let deletedItem: DockItemConfig | undefined;
        setDockItems(prevItems => {
            const deleteIndex = prevItems.findIndex(item => item.id === itemId);
            if (deleteIndex !== -1) {
                deletedItem = prevItems[deleteIndex];
            }
            const newItems = [...prevItems];
            if (deleteIndex !== -1) {
                newItems.splice(deleteIndex, 1);
            }
            return newItems;
        });
        await dockRepository.remove(itemId);
        toast.success(`图标 "${itemName}" 删除成功！`);
        return deletedItem;
    };

    // 工具函数：将配置转换为渲染用的Item（仅在配置变更时执行）
    const convertConfigToItems = (
        configs: DockItemConfig[],
        isEditMode: boolean
    ) => {
        // 基础Item转换
        const baseItems = configs.map(config => ({
            icon: (
                <Icon
                    src={config.iconSrc}
                    alt={config.iconAlt}
                    size="100%"
                    isEditMode={config.id === '5caec427-3f6e-40c3-ae0e-6242eafc0fa5' ? false : isEditMode}
                    onRemove={() => {
                        deleteDockItem(config.id, config.label)
                    }}
                />
            ),
            label: config.label,
            onClick: () => {
                if (config.url) window.location.href = config.url;
            },
        }));

        // 编辑模式下追加新增按钮
        if (isEditMode) {
            baseItems.push({
                icon: <AddIcon size={35} onClick={() => setShowAddIconForm(true)}/>,
                label: ADD_ITEM_CONFIG.label,
                onClick: () => undefined,
            });
        }

        return baseItems;
    };

    // 缓存渲染用的Items：仅在dockItems或isEditMode变更时重新生成
    const renderItems = useMemo(() => {
        return convertConfigToItems(dockItems, isChecked);
    }, [dockItems, isChecked]);

    // 初始化：从数据库加载并合并到基础配置
    useEffect(() => {
        const initDockData = async () => {
            try {
                // 从数据库加载图标
                const initialDockItems = JSON.parse(JSON.stringify(BASE_DOCK_ITEMS)) as DockItemConfig[];
                const dbItems = await dockRepository.findAllSorted();
                dbItems.sort((a, b) => {
                    if (a.sort !== b.sort) return a.sort - b.sort;
                    return a.createdAt - b.createdAt;
                });


                // 插入到新数组
                for (const item of dbItems) {
                    const insertIndex = initialDockItems.length >= 1 ? initialDockItems.length - 1 : 0;
                    // 插入到深拷贝后的数组，而非原始BASE_DOCK_ITEMS
                    initialDockItems.splice(insertIndex, 0, {
                        id: item.id,
                        iconSrc: URL.createObjectURL(item.iconBlob),
                        iconAlt: item.iconName,
                        label: item.iconName,
                        url: item.link ?? '#',
                    });
                }

                // 5. 更新状态（传递全新数组，触发重渲染）
                setDockItems(initialDockItems);
            } catch (e) {
                console.error('加载Dock配置失败，使用默认配置', e);
                // 异常时使用基础配置兜底
                setDockItems(JSON.parse(JSON.stringify(BASE_DOCK_ITEMS)));
            }
        };

        initDockData();
    }, []);

    const addDockItem = (newItem: Omit<DockItemConfig, never>) => {
        const newDockItem: DockItemConfig = {...newItem};
        setDockItems(prevItems => {
            const insertIndex = prevItems.length >= 1 ? prevItems.length - 1 : 0;
            const newItems = [...prevItems];
            newItems.splice(insertIndex, 0, newDockItem);
            return newItems;
        });
        return newDockItem;
    };

    return (
        <>
            {/* 保留逻辑，但给容器添加动画相关类名 */}
            <div className={`add-icon-form-modal ${showAddIconForm ? 'add-icon-form-modal--show' : ''}`}>
                <button className="icon__close icon__close--visible" onClick={() => setShowAddIconForm(false)}>
                    <CloseIcon/>
                </button>
                <AddIconForm onAddIcon={addDockItem} onClose={() => setShowAddIconForm(false)}/>
            </div>

            <div className="dock-container" style={{visibility: renderItems.length > 0 ? 'visible' : 'hidden',}}>
                <Dock items={renderItems} panelHeight={75} baseItemSize={55} magnification={75}/>
            </div>

            {/* 编辑模式开关 */}
            <label className={`edit-mode-label ${isChecked ? 'is-checked' : 'is-unchecked'}`}>
                <label
                    className="flex items-center gap-2"
                    style={{cursor: "pointer"}}
                    htmlFor="edit-mode"
                >
                    <Switch
                        className="edit-mode-switch"
                        id="edit-mode"
                        checked={isChecked}
                        onCheckedChange={(checked) => {
                            setIsChecked(checked);
                            if (!checked) { // 只有当编辑模式从开启→关闭时，才关闭表单
                                setShowAddIconForm(false);
                            }
                        }}
                    />
                    编辑模式
                </label>
            </label>
        </>
    );

};

export default AppDock;
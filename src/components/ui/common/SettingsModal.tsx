import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/shadcn/popover.tsx";
import { Input } from "@/components/ui/shadcn/input.tsx";
import { Label } from "@/components/ui/shadcn/label.tsx";
import { Switch } from "@/components/ui/shadcn/switch";
import { Button } from "@/components/ui/shadcn/button.tsx";
import {
    DEFAULT_UI_APPEARANCE_CONFIG,
    FontFamily,
    SearchEngine,
    TabOpenType,
    WallpaperType,
    type UIAppearanceConfigType,
    type FullExportData,
} from '@/types/UIAppearanceConfig';
import { settingsRepository, dockRepository } from '@/db';
import { toast } from 'sonner';
import './SettingsModal.css';

type TabKey = 'appearance' | 'components' | 'browser' | 'data';

const TABS: { key: TabKey; label: string }[] = [
    { key: 'appearance', label: '外观' },
    { key: 'components', label: '显示组件' },
    { key: 'browser', label: '浏览器行为' },
    { key: 'data', label: '数据管理' },
];

const SettingsModal: React.FC<{
    onConfigChange?: (config: UIAppearanceConfigType) => void;
}> = ({ onConfigChange }) => {
    const [config, setConfig] = useState<UIAppearanceConfigType | null>(null);
    const [open, setOpen] = useState(false);
    const [activeTab, setActiveTab] = useState<TabKey>('appearance');
    const fileInputRef = useRef<HTMLInputElement>(null);

    const loadConfig = useCallback(async () => {
        const saved = await settingsRepository.get();
        if (saved) {
            setConfig(saved);
        } else {
            const defaults: UIAppearanceConfigType = {
                id: 'ui_appearance_global',
                ...DEFAULT_UI_APPEARANCE_CONFIG,
                createdAt: Date.now(),
            };
            setConfig(defaults);
            await settingsRepository.save(DEFAULT_UI_APPEARANCE_CONFIG);
        }
    }, []);

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect -- loading from IndexedDB (external system)
        loadConfig();
    }, [loadConfig]);

    const notifyChange = useCallback((updated: UIAppearanceConfigType) => {
        onConfigChange?.(updated);
    }, [onConfigChange]);

    const updateConfig = async (updater: (prev: UIAppearanceConfigType) => UIAppearanceConfigType) => {
        if (!config) return;
        const updated = updater(config);
        setConfig(updated);
        await settingsRepository.save({
            font: updated.font,
            wallpaper: updated.wallpaper,
            component: updated.component,
            browser: updated.browser,
        });
        notifyChange(updated);
    };

    const blobToDataUrl = (blob: Blob): Promise<string> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result as string);
            reader.onerror = reject;
            reader.readAsDataURL(blob);
        });
    };

    const handleExport = async () => {
        if (!config) return;
        try {
            const dbItems = await dockRepository.findAll();
            const dockItemsData = await Promise.all(dbItems.map(async item => ({
                id: item.id,
                iconDataUrl: await blobToDataUrl(item.iconBlob),
                iconName: item.iconName,
                sort: item.sort,
                link: item.link,
                isEnabled: item.isEnabled,
            })));

            const exportData: FullExportData = {
                version: '1.0',
                exportedAt: Date.now(),
                uiAppearance: {
                    id: config.id,
                    font: config.font,
                    wallpaper: {
                        url: config.wallpaper.url,
                        isFullScreen: config.wallpaper.isFullScreen,
                    },
                    component: config.component,
                    browser: config.browser,
                },
                dockItems: dockItemsData,
            };

            const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `rainio-tab-config-${new Date().toISOString().slice(0, 10)}.json`;
            a.click();
            URL.revokeObjectURL(url);
            toast.success('配置导出成功');
        } catch (e) {
            console.error('导出失败', e);
            toast.error('导出失败');
        }
    };

    const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = async (event) => {
            try {
                const data = JSON.parse(event.target?.result as string) as FullExportData;

                if (!data.version || !data.uiAppearance || !Array.isArray(data.dockItems)) {
                    toast.error('导入文件格式不正确');
                    return;
                }

                await settingsRepository.save({
                    font: data.uiAppearance.font,
                    wallpaper: {
                        ...DEFAULT_UI_APPEARANCE_CONFIG.wallpaper,
                        ...data.uiAppearance.wallpaper,
                    },
                    component: data.uiAppearance.component,
                    browser: data.uiAppearance.browser,
                });

                await dockRepository.clearAll();
                for (const item of data.dockItems) {
                    if (item.iconDataUrl && item.iconName) {
                        const response = await fetch(item.iconDataUrl);
                        const blob = await response.blob();
                        const meta = {
                            name: item.iconName + '.png',
                            type: blob.type || 'image/png',
                            size: blob.size,
                            lastModified: Date.now(),
                        };
                        await dockRepository.insert({
                            id: item.id,
                            iconBlob: blob,
                            iconMeta: meta,
                            iconName: item.iconName,
                            sort: item.sort ?? 0,
                            link: item.link,
                            isEnabled: item.isEnabled ?? true,
                        });
                    }
                }

                await loadConfig();
                toast.success('配置导入成功，页面将刷新');
                setTimeout(() => window.location.reload(), 500);
            } catch (err) {
                console.error('导入失败', err);
                toast.error('导入失败，请检查文件格式');
            }
        };
        reader.readAsText(file);
        e.target.value = '';
    };

    if (!config) return null;

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <div className="settings-icon-wrapper">
                    <img
                        className="settings-icon"
                        src="/setting.svg"
                        alt="Settings"
                        width="2.5%"
                        height="2.5%"
                    />
                </div>
            </PopoverTrigger>
            <PopoverContent
                className="settings-popover-content bg-card text-card-foreground rounded-xl border shadow-sm p-0"
                align="end"
                sideOffset={12}
                style={{ width: '340px' }}
                onOpenAutoFocus={(event) => event.preventDefault()}
            >
                <div className="settings-body">
                    {/* 一级 Tab */}
                    <div className="settings-tabs">
                        {TABS.map(tab => (
                            <button
                                key={tab.key}
                                className={`settings-tab ${activeTab === tab.key ? 'settings-tab--active' : ''}`}
                                onClick={() => setActiveTab(tab.key)}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>

                    {/* 二级设置内容 */}
                    {activeTab === 'appearance' && (
                        <>
                            <div className="settings-field">
                                <Label className="settings-field-label">字体</Label>
                                <select
                                    className="settings-select"
                                    value={config.font.family}
                                    onChange={(e) => updateConfig(prev => ({
                                        ...prev,
                                        font: { ...prev.font, family: e.target.value as UIAppearanceConfigType['font']['family'] }
                                    }))}
                                >
                                    <option value={FontFamily.SYSTEM}>系统默认</option>
                                    <option value={FontFamily.MICROSOFT_YAHEI}>微软雅黑</option>
                                    <option value={FontFamily.SIMSUN}>宋体</option>
                                    <option value={FontFamily.ARIAL}>Arial</option>
                                </select>
                            </div>

                            <div className="settings-field">
                                <Label className="settings-field-label">壁纸URL</Label>
                                <Input
                                    type="text"
                                    placeholder="输入壁纸 URL"
                                    value={config.wallpaper.url || ''}
                                    className="settings-input"
                                    onChange={(e) => updateConfig(prev => ({
                                        ...prev,
                                        wallpaper: { ...prev.wallpaper, url: e.target.value, type: WallpaperType.URL }
                                    }))}
                                />
                            </div>

                            <div className="settings-field">
                                <Label className="settings-field-label">全屏壁纸</Label>
                                <Switch
                                    checked={config.wallpaper.isFullScreen}
                                    onCheckedChange={(checked) => updateConfig(prev => ({
                                        ...prev,
                                        wallpaper: { ...prev.wallpaper, isFullScreen: checked }
                                    }))}
                                />
                            </div>
                        </>
                    )}

                    {activeTab === 'components' && (
                        <>
                            <div className="settings-field">
                                <Label className="settings-field-label">时钟</Label>
                                <Switch
                                    checked={config.component.clock}
                                    onCheckedChange={(checked) => updateConfig(prev => ({
                                        ...prev,
                                        component: { ...prev.component, clock: checked }
                                    }))}
                                />
                            </div>

                            <div className="settings-field">
                                <Label className="settings-field-label">每日一句</Label>
                                <Switch
                                    checked={config.component.yiyan}
                                    onCheckedChange={(checked) => updateConfig(prev => ({
                                        ...prev,
                                        component: { ...prev.component, yiyan: checked }
                                    }))}
                                />
                            </div>

                            <div className="settings-field">
                                <Label className="settings-field-label">搜索栏</Label>
                                <Switch
                                    checked={config.component.searchBar}
                                    onCheckedChange={(checked) => updateConfig(prev => ({
                                        ...prev,
                                        component: { ...prev.component, searchBar: checked }
                                    }))}
                                />
                            </div>
                        </>
                    )}

                    {activeTab === 'browser' && (
                        <>
                            <div className="settings-field">
                                <Label className="settings-field-label">搜索引擎</Label>
                                <select
                                    className="settings-select"
                                    value={config.browser.searchEngine}
                                    onChange={(e) => updateConfig(prev => ({
                                        ...prev,
                                        browser: { ...prev.browser, searchEngine: e.target.value as UIAppearanceConfigType['browser']['searchEngine'] }
                                    }))}
                                >
                                    <option value={SearchEngine.BAIDU}>百度</option>
                                    <option value={SearchEngine.GOOGLE}>Google</option>
                                    <option value={SearchEngine.BING}>必应</option>
                                    <option value={SearchEngine.SOGOU}>搜狗</option>
                                </select>
                            </div>

                            <div className="settings-field">
                                <Label className="settings-field-label">新标签页</Label>
                                <Switch
                                    checked={config.browser.tabOpenType === TabOpenType.NEW_TAB}
                                    onCheckedChange={(checked) => updateConfig(prev => ({
                                        ...prev,
                                        browser: {
                                            ...prev.browser,
                                            tabOpenType: checked ? TabOpenType.NEW_TAB : TabOpenType.CURRENT_TAB
                                        }
                                    }))}
                                />
                            </div>
                        </>
                    )}

                    {activeTab === 'data' && (
                        <>
                            <div className="settings-import-export">
                                <Button variant="outline" size="sm" onClick={handleExport}>
                                    导出配置
                                </Button>
                                <Button variant="outline" size="sm" onClick={() => fileInputRef.current?.click()}>
                                    导入配置
                                </Button>
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept=".json"
                                    style={{ display: 'none' }}
                                    onChange={handleImport}
                                />
                            </div>
                            <p className="settings-hint">导入将覆盖当前所有配置</p>
                        </>
                    )}
                </div>
            </PopoverContent>
        </Popover>
    );
};

export default SettingsModal;

import React from 'react';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/shadcn/popover.tsx";
import { Input } from "@/components/ui/shadcn/input.tsx";
import { Label } from "@/components/ui/shadcn/label.tsx";
import './SettingsPopover.css';

const SettingsPopover: React.FC = () => {
    return (
        <Popover>
            <PopoverTrigger asChild>
                <img
                    className="settings-icon"
                    src="/setting.svg"
                    alt="Settings"
                    width="2.5%"
                    height="2.5%"
                    onClick={() => console.log("Settings clicked")}
                />
            </PopoverTrigger>
            <PopoverContent
                className="settings-popover"
                style={{ width: '160px' }}
                onOpenAutoFocus={(event) => event.preventDefault()}
            >
                <div className="grid gap-4">
                    <div className="space-y-2">
                        <h4 className="leading-none font-medium">Dimensions</h4>
                        <p className="text-muted-foreground text-sm">
                            Set the dimensions for the layer.
                        </p>
                    </div>
                    <div className="grid gap-2">
                        <div className="grid grid-cols-3 items-center gap-4">
                            <Label htmlFor="width">修改字体</Label>
                            <Input
                                id="width"
                                defaultValue="100%"
                                className="col-span-2 h-8"
                            />
                        </div>
                        <div className="grid grid-cols-3 items-center gap-4">
                            <Label htmlFor="maxWidth">修改壁纸</Label>
                            <Input
                                id="maxWidth"
                                defaultValue="300px"
                                className="col-span-2 h-8"
                            />
                        </div>
                        <div className="grid grid-cols-3 items-center gap-4">
                            <Label htmlFor="height">隐藏时钟 / 一言</Label>
                            <Input
                                id="height"
                                defaultValue="25px"
                                className="col-span-2 h-8"
                            />
                        </div>
                        <div className="grid grid-cols-3 items-center gap-4">
                            <Label htmlFor="maxHeight">搜索引擎</Label>
                            <Input
                                id="maxHeight"
                                defaultValue="none"
                                className="col-span-2 h-8"
                            />
                        </div>
                        <div className="grid grid-cols-3 items-center gap-4">
                            <Label htmlFor="maxHeight">当前/新标签页打开</Label>
                            <Input
                                id="maxHeight"
                                defaultValue="none"
                                className="col-span-2 h-8"
                            />
                        </div>
                    </div>
                </div>
            </PopoverContent>
        </Popover>
    );
};

export default SettingsPopover;
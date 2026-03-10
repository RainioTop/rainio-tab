"use client"

import {zodResolver} from "@hookform/resolvers/zod"
import {Controller, useForm, useWatch} from "react-hook-form"
import * as z from "zod"
import {toast} from "sonner";
import {Button} from "@/components/ui/shadcn/button"
import {Card, CardContent, CardFooter, CardHeader, CardTitle,} from "@/components/ui/shadcn/card"
import {Field, FieldError, FieldGroup, FieldLabel,} from "@/components/ui/shadcn/field"
import {Input} from "@/components/ui/shadcn/input"
import {
    FileUpload, FileUploadClear,
    FileUploadDropzone,
    FileUploadItem,
    FileUploadItemDelete,
    FileUploadItemMetadata,
    FileUploadItemPreview,
    FileUploadList,
    type FileUploadProps,
    FileUploadTrigger
} from "@/components/ui/diceui/file-upload.tsx";
import {Upload, X} from "lucide-react";
import React from "react";
import type {DockItemConfig} from "@/config/dockItemConfig.ts";
import {dockRepository} from '@/db';
import type {DockItemType, IconBlobMeta} from "@/types";

const formSchema = z.object({
    url: z
        .string()
        .min(6, "网址最少输入6个字符！")
        .refine((value) => value.startsWith("https://") || value.startsWith("http://"), {message: "网址必须以 http(s):// 开头！",}),
    name: z
        .string()
        .min(1, "名称不能为空！"),
    file: z.instanceof(File, {message: "请上传图片文件"}).optional()
})

// 修复 2: 定义明确的表单类型
type FormData = z.infer<typeof formSchema>

interface AddIconFormProps {
    onAddIcon: (item: Omit<DockItemConfig, never>) => void;
    onClose: () => void;
}

export function AddIconForm({onAddIcon, onClose}: AddIconFormProps) {
    const form = useForm<FormData>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            url: "",
            name: "",
            file: undefined, // 使用 undefined 而不是 null
        },
        mode: "onBlur",
    })

    async function onSubmit(data: FormData) {
        if (!data.file) {
            toast.error("请上传文件");
            return;
        }

        const readFileAsDataURL = (file: File): Promise<string> => {
            return new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.onloadend = () => {
                    if (reader.result) {
                        resolve(reader.result as string);
                    } else {
                        reject(new Error('文件读取失败'));
                    }
                };
                reader.onerror = () => {
                    reject(new Error('文件读取错误'));
                };
                reader.onabort = () => {
                    reject(new Error('文件读取被中止'));
                };
                reader.readAsDataURL(file);
            });
        };

        readFileAsDataURL(data.file)
            .then(async base64Data => {
                const newId = crypto.randomUUID(); // 生成唯一ID
                const newItem: Omit<DockItemConfig, never> = {
                    id: newId,
                    iconSrc: base64Data,
                    iconAlt: data.name,
                    label: data.name,
                    url: data.url,
                };
                onAddIcon(newItem);
                onClose();
                handleReset(false);

                const newDockItem: Omit<DockItemType, never> = {
                    id: newId, // 生成唯一 ID
                    iconBlob: data.file!, // 直接使用 File 对象（File 继承自 Blob）
                    iconMeta: {
                        name: data.file!.name,
                        type: data.file!.type,
                        size: data.file!.size,
                        lastModified: data.file!.lastModified
                    } as IconBlobMeta,
                    iconName: data.name, // 用文件名作为显示名称
                    sort: 1, // dockItems.length + 1, // 排序值默认最后
                    isEnabled: true,
                    link: data.url, // 可自定义跳转链接
                    createdAt: Date.now(),
                    updatedAt: Date.now(),
                };
                await dockRepository.insert(newDockItem);
            })
            .catch(error => {
                console.error('文件读取失败:', error);
                toast.error(`文件读取失败: ${error.message}`);
            });

        toast.success(`图标 "${data.name}" 添加成功！`);
    }

    const [isUploading, setIsUploading] = React.useState(false);
    const formFile = useWatch({name: "file", control: form.control});

    const onUpload: NonNullable<FileUploadProps["onUpload"]> = React.useCallback(
        async (files) => {
            try {
                setIsUploading(true);
                await new Promise(resolve => setTimeout(resolve, 1000));

                toast.success(`文件上传成功: ${files[0].name.length > 25
                    ? `${files[0].name.slice(0, 25)}...`
                    : files[0].name}`);
            } catch (error) {
                setIsUploading(false);
                toast.error(
                    error instanceof Error ? error.message : "An unknown error occurred",
                );
            } finally {
                setIsUploading(false);
            }
        },
        [],
    );

    const onFileReject = React.useCallback((file: File, message: string) => {
        toast(message, {
            description: `"${file.name.length > 20 ? `${file.name.slice(0, 20)}...` : file.name}" has been rejected`,
        });
    }, []);

    const handleReset = (showToast: boolean = true) => {
        form.reset({url: "", name: "", file: undefined});
        const clearFileBtn = document.getElementById('hidden-file-clear');
        if (clearFileBtn) {
            clearFileBtn.click();
        }

        if (showToast) {
            toast.info("表单和文件已重置");
        }
    };

    // 修复 3: 单独处理文件设置，类型安全
    const handleFileAccept = (files: File[]) => {
        if (files.length > 0) {
            form.setValue("file", files[0]);
        }
    };

    const handleFileDelete = () => {
        form.setValue("file", undefined);
    };

    return (
        <Card className="w-full lg:max-w-5xl" style={{gap: "10px"}}>
            <CardHeader>
                <CardTitle style={{fontSize: '16px', userSelect: 'none'}}>添加图标</CardTitle>
            </CardHeader>
            <form id="form-rhf-demo" onSubmit={form.handleSubmit(onSubmit)}>
                <CardContent className="px-6">
                    <FieldGroup className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div className="space-y-4">
                            <Controller
                                name="url"
                                control={form.control}
                                render={({field, fieldState}) => (
                                    <Field data-invalid={fieldState.invalid}>
                                        <div className="flex items-center gap-3 w-full">
                                            <FieldLabel
                                                htmlFor="form-rhf-demo-title"
                                                style={{
                                                    flexShrink: 0,
                                                    marginBottom: 0,
                                                }}
                                            >
                                                地址
                                            </FieldLabel>
                                            <div className="flex-1">
                                                <Input
                                                    {...field}
                                                    id="form-rhf-demo-title"
                                                    aria-invalid={fieldState.invalid}
                                                    placeholder="https://www.baidu.com"
                                                    autoComplete="off"
                                                />
                                            </div>
                                        </div>
                                        {fieldState.invalid && (
                                            <FieldError errors={[fieldState.error]} style={{marginLeft: '40px'}}/>
                                        )}
                                    </Field>
                                )}
                            />

                            <Controller
                                name="name"
                                control={form.control}
                                render={({field, fieldState}) => (
                                    <Field data-invalid={fieldState.invalid}>
                                        <div className="flex items-center gap-3 w-full">
                                            <FieldLabel
                                                htmlFor="form-rhf-demo-title"
                                                style={{
                                                    flexShrink: 0,
                                                    marginBottom: 0,
                                                }}
                                            >
                                                名称
                                            </FieldLabel>
                                            <div className="flex-1">
                                                <Input
                                                    {...field}
                                                    id="form-rhf-demo-title"
                                                    aria-invalid={fieldState.invalid}
                                                    placeholder="百度"
                                                    autoComplete="off"
                                                />
                                            </div>
                                        </div>
                                        {fieldState.invalid && (
                                            <FieldError errors={[fieldState.error]} style={{marginLeft: '40px'}}/>
                                        )}
                                    </Field>
                                )}
                            />
                        </div>

                        <div className="space-y-4">
                            <FileUpload
                                accept="image/*"
                                maxFiles={1}
                                maxSize={4 * 1024 * 1024}
                                className="w-full max-w-md"
                                onAccept={handleFileAccept}
                                onUpload={onUpload}
                                onFileReject={onFileReject}
                                disabled={isUploading}
                            >
                                <FileUploadDropzone>
                                    <div className="flex flex-col items-center gap-1 text-center">
                                        <div className="flex items-center justify-center rounded-full border p-2.5">
                                            <Upload className="size-6 text-muted-foreground"/>
                                        </div>
                                        <p className="font-medium text-sm">将图片拖放至此处</p>
                                        <p className="text-muted-foreground text-xs">
                                            或点击浏览（最多 1 个文件，大小不超过 4MB）
                                        </p>
                                    </div>
                                    <FileUploadTrigger asChild>
                                        <Button variant="outline" size="sm" className="mt-2 w-fit">
                                            浏览文件
                                        </Button>
                                    </FileUploadTrigger>
                                </FileUploadDropzone>

                                <FileUploadList>
                                    {formFile ? [formFile].map((file, index) => (
                                        <FileUploadItem key={index} value={file}>
                                            <div className="flex w-full items-center gap-2">
                                                <FileUploadItemPreview/>
                                                <FileUploadItemMetadata/>
                                                <FileUploadItemDelete asChild>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="size-7"
                                                        onClick={handleFileDelete}
                                                    >
                                                        <X/>
                                                    </Button>
                                                </FileUploadItemDelete>
                                            </div>
                                        </FileUploadItem>
                                    )) : null}
                                </FileUploadList>
                                <FileUploadClear
                                    id="hidden-file-clear"
                                    className="hidden"
                                    forceMount
                                />
                            </FileUpload>
                        </div>
                    </FieldGroup>
                </CardContent>

                <CardFooter className="justify-center gap-4 px-6">
                    <div className="flex gap-4 mt-4">
                        <Button type="button" variant="outline" onClick={() => handleReset()} disabled={isUploading}>
                            重置
                        </Button>
                        {/* 修复 4: 提交按钮验证 */}
                        <Button
                            type="submit"
                            disabled={isUploading || !form.formState.isValid || !formFile}
                        >
                            添加
                        </Button>
                    </div>
                </CardFooter>
            </form>
        </Card>
    )
}
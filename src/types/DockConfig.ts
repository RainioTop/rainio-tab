export interface IconBlobMeta {
    name: string;
    type: string;
    size: number;
    lastModified: number;
}

export interface DockItemType {
    id: string;
    iconBlob: Blob;
    iconMeta: IconBlobMeta;
    iconName: string;
    sort: number;
    link?: string;
    isEnabled: boolean;
    createdAt: number;
    updatedAt?: number;
}

/**
 * MaterialsContext – shared persistent state for materials between teacher and student panels.
 * Uses the backend API for storage.
 */
import { createContext, useContext, useState, ReactNode, useEffect, useCallback } from 'react';
import { materialsApi, MaterialItem } from '../../api/client';

export type SharedMaterialType = 'pdf' | 'video' | 'archive' | 'document' | 'spreadsheet' | 'url' | 'text';
export type MaterialType = SharedMaterialType;

export interface SharedMaterial {
    id: string;
    title: string;
    description: string;
    type: SharedMaterialType;
    courseName: string;
    size: string;
    uploadDate: string;
    isVerified: boolean;
    url: string;
    teacherId?: number;
    teacher?: { id: number; name: string | null; email: string } | null;
}

interface MaterialsContextValue {
    materials: SharedMaterial[];
    loading: boolean;
    error: string | null;
    addMaterial: (m: Omit<SharedMaterial, 'id' | 'uploadDate' | 'isVerified'> & { teacherId: number }) => Promise<void>;
    removeMaterial: (id: string) => Promise<void>;
    refreshMaterials: () => Promise<void>;
}

const MaterialsContext = createContext<MaterialsContextValue | null>(null);

function mapItem(item: MaterialItem): SharedMaterial {
    return {
        id: String(item.id),
        title: item.title,
        description: item.description ?? '',
        type: item.type as SharedMaterialType,
        courseName: item.courseName,
        size: item.size ?? '',
        uploadDate: new Date(item.createdAt).toLocaleDateString('ru-RU', {
            day: '2-digit',
            month: 'long',
            year: 'numeric',
        }),
        isVerified: item.isVerified,
        url: item.url ?? '#',
        teacherId: item.teacherId,
        teacher: item.teacher,
    };
}

export function MaterialsProvider({ children }: { children: ReactNode }) {
    const [materials, setMaterials] = useState<SharedMaterial[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const refreshMaterials = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const items = await materialsApi.list();
            setMaterials(items.map(mapItem));
        } catch (e) {
            setError('Не удалось загрузить материалы');
            console.error(e);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        refreshMaterials();
    }, [refreshMaterials]);

    const addMaterial = useCallback(
        async (m: Omit<SharedMaterial, 'id' | 'uploadDate' | 'isVerified'> & { teacherId: number }) => {
            const item = await materialsApi.create({
                title: m.title,
                description: m.description,
                type: m.type,
                courseName: m.courseName,
                size: m.size,
                url: m.url,
                teacherId: m.teacherId,
            });
            setMaterials((prev) => [mapItem(item), ...prev]);
        },
        []
    );

    const removeMaterial = useCallback(async (id: string) => {
        const numId = parseInt(id, 10);
        await materialsApi.remove(numId);
        setMaterials((prev) => prev.filter((m) => m.id !== id));
    }, []);

    return (
        <MaterialsContext.Provider value={{ materials, loading, error, addMaterial, removeMaterial, refreshMaterials }}>
            {children}
        </MaterialsContext.Provider>
    );
}

export function useMaterials() {
    const ctx = useContext(MaterialsContext);
    if (!ctx) throw new Error('useMaterials must be used inside MaterialsProvider');
    return ctx;
}

/**
 * MaterialsContext – shared persistent state for materials between teacher and student panels.
 * Uses localStorage as primary storage to work without a backend server.
 */
import { createContext, useContext, useState, ReactNode, useEffect, useCallback } from 'react';

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
}

interface MaterialsContextValue {
    materials: SharedMaterial[];
    loading: boolean;
    error: string | null;
    addMaterial: (m: Omit<SharedMaterial, 'id' | 'uploadDate' | 'isVerified'>) => Promise<void>;
    removeMaterial: (id: string) => Promise<void>;
    refreshMaterials: () => Promise<void>;
}

const MaterialsContext = createContext<MaterialsContextValue | null>(null);

const LS_KEY = 'vc_shared_materials_v1';

function loadMaterials(): SharedMaterial[] {
    try {
        const raw = localStorage.getItem(LS_KEY);
        return raw ? JSON.parse(raw) : [];
    } catch {
        return [];
    }
}

function saveMaterials(materials: SharedMaterial[]) {
    try {
        localStorage.setItem(LS_KEY, JSON.stringify(materials));
    } catch {
        // storage quota exceeded — ignore
    }
}

export function MaterialsProvider({ children }: { children: ReactNode }) {
    const [materials, setMaterials] = useState<SharedMaterial[]>(loadMaterials);
    const [loading] = useState(false);
    const [error] = useState<string | null>(null);

    // Persist every change to localStorage
    useEffect(() => {
        saveMaterials(materials);
    }, [materials]);

    const refreshMaterials = useCallback(async () => {
        // Reload from localStorage
        setMaterials(loadMaterials());
    }, []);

    const addMaterial = useCallback(async (m: Omit<SharedMaterial, 'id' | 'uploadDate' | 'isVerified'>) => {
        const newMaterial: SharedMaterial = {
            ...m,
            id: crypto.randomUUID(),
            uploadDate: new Date().toLocaleDateString('ru-RU', { day: '2-digit', month: 'long', year: 'numeric' }),
            isVerified: true,
        };
        setMaterials(prev => [newMaterial, ...prev]);
    }, []);

    const removeMaterial = useCallback(async (id: string) => {
        setMaterials(prev => prev.filter(m => m.id !== id));
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

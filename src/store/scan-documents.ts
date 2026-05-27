import { createId } from "@/lib/camscan/storage"
import { persistStudentScanImages } from "@/lib/scan-documents/storage"
import type {
    ScanDocumentsCameraSettings,
    ScanDocumentsItem,
    ScanDocumentsPhoto,
} from "@/types/scan-documents"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { create } from "zustand"
import { createJSONStorage, persist } from "zustand/middleware"

const defaultCameraSettings: ScanDocumentsCameraSettings = {
    captureSize: "4:3",
}

interface ScanDocumentsState {
    cameraSettings: ScanDocumentsCameraSettings
    setCameraSettings: (settings: Partial<ScanDocumentsCameraSettings>) => void
    items: ScanDocumentsItem[]
    getItem: (itemId: string) => ScanDocumentsItem | undefined
    createItem: (item: ScanDocumentsItem) => void
    updateItem: (item: ScanDocumentsItem) => void
    deleteItem: (id: string) => void
    addPhotoToItem: (
        itemId: string,
        sourceUri: string,
        title?: string
    ) => Promise<void>
}

export const useScanDocumentsStore = create<ScanDocumentsState>()(
    persist(
        (set, get) => ({
            cameraSettings: defaultCameraSettings,
            setCameraSettings: (settings) => {
                set((state) => ({
                    cameraSettings: {
                        ...state.cameraSettings,
                        ...settings,
                    },
                }))
            },
            items: [],
            getItem: (itemId) =>
                get().items.find((item) => item.id === itemId),
            createItem: (item) => {
                set((state) => ({ items: [item, ...state.items] }))
            },
            updateItem: (item) => {
                set((state) => ({
                    items: state.items.map((i) =>
                        i.id === item.id ? item : i
                    ),
                }))
            },
            deleteItem: (itemId) => {
                set((state) => ({
                    items: state.items.filter((i) => i.id !== itemId),
                }))
            },
            addPhotoToItem: async (itemId, sourceUri, title) => {
                const [persistedUri] = await persistStudentScanImages(
                    itemId,
                    [sourceUri]
                )
                const now = new Date().toISOString()
                const photo: ScanDocumentsPhoto = {
                    id: createId(),
                    uri: persistedUri,
                    createdAt: now,
                }
                const existing = get().getItem(itemId)

                if (existing) {
                    set((state) => ({
                        items: state.items.map((item) =>
                            item.id === itemId
                                ? {
                                      ...item,
                                      photos: [...item.photos, photo],
                                      updatedAt: now,
                                  }
                                : item
                        ),
                    }))
                    return
                }

                const item: ScanDocumentsItem = {
                    id: itemId,
                    title: title?.trim() || "Student",
                    photos: [photo],
                    createdAt: now,
                    updatedAt: now,
                }
                set((state) => ({ items: [item, ...state.items] }))
            },
        }),
        {
            name: "scan-documents-storage",
            storage: createJSONStorage(() => AsyncStorage),
            partialize: (state) => ({
                items: state.items,
                cameraSettings: state.cameraSettings,
            }),
        }
    )
)

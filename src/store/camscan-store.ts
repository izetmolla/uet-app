import AsyncStorage from "@react-native-async-storage/async-storage"
import { create } from "zustand"
import { createJSONStorage, persist } from "zustand/middleware"

import {
    createId,
    deleteItemFiles,
    deletePhotoFile,
    persistScannedImages,
} from "@/lib/camscan/storage"
import type { CamscanItem, CamscanPhoto } from "@/types/camscan"

type CamscanState = {
    items: CamscanItem[]
    createItemFromScan: (sourceUris: string[], title?: string, student_id?: string) => Promise<string>
    addPhotosToItem: (itemId: string, sourceUris: string[]) => Promise<void>
    updateItemTitle: (itemId: string, title: string) => void
    reorderPhotos: (itemId: string, fromIndex: number, toIndex: number) => void
    deletePhoto: (itemId: string, photoId: string) => Promise<void>
    deleteItem: (itemId: string) => Promise<void>
    getItem: (itemId: string) => CamscanItem | undefined
}

function defaultTitle() {
    return `Scan ${new Date().toLocaleString()}`
}

export const useCamscanStore = create<CamscanState>()(
    persist(
        (set, get) => ({
            items: [],

            createItemFromScan: async (sourceUris, title, student_id) => {
                const id = student_id ?student_id : createId()
                const now = new Date().toISOString()
                const persistedUris = await persistScannedImages(id, sourceUris)
                const photos: CamscanPhoto[] = persistedUris.map((uri) => ({
                    id: createId(),
                    uri,
                    createdAt: now,
                }))

                const item: CamscanItem = {
                    id,
                    title: title?.trim() || defaultTitle(),
                    photos,
                    createdAt: now,
                    updatedAt: now,
                }

                set((state) => ({ items: [item, ...state.items] }))
                return id
            },

            addPhotosToItem: async (itemId, sourceUris) => {
                const persistedUris = await persistScannedImages(
                    itemId,
                    sourceUris
                )
                const now = new Date().toISOString()
                const newPhotos: CamscanPhoto[] = persistedUris.map((uri) => ({
                    id: createId(),
                    uri,
                    createdAt: now,
                }))

                set((state) => ({
                    items: state.items.map((item) =>
                        item.id === itemId
                            ? {
                                  ...item,
                                  photos: [...item.photos, ...newPhotos],
                                  updatedAt: now,
                              }
                            : item
                    ),
                }))
            },

            updateItemTitle: (itemId, title) => {
                const trimmed = title.trim()
                if (!trimmed) return

                set((state) => ({
                    items: state.items.map((item) =>
                        item.id === itemId
                            ? {
                                  ...item,
                                  title: trimmed,
                                  updatedAt: new Date().toISOString(),
                              }
                            : item
                    ),
                }))
            },

            reorderPhotos: (itemId, fromIndex, toIndex) => {
                set((state) => ({
                    items: state.items.map((item) => {
                        if (item.id !== itemId) return item

                        const photos = [...item.photos]
                        if (
                            fromIndex < 0 ||
                            toIndex < 0 ||
                            fromIndex >= photos.length ||
                            toIndex >= photos.length
                        ) {
                            return item
                        }

                        const [moved] = photos.splice(fromIndex, 1)
                        photos.splice(toIndex, 0, moved)

                        return {
                            ...item,
                            photos,
                            updatedAt: new Date().toISOString(),
                        }
                    }),
                }))
            },

            deletePhoto: async (itemId, photoId) => {
                const item = get().items.find((i) => i.id === itemId)
                const photo = item?.photos.find((p) => p.id === photoId)
                if (photo) {
                    await deletePhotoFile(photo.uri)
                }

                set((state) => ({
                    items: state.items.map((entry) =>
                        entry.id === itemId
                            ? {
                                  ...entry,
                                  photos: entry.photos.filter(
                                      (p) => p.id !== photoId
                                  ),
                                  updatedAt: new Date().toISOString(),
                              }
                            : entry
                    ),
                }))
            },

            deleteItem: async (itemId) => {
                await deleteItemFiles(itemId)
                set((state) => ({
                    items: state.items.filter((item) => item.id !== itemId),
                }))
            },

            getItem: (itemId) => get().items.find((item) => item.id === itemId),
        }),
        {
            name: "camscan-storage",
            storage: createJSONStorage(() => AsyncStorage),
            partialize: (state) => ({ items: state.items }),
        }
    )
)

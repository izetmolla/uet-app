import AsyncStorage from "@react-native-async-storage/async-storage"
import { create } from "zustand"
import { createJSONStorage, persist } from "zustand/middleware"

import { createId } from "@/lib/camscan/storage"
import {
    deleteStudentPhotoFile,
    persistStudentScanImages,
} from "@/lib/scan-documents/storage"
import type { StudentScanPhoto } from "@/types/student-scanner"

type StudentPhotosState = {
    byStudent: Record<string, StudentScanPhoto[]>
    getPhotos: (studentId: string) => StudentScanPhoto[]
    addPhotos: (studentId: string, sourceUris: string[]) => Promise<void>
    reorderPhotos: (
        studentId: string,
        fromIndex: number,
        toIndex: number
    ) => void
    deletePhoto: (studentId: string, photoId: string) => Promise<void>
}

export const useStudentPhotosStore = create<StudentPhotosState>()(
    persist(
        (set, get) => ({
            byStudent: {},

            getPhotos: (studentId) => get().byStudent[studentId] ?? [],

            addPhotos: async (studentId, sourceUris) => {
                if (!sourceUris.length) return

                const persistedUris = await persistStudentScanImages(
                    studentId,
                    sourceUris
                )
                const now = new Date().toISOString()
                const newPhotos: StudentScanPhoto[] = persistedUris.map(
                    (uri) => ({
                        id: createId(),
                        uri,
                        createdAt: now,
                    })
                )

                set((state) => ({
                    byStudent: {
                        ...state.byStudent,
                        [studentId]: [
                            ...(state.byStudent[studentId] ?? []),
                            ...newPhotos,
                        ],
                    },
                }))
            },

            reorderPhotos: (studentId, fromIndex, toIndex) => {
                set((state) => {
                    const photos = [...(state.byStudent[studentId] ?? [])]
                    if (
                        fromIndex < 0 ||
                        toIndex < 0 ||
                        fromIndex >= photos.length ||
                        toIndex >= photos.length
                    ) {
                        return state
                    }

                    const [moved] = photos.splice(fromIndex, 1)
                    photos.splice(toIndex, 0, moved)

                    return {
                        byStudent: {
                            ...state.byStudent,
                            [studentId]: photos,
                        },
                    }
                })
            },

            deletePhoto: async (studentId, photoId) => {
                const photo = get()
                    .byStudent[studentId]
                    ?.find((entry) => entry.id === photoId)

                if (photo) {
                    await deleteStudentPhotoFile(photo.uri)
                }

                set((state) => ({
                    byStudent: {
                        ...state.byStudent,
                        [studentId]: (state.byStudent[studentId] ?? []).filter(
                            (entry) => entry.id !== photoId
                        ),
                    },
                }))
            },
        }),
        {
            name: "student-scan-photos",
            storage: createJSONStorage(() => AsyncStorage),
            partialize: (state) => ({ byStudent: state.byStudent }),
        }
    )
)

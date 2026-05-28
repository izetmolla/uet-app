import { create } from "zustand"

export type PhotoUploadEntry =
    | { status: "idle" }
    | { status: "uploading"; progress: number }
    | { status: "success" }
    | { status: "error"; message: string }

type StudentUploadSession = Record<string, PhotoUploadEntry>

type PhotoUploadState = {
    sessions: Record<string, StudentUploadSession>
    batchMeta: Record<string, { total: number }>
    initUploadSession: (studentId: string, photoIds: string[]) => void
    setBatchMeta: (studentId: string, total: number) => void
    clearBatchMeta: (studentId: string) => void
    setPhotoUploading: (studentId: string, photoId: string) => void
    setPhotoProgress: (
        studentId: string,
        photoId: string,
        progress: number
    ) => void
    setPhotoSuccess: (studentId: string, photoId: string) => void
    setPhotoError: (
        studentId: string,
        photoId: string,
        message: string
    ) => void
    clearPhotoStatus: (studentId: string, photoId: string) => void
    clearUploadingPhotos: (studentId: string) => void
    clearUploadSession: (studentId: string) => void
}

const defaultEntry: PhotoUploadEntry = { status: "idle" }

export const usePhotoUploadStore = create<PhotoUploadState>((set) => ({
    sessions: {},
    batchMeta: {},
    initUploadSession: (studentId, photoIds) => {
        set((state) => {
            const session: StudentUploadSession = {}

            for (const photoId of photoIds) {
                session[photoId] = { status: "uploading", progress: 0 }
            }

            return {
                sessions: {
                    ...state.sessions,
                    [studentId]: session,
                },
            }
        })
    },
    setPhotoUploading: (studentId, photoId) => {
        set((state) => ({
            sessions: {
                ...state.sessions,
                [studentId]: {
                    ...(state.sessions[studentId] ?? {}),
                    [photoId]: { status: "uploading", progress: 0 },
                },
            },
        }))
    },
    setBatchMeta: (studentId, total) => {
        set((state) => ({
            batchMeta: {
                ...state.batchMeta,
                [studentId]: { total },
            },
        }))
    },
    clearBatchMeta: (studentId) => {
        set((state) => {
            const batchMeta = { ...state.batchMeta }
            delete batchMeta[studentId]

            return { batchMeta }
        })
    },
    setPhotoProgress: (studentId, photoId, progress) => {
        set((state) => {
            const current = state.sessions[studentId]?.[photoId]
            if (current?.status !== "uploading") {
                return state
            }

            return {
                sessions: {
                    ...state.sessions,
                    [studentId]: {
                        ...(state.sessions[studentId] ?? {}),
                        [photoId]: {
                            status: "uploading",
                            progress: Math.min(100, Math.max(0, progress)),
                        },
                    },
                },
            }
        })
    },
    setPhotoSuccess: (studentId, photoId) => {
        set((state) => ({
            sessions: {
                ...state.sessions,
                [studentId]: {
                    ...(state.sessions[studentId] ?? {}),
                    [photoId]: { status: "success" },
                },
            },
        }))
    },
    setPhotoError: (studentId, photoId, message) => {
        set((state) => ({
            sessions: {
                ...state.sessions,
                [studentId]: {
                    ...(state.sessions[studentId] ?? {}),
                    [photoId]: { status: "error", message },
                },
            },
        }))
    },
    clearPhotoStatus: (studentId, photoId) => {
        set((state) => {
            const session = { ...(state.sessions[studentId] ?? {}) }
            delete session[photoId]

            return {
                sessions: {
                    ...state.sessions,
                    [studentId]: session,
                },
            }
        })
    },
    clearUploadingPhotos: (studentId) => {
        set((state) => {
            const session = { ...(state.sessions[studentId] ?? {}) }

            for (const [photoId, entry] of Object.entries(session)) {
                if (entry.status === "uploading") {
                    delete session[photoId]
                }
            }

            return {
                sessions: {
                    ...state.sessions,
                    [studentId]: session,
                },
            }
        })
    },
    clearUploadSession: (studentId) => {
        set((state) => {
            const sessions = { ...state.sessions }
            delete sessions[studentId]

            const batchMeta = { ...state.batchMeta }
            delete batchMeta[studentId]

            return { sessions, batchMeta }
        })
    },
}))

export function getPhotoUploadEntry(
    sessions: Record<string, StudentUploadSession>,
    studentId: string,
    photoId: string
): PhotoUploadEntry {
    return sessions[studentId]?.[photoId] ?? defaultEntry
}

import { create } from "zustand"

export type PdfUploadEntry =
    | { status: "idle" }
    | { status: "uploading"; progress: number; phase?: "generating" | "uploading" }
    | { status: "success" }
    | { status: "error"; message: string }

type StudentPdfUploadSession = Record<string, PdfUploadEntry>

type PdfUploadState = {
    sessions: Record<string, StudentPdfUploadSession>
    activePdfId: Record<string, string | undefined>
    initPdfUpload: (studentId: string, pdfId: string) => void
    setActivePdfId: (studentId: string, pdfId: string | undefined) => void
    setPdfUploading: (
        studentId: string,
        pdfId: string,
        phase?: "generating" | "uploading"
    ) => void
    setPdfProgress: (
        studentId: string,
        pdfId: string,
        progress: number,
        phase?: "generating" | "uploading"
    ) => void
    setPdfSuccess: (studentId: string, pdfId: string) => void
    setPdfError: (studentId: string, pdfId: string, message: string) => void
    clearPdfStatus: (studentId: string, pdfId: string) => void
    clearUploadSession: (studentId: string) => void
}

const defaultEntry: PdfUploadEntry = { status: "idle" }

export const usePdfUploadStore = create<PdfUploadState>((set) => ({
    sessions: {},
    activePdfId: {},
    initPdfUpload: (studentId, pdfId) => {
        set((state) => ({
            sessions: {
                ...state.sessions,
                [studentId]: {
                    [pdfId]: { status: "uploading", progress: 0, phase: "generating" },
                },
            },
            activePdfId: {
                ...state.activePdfId,
                [studentId]: pdfId,
            },
        }))
    },
    setActivePdfId: (studentId, pdfId) => {
        set((state) => ({
            activePdfId: {
                ...state.activePdfId,
                [studentId]: pdfId,
            },
        }))
    },
    setPdfUploading: (studentId, pdfId, phase = "uploading") => {
        set((state) => ({
            sessions: {
                ...state.sessions,
                [studentId]: {
                    ...(state.sessions[studentId] ?? {}),
                    [pdfId]: { status: "uploading", progress: 0, phase },
                },
            },
        }))
    },
    setPdfProgress: (studentId, pdfId, progress, phase) => {
        set((state) => {
            const current = state.sessions[studentId]?.[pdfId]
            if (current?.status !== "uploading") {
                return state
            }

            return {
                sessions: {
                    ...state.sessions,
                    [studentId]: {
                        ...(state.sessions[studentId] ?? {}),
                        [pdfId]: {
                            status: "uploading",
                            progress: Math.min(100, Math.max(0, progress)),
                            phase: phase ?? current.phase,
                        },
                    },
                },
            }
        })
    },
    setPdfSuccess: (studentId, pdfId) => {
        set((state) => ({
            sessions: {
                ...state.sessions,
                [studentId]: {
                    ...(state.sessions[studentId] ?? {}),
                    [pdfId]: { status: "success" },
                },
            },
        }))
    },
    setPdfError: (studentId, pdfId, message) => {
        set((state) => ({
            sessions: {
                ...state.sessions,
                [studentId]: {
                    ...(state.sessions[studentId] ?? {}),
                    [pdfId]: { status: "error", message },
                },
            },
        }))
    },
    clearPdfStatus: (studentId, pdfId) => {
        set((state) => {
            const session = { ...(state.sessions[studentId] ?? {}) }
            delete session[pdfId]

            const activePdfId = { ...state.activePdfId }
            if (activePdfId[studentId] === pdfId) {
                delete activePdfId[studentId]
            }

            return {
                sessions: {
                    ...state.sessions,
                    [studentId]: session,
                },
                activePdfId,
            }
        })
    },
    clearUploadSession: (studentId) => {
        set((state) => {
            const sessions = { ...state.sessions }
            delete sessions[studentId]

            const activePdfId = { ...state.activePdfId }
            delete activePdfId[studentId]

            return { sessions, activePdfId }
        })
    },
}))

export function getPdfUploadEntry(
    sessions: Record<string, StudentPdfUploadSession>,
    studentId: string,
    pdfId: string
): PdfUploadEntry {
    return sessions[studentId]?.[pdfId] ?? defaultEntry
}

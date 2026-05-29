import { useCallback, useMemo } from "react"

import {
    cancelPdfUpload,
    dismissPdfUploadSession,
    isPdfUploadActive,
    retryPdfUpload,
    startPdfUploadFromPhotos,
} from "@/lib/scan-documents/pdf-upload-service"
import {
    getPdfUploadEntry,
    usePdfUploadStore,
    type PdfUploadEntry,
} from "@/store/pdf-upload"
import {
    EMPTY_STUDENT_PDFS,
    useStudentPdfsStore,
} from "@/store/student-pdfs"
import type { ScanDocumentsPhoto } from "@/types/scan-documents"

type UseUploadPdfOptions = {
    studentId: string
    folderId?: string
}

export function useUploadPdf({ studentId, folderId }: UseUploadPdfOptions) {
    const sessions = usePdfUploadStore((s) => s.sessions)
    const activePdfId = usePdfUploadStore((s) => s.activePdfId[studentId])
    const pdfs = useStudentPdfsStore(
        (s) => s.byStudent[studentId] ?? EMPTY_STUDENT_PDFS
    )

    const uploadPdfFromPhotos = useCallback(
        (photos: ScanDocumentsPhoto[], title: string) =>
            startPdfUploadFromPhotos({ studentId, folderId, photos, title }),
        [folderId, studentId]
    )

    const cancelUpload = useCallback(() => {
        cancelPdfUpload(studentId)
    }, [studentId])

    const dismissUploadSession = useCallback(() => {
        dismissPdfUploadSession(studentId)
    }, [studentId])

    const retryPdf = useCallback(
        (pdfId: string) => {
            const pdf = pdfs.find((item) => item.id === pdfId)
            if (!pdf) return false

            return retryPdfUpload({
                studentId,
                folderId,
                pdfId: pdf.id,
                uri: pdf.uri,
                title: pdf.title,
            })
        },
        [folderId, pdfs, studentId]
    )

    const getPdfUploadStatus = useCallback(
        (pdfId: string): PdfUploadEntry =>
            getPdfUploadEntry(sessions, studentId, pdfId),
        [sessions, studentId]
    )

    const uploadSummary = useMemo(() => {
        const session = sessions[studentId] ?? {}
        const entries = Object.values(session)
        const currentPdfId = activePdfId ?? Object.keys(session)[0]
        const currentEntry = currentPdfId
            ? session[currentPdfId]
            : undefined

        const uploadingCount = entries.filter(
            (entry) => entry.status === "uploading"
        ).length
        const isActive = uploadingCount > 0 || isPdfUploadActive(studentId)
        const isFinished =
            Boolean(currentEntry) &&
            uploadingCount === 0 &&
            (currentEntry?.status === "success" ||
                currentEntry?.status === "error")
        const failedCount =
            currentEntry?.status === "error" ? 1 : 0
        const uploadedCount =
            currentEntry?.status === "success" ? 1 : 0
        const overallPercent =
            currentEntry?.status === "uploading"
                ? currentEntry.progress
                : currentEntry?.status === "success" ||
                    currentEntry?.status === "error"
                  ? 100
                  : 0
        const phase =
            currentEntry?.status === "uploading"
                ? currentEntry.phase
                : undefined

        return {
            currentPdfId,
            uploadingCount,
            uploadedCount,
            failedCount,
            overallPercent,
            isActive,
            isFinished,
            hasVisibleSession: entries.length > 0,
            phase,
        }
    }, [activePdfId, sessions, studentId])

    return {
        pdfs,
        uploadPdfFromPhotos,
        cancelUpload,
        dismissUploadSession,
        retryPdf,
        getPdfUploadStatus,
        uploadSummary,
        isUploading: uploadSummary.isActive,
    }
}

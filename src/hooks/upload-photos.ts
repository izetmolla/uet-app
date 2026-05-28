import { useCallback, useMemo } from "react"

import {
    cancelPhotoUploadBatch,
    isPhotoUploadBatchActive,
    retryPhotoUpload,
    startPhotoUploadBatch,
} from "@/lib/scan-documents/photo-upload-service"
import {
    getPhotoUploadEntry,
    usePhotoUploadStore,
    type PhotoUploadEntry,
} from "@/store/photo-upload"
import type { ScanDocumentsPhoto } from "@/types/scan-documents"

type UseUploadPhotosOptions = {
    studentId: string
    folderId?: string
}

export function useUploadPhotos({ studentId, folderId }: UseUploadPhotosOptions) {
    const sessions = usePhotoUploadStore((s) => s.sessions)
    const batchMeta = usePhotoUploadStore((s) => s.batchMeta)

    const uploadPhotos = useCallback(
        (photos: ScanDocumentsPhoto[]) =>
            startPhotoUploadBatch({ studentId, folderId, photos }),
        [folderId, studentId]
    )

    const cancelUploads = useCallback(() => {
        cancelPhotoUploadBatch(studentId)
    }, [studentId])

    const retryPhoto = useCallback(
        (photo: ScanDocumentsPhoto) => {
            retryPhotoUpload({ studentId, folderId, photo })
        },
        [folderId, studentId]
    )

    const getPhotoStatus = useCallback(
        (photoId: string): PhotoUploadEntry =>
            getPhotoUploadEntry(sessions, studentId, photoId),
        [sessions, studentId]
    )

    const uploadSummary = useMemo(() => {
        const session = sessions[studentId] ?? {}
        const entries = Object.values(session)
        const uploadingCount = entries.filter(
            (entry) => entry.status === "uploading"
        ).length
        const completedCount = entries.filter(
            (entry) => entry.status === "success" || entry.status === "error"
        ).length
        const total = batchMeta[studentId]?.total ?? entries.length

        let progressSum = 0
        for (const entry of entries) {
            if (entry.status === "uploading") {
                progressSum += entry.progress
            } else if (
                entry.status === "success" ||
                entry.status === "error"
            ) {
                progressSum += 100
            }
        }

        const overallPercent =
            total > 0 ? Math.min(100, Math.round(progressSum / total)) : 0

        return {
            total,
            uploadingCount,
            completedCount,
            overallPercent,
            isActive: uploadingCount > 0 || isPhotoUploadBatchActive(studentId),
        }
    }, [batchMeta, sessions, studentId])

    const isUploading = uploadSummary.uploadingCount > 0

    const hasUploadErrors = useMemo(() => {
        const session = sessions[studentId]
        if (!session) return false

        return Object.values(session).some(
            (entry) => entry.status === "error"
        )
    }, [sessions, studentId])

    return {
        uploadPhotos,
        cancelUploads,
        retryPhoto,
        getPhotoStatus,
        uploadSummary,
        isUploading,
        hasUploadErrors,
    }
}

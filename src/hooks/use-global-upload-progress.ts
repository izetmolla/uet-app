import { useMemo } from "react"

import { isPhotoUploadBatchActive } from "@/lib/scan-documents/photo-upload-service"
import { usePhotoUploadStore } from "@/store/photo-upload"

export type GlobalUploadProgress = {
    studentId: string
    percent: number
    total: number
    uploadedCount: number
    failedCount: number
    inProgressCount: number
}

export function useGlobalUploadProgress(): GlobalUploadProgress | null {
    const sessions = usePhotoUploadStore((s) => s.sessions)
    const batchMeta = usePhotoUploadStore((s) => s.batchMeta)

    return useMemo(() => {
        for (const studentId of Object.keys(sessions)) {
            const session = sessions[studentId]
            if (!session) continue

            const entries = Object.values(session)
            const uploadingEntries = entries.filter(
                (entry) => entry.status === "uploading"
            )
            const isJobActive = isPhotoUploadBatchActive(studentId)

            if (uploadingEntries.length === 0 && !isJobActive) {
                continue
            }

            const total = batchMeta[studentId]?.total ?? entries.length
            if (total === 0) continue

            let progressSum = 0
            let uploadedCount = 0
            let failedCount = 0

            for (const entry of entries) {
                if (entry.status === "uploading") {
                    progressSum += entry.progress
                } else if (entry.status === "success") {
                    progressSum += 100
                    uploadedCount += 1
                } else if (entry.status === "error") {
                    progressSum += 100
                    failedCount += 1
                }
            }

            return {
                studentId,
                total,
                uploadedCount,
                failedCount,
                inProgressCount: uploadingEntries.length,
                percent: Math.min(100, Math.round(progressSum / total)),
            }
        }

        return null
    }, [batchMeta, sessions])
}

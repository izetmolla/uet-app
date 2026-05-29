import { useScanDocumentsStore } from "@/store/scan-documents"
import type { ScanDocumentsPhoto } from "@/types/scan-documents"

/** Oldest first — matches scan / gallery page order. */
export function sortPhotosByCreatedAt(
    photos: ScanDocumentsPhoto[]
): ScanDocumentsPhoto[] {
    return [...photos].sort(
        (a, b) =>
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    )
}

export function getOrderedStudentPhotos(studentId: string): ScanDocumentsPhoto[] {
    const photos =
        useScanDocumentsStore.getState().getItem(studentId)?.photos ?? []

    return sortPhotosByCreatedAt(photos)
}

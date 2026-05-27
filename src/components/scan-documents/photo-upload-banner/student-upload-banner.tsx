import { useUploadPhotos } from "@/hooks/upload-photos"

import { PhotoUploadBanner } from "./index"

type StudentPhotoUploadBannerProps = {
    studentId: string
    folderId?: string
}

/** Visible on any student tab while uploads run in the background. */
export function StudentPhotoUploadBanner({
    studentId,
    folderId,
}: StudentPhotoUploadBannerProps) {
    const { uploadSummary, cancelUploads } = useUploadPhotos({
        studentId,
        folderId,
    })

    if (!uploadSummary.isActive) {
        return null
    }

    return (
        <PhotoUploadBanner
            uploadingCount={uploadSummary.uploadingCount}
            total={uploadSummary.total}
            completedCount={uploadSummary.completedCount}
            onCancel={cancelUploads}
        />
    )
}

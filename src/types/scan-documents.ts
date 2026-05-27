export type CameraCaptureSize = "4:3" | "16:9" | "1:1"

export type PhotosViewMode = "grid" | "list"

export type ScanDocumentsCameraSettings = {
    captureSize: CameraCaptureSize
}

export type ScanDocumentsPhoto = {
    id: string
    uri: string
    createdAt: string
}

export type ScanDocumentsItem = {
    id: string
    title: string
    photos: ScanDocumentsPhoto[]
    createdAt: string
    updatedAt: string
}

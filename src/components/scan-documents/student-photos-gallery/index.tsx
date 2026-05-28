import { useMemo, useState } from "react"
import {
    FlatList,
    StyleSheet,
    useWindowDimensions,
    type ListRenderItem,
} from "react-native"

import { EmptyCollection } from "@/components/scan-documents/emptycollection"
import { GalleryPhotoTile } from "@/components/scan-documents/gallery-photo-tile"
import { PhotoUploadProgressOverlay } from "@/components/scan-documents/photo-upload-progress-overlay"
import { Box } from "@/components/ui/box"
import { Text } from "@/components/ui/text"
import { useUploadPhotos } from "@/hooks/upload-photos"
import { PORTRAIT_PREVIEW_ASPECT } from "@/lib/scan-documents/camera-capture"
import { usePhotoUploadStore } from "@/store/photo-upload"
import { useScanDocumentsStore } from "@/store/scan-documents"
import type { ScanDocumentsPhoto } from "@/types/scan-documents"

const LARGE_WIDTH = 768
const GRID_GAP = 10

type StudentPhotosGalleryProps = {
    studentId: string
    folderId?: string
    onScanPress: () => void
}

function getGridColumnCount(width: number) {
    return width >= LARGE_WIDTH ? 4 : 2
}

export function StudentPhotosGallery({
    studentId,
    folderId,
    onScanPress,
}: StudentPhotosGalleryProps) {
    const { width } = useWindowDimensions()
    const [retryingPhotoId, setRetryingPhotoId] = useState<string | null>(null)

    const photosViewMode = useScanDocumentsStore((s) => s.photosViewMode)
    const item = useScanDocumentsStore((s) => s.getItem(studentId))
    const photos = item?.photos ?? []

    const uploadSession = usePhotoUploadStore((s) => s.sessions[studentId])
    const uploadBatchMeta = usePhotoUploadStore((s) => s.batchMeta[studentId])

    const { getPhotoStatus, retryPhoto } = useUploadPhotos({
        studentId,
        folderId,
    })

    const listHeader = (
        <Box className="-mx-4 -mt-4 mb-1">
            <PhotoUploadProgressOverlay
                studentId={studentId}
                folderId={folderId}
            />
        </Box>
    )

    const isGrid = photosViewMode === "grid"
    const numColumns = isGrid ? getGridColumnCount(width) : 1
    const gridItemWidth = useMemo(() => {
        const horizontalPadding = 32
        const totalGap = GRID_GAP * (numColumns - 1)
        return (width - horizontalPadding - totalGap) / numColumns
    }, [numColumns, width])

    const gridItemHeight = gridItemWidth / PORTRAIT_PREVIEW_ASPECT

    const handleRetry = async (photo: ScanDocumentsPhoto) => {
        setRetryingPhotoId(photo.id)
        try {
            await retryPhoto(photo)
        } finally {
            setRetryingPhotoId(null)
        }
    }

    const renderPhoto: ListRenderItem<ScanDocumentsPhoto> = ({
        item: photo,
        index,
    }) => {
        const uploadStatus = getPhotoStatus(photo.id)
        const isRetrying = retryingPhotoId === photo.id

        if (isGrid) {
            return (
                <GalleryPhotoTile
                    uri={photo.uri}
                    pageLabel={String(index + 1)}
                    style={{
                        width: gridItemWidth,
                        height: gridItemHeight,
                    }}
                    imageStyle={{
                        width: gridItemWidth,
                        height: gridItemHeight,
                    }}
                    uploadStatus={uploadStatus}
                    onRetry={() => handleRetry(photo)}
                    retrying={isRetrying}
                />
            )
        }

        return (
            <GalleryPhotoTile
                uri={photo.uri}
                style={{ width: "100%" }}
                imageStyle={{
                    width: "100%",
                    aspectRatio: PORTRAIT_PREVIEW_ASPECT,
                }}
                uploadStatus={uploadStatus}
                onRetry={() => handleRetry(photo)}
                retrying={isRetrying}
                footer={
                    <Box className="border-t border-outline-100 px-3 py-2">
                        <Text size="sm" className="text-typography-500">
                            Page {index + 1}
                        </Text>
                    </Box>
                }
            />
        )
    }

    if (photos.length === 0) {
        return (
            <EmptyCollection
                message="No documents yet"
                description="Scan pages for this student using the Add tab."
                onScanPress={onScanPress}
                scanButtonLabel="Open camera"
            />
        )
    }

    return (
        <FlatList
                key={`${photosViewMode}-${numColumns}`}
                data={photos}
                keyExtractor={(photo) => photo.id}
                extraData={{ uploadSession, uploadBatchMeta }}
                ListHeaderComponent={listHeader}
                renderItem={renderPhoto}
                numColumns={numColumns}
                columnWrapperStyle={
                    isGrid && numColumns > 1 ? styles.gridRow : undefined
                }
                ItemSeparatorComponent={
                    isGrid
                        ? undefined
                        : () => <Box style={{ height: GRID_GAP }} />
                }
                contentContainerStyle={styles.listContent}
                showsVerticalScrollIndicator={false}
        />
    )
}

const styles = StyleSheet.create({
    listContent: {
        padding: 16,
    },
    gridRow: {
        gap: GRID_GAP,
        marginBottom: GRID_GAP,
    },
})

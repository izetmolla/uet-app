import { Image } from "expo-image"
import { useMemo } from "react"
import {
    FlatList,
    StyleSheet,
    useWindowDimensions,
    type ListRenderItem,
} from "react-native"

import { EmptyCollection } from "@/components/scan-documents/emptycollection"
import { Box } from "@/components/ui/box"
import { Text } from "@/components/ui/text"
import { PORTRAIT_PREVIEW_ASPECT } from "@/lib/scan-documents/camera-capture"
import { useScanDocumentsStore } from "@/store/scan-documents"
import type { ScanDocumentsPhoto } from "@/types/scan-documents"

const LARGE_WIDTH = 768
const GRID_GAP = 10

type StudentPhotosGalleryProps = {
    studentId: string
    onScanPress: () => void
}

function getGridColumnCount(width: number) {
    return width >= LARGE_WIDTH ? 4 : 2
}

export function StudentPhotosGallery({
    studentId,
    onScanPress,
}: StudentPhotosGalleryProps) {
    const { width } = useWindowDimensions()
    const photosViewMode = useScanDocumentsStore((s) => s.photosViewMode)
    const item = useScanDocumentsStore((s) => s.getItem(studentId))
    const photos = item?.photos ?? []

    const isGrid = photosViewMode === "grid"
    const numColumns = isGrid ? getGridColumnCount(width) : 1
    const gridItemWidth = useMemo(() => {
        const horizontalPadding = 32
        const totalGap = GRID_GAP * (numColumns - 1)
        return (width - horizontalPadding - totalGap) / numColumns
    }, [numColumns, width])

    const gridItemHeight = gridItemWidth / PORTRAIT_PREVIEW_ASPECT

    const renderPhoto: ListRenderItem<ScanDocumentsPhoto> = ({ item: photo, index }) => {
        if (isGrid) {
            return (
                <Box
                    className="overflow-hidden rounded-xl border border-outline-200 bg-background-0"
                    style={{
                        width: gridItemWidth,
                        height: gridItemHeight,
                    }}
                >
                    <Image
                        source={{ uri: photo.uri }}
                        style={StyleSheet.absoluteFill}
                        contentFit="cover"
                    />
                    <Box style={styles.pageBadge}>
                        <Text className="text-[10px] font-bold text-white">
                            {index + 1}
                        </Text>
                    </Box>
                </Box>
            )
        }

        return (
            <Box className="overflow-hidden rounded-xl border border-outline-200 bg-background-0">
                <Image
                    source={{ uri: photo.uri }}
                    style={{
                        width: "100%",
                        aspectRatio: PORTRAIT_PREVIEW_ASPECT,
                    }}
                    contentFit="cover"
                />
                <Box className="border-t border-outline-100 px-3 py-2">
                    <Text size="sm" className="text-typography-500">
                        Page {index + 1}
                    </Text>
                </Box>
            </Box>
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
            renderItem={renderPhoto}
            numColumns={numColumns}
            columnWrapperStyle={isGrid && numColumns > 1 ? styles.gridRow : undefined}
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
    pageBadge: {
        position: "absolute",
        top: 6,
        right: 6,
        minWidth: 20,
        height: 20,
        borderRadius: 10,
        alignItems: "center",
        justifyContent: "center",
        paddingHorizontal: 5,
        backgroundColor: "rgba(0, 0, 0, 0.6)",
    },
})

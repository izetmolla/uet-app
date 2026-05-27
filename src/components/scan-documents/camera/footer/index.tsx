import { Image } from "expo-image"
import { useCallback, useEffect, useRef } from "react"
import { FlatList, Pressable, StyleSheet, type ListRenderItem } from "react-native"

import { useScanDocumentsCameraSession } from "@/components/scan-documents/camera/camera-session-context"
import { Box } from "@/components/ui/box"
import { Text } from "@/components/ui/text"
import type { ScanDocumentsPhoto } from "@/types/scan-documents"

const THUMB_SIZE = 56
const THUMB_GAP = 10
const CAPTURE_LEFT_OFFSET = 50

const ScanDocumentsCameraFooter = () => {
    const { studentId, photos, isCapturing, capturePhoto } =
        useScanDocumentsCameraSession()
    const listRef = useRef<FlatList<ScanDocumentsPhoto>>(null)

    useEffect(() => {
        if (photos.length === 0) return
        requestAnimationFrame(() => {
            listRef.current?.scrollToEnd({ animated: true })
        })
    }, [photos.length])

    const renderPhoto: ListRenderItem<ScanDocumentsPhoto> = ({
        item,
        index,
    }) => (
        <Box
            className="overflow-hidden rounded-xl border-2 border-white/80 bg-neutral-900"
            style={styles.thumb}
        >
            <Image
                source={{ uri: item.uri }}
                style={{ width: THUMB_SIZE, height: THUMB_SIZE }}
                contentFit="cover"
            />
            <Box style={styles.photoBadge}>
                <Text className="text-[10px] font-bold leading-none text-white">
                    {index + 1}
                </Text>
            </Box>
        </Box>
    )

    const CaptureButton = useCallback(
        () => (
            <Pressable
                onPress={() => void capturePhoto()}
                disabled={isCapturing || !studentId}
                style={({ pressed }) => [
                    styles.captureOuter,
                    (pressed || isCapturing) && styles.captureOuterActive,
                    isCapturing && styles.captureOuterCapturing,
                ]}
                accessibilityRole="button"
                accessibilityLabel="Capture photo"
            >
                <Box
                    className="h-14 w-14 rounded-full bg-white"
                    style={isCapturing ? styles.captureInnerCapturing : undefined}
                />
            </Pressable>
        ),
        [capturePhoto, isCapturing, studentId]
    )

    const listFooter = useCallback(
        () => (
            <Box
                style={{
                    marginLeft: photos.length > 0 ? THUMB_GAP : 0,
                    marginRight: 50,
                }}
            >
                <CaptureButton />
            </Box>
        ),
        [CaptureButton, photos.length]
    )

    return (
        <Box className="min-h-32 justify-center bg-black px-4 pb-2 pt-3">
            <FlatList
                ref={listRef}
                data={photos}
                keyExtractor={(item) => item.id}
                renderItem={renderPhoto}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={[
                    styles.sliderContent,
                    {
                        paddingLeft:
                            photos.length === 0 ? CAPTURE_LEFT_OFFSET : 0,
                    },
                ]}
                ItemSeparatorComponent={() => (
                    <Box style={{ width: THUMB_GAP }} />
                )}
                ListFooterComponent={listFooter}
                ListEmptyComponent={null}
            />
        </Box>
    )
}

export default ScanDocumentsCameraFooter

const styles = StyleSheet.create({
    sliderContent: {
        alignItems: "center",
        minHeight: 76,
        paddingRight: 16,
    },
    thumb: {
        width: THUMB_SIZE,
        height: THUMB_SIZE,
    },
    captureOuter: {
        height: 76,
        width: 76,
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 9999,
        borderWidth: 4,
        borderColor: "#ffffff",
        backgroundColor: "rgba(255, 255, 255, 0.15)",
    },
    captureOuterActive: {
        transform: [{ scale: 0.96 }],
    },
    captureOuterCapturing: {
        opacity: 0.55,
        borderColor: "rgba(255, 255, 255, 0.65)",
        backgroundColor: "rgba(255, 255, 255, 0.08)",
    },
    captureInnerCapturing: {
        opacity: 0.45,
    },
    photoBadge: {
        position: "absolute",
        top: 4,
        right: 4,
        minWidth: 18,
        height: 18,
        borderRadius: 9,
        alignItems: "center",
        justifyContent: "center",
        paddingHorizontal: 4,
        backgroundColor: "rgba(0, 0, 0, 0.65)",
    },
})

import { Image } from "expo-image"
import { useCallback, useEffect, useRef } from "react"
import { Alert, FlatList, Pressable, StyleSheet, type ListRenderItem } from "react-native"

import { useScanDocumentsCameraSession } from "@/components/scan-documents/camera/camera-session-context"
import { CaptureButton } from "@/components/scan-documents/camera/footer/capture-button"
import { Box } from "@/components/ui/box"
import { HStack } from "@/components/ui/hstack"
import { Text } from "@/components/ui/text"
import { useScanDocumentsStore } from "@/store/scan-documents"
import type { ScanDocumentsPhoto } from "@/types/scan-documents"

const THUMB_SIZE = 56
const THUMB_GAP = 10
const CAPTURE_BUTTON_WIDTH = 76

const ScanDocumentsCameraFooter = () => {
    const { studentId, photos, isCapturing, capturePhoto } =
        useScanDocumentsCameraSession()
    const deletePhotoFromItem = useScanDocumentsStore(
        (s) => s.deletePhotoFromItem
    )
    const listRef = useRef<FlatList<ScanDocumentsPhoto>>(null)

    useEffect(() => {
        if (photos.length === 0) return
        requestAnimationFrame(() => {
            listRef.current?.scrollToEnd({ animated: true })
        })
    }, [photos.length])

    const confirmRemovePhoto = useCallback(
        (photo: ScanDocumentsPhoto, pageNumber: number) => {
            if (!studentId) return

            Alert.alert(
                "Remove photo",
                `Remove page ${pageNumber}?`,
                [
                    { text: "No", style: "cancel" },
                    {
                        text: "Yes",
                        style: "destructive",
                        onPress: () => {
                            void deletePhotoFromItem(studentId, photo.id)
                        },
                    },
                ],
                { cancelable: true }
            )
        },
        [deletePhotoFromItem, studentId]
    )

    const renderPhoto: ListRenderItem<ScanDocumentsPhoto> = useCallback(
        ({ item, index }) => (
            <Pressable
                onLongPress={() => confirmRemovePhoto(item, index + 1)}
                delayLongPress={400}
                accessibilityRole="button"
                accessibilityLabel={`Photo ${index + 1}, hold to remove`}
            >
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
            </Pressable>
        ),
        [confirmRemovePhoto]
    )

    return (
        <Box className="min-h-32 justify-center bg-black px-4 pb-2 pt-3">
            <HStack className="min-h-[76px] items-center gap-3">
                <Box className="min-h-[76px] flex-1 justify-center">
                    {photos.length > 0 ? (
                        <FlatList
                            ref={listRef}
                            data={photos}
                            keyExtractor={(item) => item.id}
                            renderItem={renderPhoto}
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            contentContainerStyle={styles.sliderContent}
                            ItemSeparatorComponent={() => (
                                <Box style={{ width: THUMB_GAP }} />
                            )}
                        />
                    ) : (
                        <Text className="text-sm text-white/45">
                            Captured photos appear here
                        </Text>
                    )}
                </Box>

                <Box
                    style={styles.captureSlot}
                    className="items-center justify-center"
                >
                    <CaptureButton
                        isCapturing={isCapturing}
                        disabled={!studentId}
                        onPress={() => void capturePhoto()}
                    />
                </Box>
            </HStack>
        </Box>
    )
}

export default ScanDocumentsCameraFooter

const styles = StyleSheet.create({
    sliderContent: {
        alignItems: "center",
        paddingRight: 4,
    },
    captureSlot: {
        width: CAPTURE_BUTTON_WIDTH,
        flexShrink: 0,
    },
    thumb: {
        width: THUMB_SIZE,
        height: THUMB_SIZE,
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

import { Image } from "expo-image"
import type { ReactNode } from "react"
import { ActivityIndicator, StyleSheet, type ViewStyle } from "react-native"

import { Box } from "@/components/ui/box"
import { Button, ButtonText } from "@/components/ui/button"
import { Text } from "@/components/ui/text"
import type { PhotoUploadEntry } from "@/store/photo-upload"

type GalleryPhotoTileProps = {
    uri: string
    pageLabel?: string
    style?: ViewStyle
    imageStyle?: ViewStyle
    contentFit?: "cover" | "contain"
    footer?: ReactNode
    uploadStatus: PhotoUploadEntry
    onRetry?: () => void
    retrying?: boolean
}

export function GalleryPhotoTile({
    uri,
    pageLabel,
    style,
    imageStyle,
    contentFit = "cover",
    footer,
    uploadStatus,
    onRetry,
    retrying = false,
}: GalleryPhotoTileProps) {
    const isUploading = uploadStatus.status === "uploading"
    const isError = uploadStatus.status === "error"
    const progress =
        uploadStatus.status === "uploading" ? uploadStatus.progress : 0

    return (
        <Box
            className={`overflow-hidden rounded-xl bg-background-0 ${
                isError
                    ? "border-2 border-error-500"
                    : "border border-outline-200"
            }`}
            style={style}
        >
            <Box style={imageStyle ?? style} className="relative">
                <Image
                    source={{ uri }}
                    style={StyleSheet.absoluteFill}
                    contentFit={contentFit}
                />

                {isUploading ? (
                    <Box
                        style={StyleSheet.absoluteFill}
                        className="items-center justify-center bg-black/55"
                    >
                        <ActivityIndicator color="#ffffff" size="large" />
                        <Text className="mt-2 text-base font-bold text-white">
                            {progress}%
                        </Text>
                        <Box className="absolute bottom-0 left-0 right-0 h-1 bg-white/25">
                            <Box
                                className="h-full bg-primary-400"
                                style={{ width: `${progress}%` }}
                            />
                        </Box>
                    </Box>
                ) : null}

                {isError ? (
                    <Box
                        style={StyleSheet.absoluteFill}
                        className="items-center justify-center bg-error-500/15 px-3"
                    >
                        <Text
                            className="text-center text-xs font-medium text-error-700"
                            numberOfLines={4}
                        >
                            {uploadStatus.message}
                        </Text>
                        {onRetry ? (
                            <Button
                                size="sm"
                                variant="outline"
                                action="negative"
                                onPress={onRetry}
                                isDisabled={retrying}
                                className="mt-3 min-w-[88px] border-error-500"
                            >
                                {retrying ? (
                                    <ActivityIndicator color="#dc2626" />
                                ) : (
                                    <ButtonText className="text-error-600">
                                        Retry
                                    </ButtonText>
                                )}
                            </Button>
                        ) : null}
                    </Box>
                ) : null}

                {pageLabel && !isError ? (
                    <Box style={styles.pageBadge}>
                        <Text className="text-[10px] font-bold text-white">
                            {pageLabel}
                        </Text>
                    </Box>
                ) : null}
            </Box>

            {footer}
        </Box>
    )
}

const styles = StyleSheet.create({
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

import { useIsFocused } from "@react-navigation/native"
import { useEffect } from "react"
import {
    ActivityIndicator,
    Pressable,
    StyleSheet,
    View,
} from "react-native"
import {
    Camera,
    useCameraDevice,
    useCameraPermission,
} from "react-native-vision-camera"

import { Box } from "@/components/ui/box"
import { Text } from "@/components/ui/text"
import { useScanDocumentsCameraSession } from "@/components/scan-documents/camera/camera-session-context"
import { getPreviewAspectRatio } from "@/lib/scan-documents/camera-capture"
import { useScanDocumentsStore } from "@/store/scan-documents"

const ScanDocumentsCameraPreview = () => {
    const isFocused = useIsFocused()
    const { photoOutput, isCapturing } = useScanDocumentsCameraSession()
    const { hasPermission, requestPermission } = useCameraPermission()
    const device = useCameraDevice("back")
    const captureSize = useScanDocumentsStore(
        (s) => s.cameraSettings.captureSize
    )
    const previewAspect = getPreviewAspectRatio(captureSize)

    useEffect(() => {
        if (!hasPermission) {
            void requestPermission()
        }
    }, [hasPermission, requestPermission])

    if (!hasPermission) {
        return (
            <Box className="flex-1 items-center justify-center bg-black px-6">
                <Text className="mb-4 text-center text-base text-white">
                    Camera access is required to scan documents.
                </Text>
                <Pressable
                    onPress={() => void requestPermission()}
                    className="rounded-full bg-white px-5 py-2.5"
                    accessibilityRole="button"
                    accessibilityLabel="Grant camera permission"
                >
                    <Text className="text-sm font-semibold text-black">
                        Allow camera
                    </Text>
                </Pressable>
            </Box>
        )
    }

    if (!device) {
        return (
            <Box className="flex-1 items-center justify-center bg-black">
                <ActivityIndicator color="#ffffff" />
                <Text className="mt-3 text-sm text-white/80">
                    Loading camera…
                </Text>
            </Box>
        )
    }

    return (
        <Box className="flex-1 items-center justify-center bg-black">
            <Box
                className="w-full overflow-hidden"
                style={{ aspectRatio: previewAspect, maxHeight: "100%" }}
            >
                <Camera
                    style={StyleSheet.absoluteFill}
                    device={device}
                    isActive={isFocused}
                    outputs={[photoOutput]}
                    orientationSource="interface"
                    resizeMode="cover"
                    enableNativeTapToFocusGesture={!isCapturing}
                    enableNativeZoomGesture={!isCapturing}
                />
                {isCapturing ? (
                    <View
                        style={styles.freezeOverlay}
                        pointerEvents="box-only"
                    />
                ) : null}
            </Box>
        </Box>
    )
}

export default ScanDocumentsCameraPreview

const styles = StyleSheet.create({
    freezeOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: "rgba(255, 255, 255, 0.22)",
    },
})

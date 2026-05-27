import { useRouter } from "expo-router"
import { Ratio, X } from "lucide-react-native"
import { useCallback } from "react"
import { Alert, Pressable, StyleSheet } from "react-native"

import { Box } from "@/components/ui/box"
import { HStack } from "@/components/ui/hstack"
import { Text } from "@/components/ui/text"
import { useScanDocumentsStore } from "@/store/scan-documents"
import type { CameraCaptureSize } from "@/types/scan-documents"

const CAPTURE_SIZE_OPTIONS: {
    value: CameraCaptureSize
    label: string
}[] = [
    { value: "4:3", label: "4:3" },
    { value: "16:9", label: "16:9" },
    { value: "1:1", label: "1:1" },
]

const iconButtonStyle = (pressed: boolean) => [
    styles.iconButton,
    pressed && styles.iconButtonPressed,
]

const ScanDocumentsCameraHeader = () => {
    const router = useRouter()
    const captureSize = useScanDocumentsStore(
        (s) => s.cameraSettings.captureSize
    )
    const setCameraSettings = useScanDocumentsStore((s) => s.setCameraSettings)

    const openCaptureSizePicker = useCallback(() => {
        Alert.alert(
            "Capture size",
            "Choose aspect ratio",
            [
                ...CAPTURE_SIZE_OPTIONS.map((option) => ({
                    text: option.label,
                    onPress: () =>
                        setCameraSettings({ captureSize: option.value }),
                })),
                { text: "Cancel", style: "cancel" },
            ],
            { cancelable: true }
        )
    }, [setCameraSettings])

    return (
        <Box className="min-h-14 justify-center bg-black px-4">
            <HStack className="h-14 items-center justify-between">
                <HStack className="min-w-[88px] items-center">
                    <Pressable
                        onPress={() => router.back()}
                        style={({ pressed }) => iconButtonStyle(pressed)}
                        accessibilityRole="button"
                        accessibilityLabel="Close camera"
                    >
                        <X size={24} color="#ffffff" />
                    </Pressable>
                </HStack>

                <Box className="flex-1" />

                <HStack className="min-w-[88px] items-center justify-end">
                    <Pressable
                        onPress={openCaptureSizePicker}
                        style={({ pressed }) => iconButtonStyle(pressed)}
                        accessibilityRole="button"
                        accessibilityLabel={`Capture size ${captureSize}`}
                    >
                        <HStack className="items-center gap-1">
                            <Ratio size={22} color="#ffffff" />
                            <Text className="text-xs font-medium text-white">
                                {captureSize}
                            </Text>
                        </HStack>
                    </Pressable>
                </HStack>
            </HStack>
        </Box>
    )
}

export default ScanDocumentsCameraHeader

const styles = StyleSheet.create({
    iconButton: {
        height: 40,
        width: 40,
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 9999,
    },
    iconButtonPressed: {
        backgroundColor: "rgba(255, 255, 255, 0.12)",
    },
})

import { useRouter } from "expo-router"
import { Ratio, X } from "lucide-react-native"
import { useCallback } from "react"
import { Alert } from "react-native"

import { Box } from "@/components/ui/box"
import { HStack } from "@/components/ui/hstack"
import { Text } from "@/components/ui/text"
import {
    HEADER_ICON_BUTTON_SIZE,
    HEADER_ICON_SIZE,
    HEADER_ICON_SIZE_LARGE,
    HeaderIconButton,
} from "@/components/scan-documents/header/header-icon-button"
import { useScanDocumentsStore } from "@/store/scan-documents"
import type { CameraCaptureSize } from "@/types/scan-documents"

const CAPTURE_SIZE_OPTIONS: {
    value: CameraCaptureSize
    label: string
}[] = [
    { value: "4:3", label: "Portrait 4:3" },
    { value: "16:9", label: "Portrait 16:9" },
    { value: "1:1", label: "Square" },
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

    const sideWidth = HEADER_ICON_BUTTON_SIZE + 52

    return (
        <Box className="min-h-14 justify-center bg-black px-3">
            <HStack className="h-14 items-center justify-between">
                <Box style={{ minWidth: sideWidth }}>
                    <HeaderIconButton
                        onPress={() => router.back()}
                        accessibilityLabel="Close camera"
                        variant="onDark"
                    >
                        <X size={HEADER_ICON_SIZE_LARGE} color="#ffffff" />
                    </HeaderIconButton>
                </Box>

                <Box className="flex-1" />

                <Box style={{ minWidth: sideWidth, alignItems: "flex-end" }}>
                    <HeaderIconButton
                        onPress={openCaptureSizePicker}
                        accessibilityLabel={`Capture size ${captureSize}`}
                        variant="onDark"
                        style={{ width: sideWidth - 8 }}
                    >
                        <HStack className="items-center gap-1.5">
                            <Ratio size={HEADER_ICON_SIZE} color="#ffffff" />
                            <Text className="text-sm font-medium text-white">
                                {captureSize}
                            </Text>
                        </HStack>
                    </HeaderIconButton>
                </Box>
            </HStack>
        </Box>
    )
}

export default ScanDocumentsCameraHeader

import { CommonResolutions } from "react-native-vision-camera"
import type { Size } from "react-native-vision-camera"

import type { CameraCaptureSize } from "@/types/scan-documents"

export function captureSizeToResolution(
    captureSize: CameraCaptureSize
): Size {
    switch (captureSize) {
        case "16:9":
            return CommonResolutions.UHD_16_9
        case "1:1":
            return CommonResolutions.UHD_4_3
        case "4:3":
        default:
            return CommonResolutions.UHD_4_3
    }
}

export function toCaptureFileUri(filePath: string): string {
    return filePath.startsWith("file://") ? filePath : `file://${filePath}`
}

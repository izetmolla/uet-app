import { CommonResolutions } from "react-native-vision-camera"
import type { Size } from "react-native-vision-camera"

import type { CameraCaptureSize } from "@/types/scan-documents"

/** Width / height for portrait document framing in the UI. */
export const PORTRAIT_PREVIEW_ASPECT = 3 / 4

export const PHOTO_CAPTURE_QUALITY = {
    quality: 1,
    qualityPrioritization: "quality" as const,
}

const PREVIEW_ASPECT: Record<CameraCaptureSize, number> = {
    "4:3": PORTRAIT_PREVIEW_ASPECT,
    "16:9": 9 / 16,
    "1:1": 1,
}

export function getPreviewAspectRatio(captureSize: CameraCaptureSize): number {
    return PREVIEW_ASPECT[captureSize]
}

/** Highest practical portrait-oriented targets; the session negotiates down if needed. */
export function captureSizeToResolution(
    captureSize: CameraCaptureSize
): Size {
    switch (captureSize) {
        case "16:9":
            return CommonResolutions["8k_16_9"]
        case "1:1":
            return CommonResolutions["8k_4_3"]
        case "4:3":
        default:
            return CommonResolutions["8k_4_3"]
    }
}

export function toCaptureFileUri(filePath: string): string {
    return filePath.startsWith("file://") ? filePath : `file://${filePath}`
}

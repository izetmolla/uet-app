import {
    createContext,
    useCallback,
    useContext,
    useMemo,
    useState,
    type ReactNode,
} from "react"
import { Alert } from "react-native"
import {
    usePhotoOutput,
    type CameraPhotoOutput,
} from "react-native-vision-camera"

import {
    captureSizeToResolution,
    toCaptureFileUri,
} from "@/lib/scan-documents/camera-capture"
import { useScanDocumentsStore } from "@/store/scan-documents"
import type { ScanDocumentsPhoto } from "@/types/scan-documents"

type ScanDocumentsCameraSessionContextValue = {
    studentId: string
    photoOutput: CameraPhotoOutput
    photos: ScanDocumentsPhoto[]
    isCapturing: boolean
    capturePhoto: () => Promise<void>
}

const ScanDocumentsCameraSessionContext =
    createContext<ScanDocumentsCameraSessionContextValue | null>(null)

type ScanDocumentsCameraSessionProviderProps = {
    studentId: string
    studentName?: string
    children: ReactNode
}

export function ScanDocumentsCameraSessionProvider({
    studentId,
    studentName,
    children,
}: ScanDocumentsCameraSessionProviderProps) {
    const captureSize = useScanDocumentsStore(
        (s) => s.cameraSettings.captureSize
    )
    const addPhotoToItem = useScanDocumentsStore((s) => s.addPhotoToItem)
    const item = useScanDocumentsStore((s) =>
        studentId ? s.getItem(studentId) : undefined
    )
    const [isCapturing, setIsCapturing] = useState(false)

    const targetResolution = useMemo(
        () => captureSizeToResolution(captureSize),
        [captureSize]
    )

    const photoOutput = usePhotoOutput({
        targetResolution,
        quality: 0.9,
        qualityPrioritization: "balanced",
    })

    const photos = item?.photos ?? []

    const capturePhoto = useCallback(async () => {
        if (!studentId || isCapturing) return

        setIsCapturing(true)
        try {
            const photoFile = await photoOutput.capturePhotoToFile(
                { flashMode: "off" },
                {}
            )
            await addPhotoToItem(
                studentId,
                toCaptureFileUri(photoFile.filePath),
                studentName
            )
        } catch (error) {
            console.error("Failed to capture photo:", error)
            Alert.alert(
                "Capture failed",
                "Could not take a photo. Please try again."
            )
        } finally {
            setIsCapturing(false)
        }
    }, [
        addPhotoToItem,
        isCapturing,
        photoOutput,
        studentId,
        studentName,
    ])

    const value = useMemo(
        () => ({
            studentId,
            photoOutput,
            photos,
            isCapturing,
            capturePhoto,
        }),
        [capturePhoto, isCapturing, photoOutput, photos, studentId]
    )

    return (
        <ScanDocumentsCameraSessionContext.Provider value={value}>
            {children}
        </ScanDocumentsCameraSessionContext.Provider>
    )
}

export function useScanDocumentsCameraSession() {
    const context = useContext(ScanDocumentsCameraSessionContext)
    if (!context) {
        throw new Error(
            "useScanDocumentsCameraSession must be used within ScanDocumentsCameraSessionProvider"
        )
    }
    return context
}

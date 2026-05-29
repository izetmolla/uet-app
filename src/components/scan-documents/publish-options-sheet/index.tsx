import { type Href, useRouter } from "expo-router"
import { FileDown, Images, X } from "lucide-react-native"
import { useCallback } from "react"
import { ActivityIndicator, Alert } from "react-native"

import {
    HEADER_ICON_SIZE_LARGE,
    HeaderIconButton,
} from "@/components/scan-documents/header/header-icon-button"
import { Box } from "@/components/ui/box"
import { Button, ButtonIcon, ButtonText } from "@/components/ui/button"
import { HStack } from "@/components/ui/hstack"
import { VStack } from "@/components/ui/vstack"
import { useUploadPdf } from "@/hooks/upload-pdf"
import { useUploadPhotos } from "@/hooks/upload-photos"
import { useThemeColors } from "@/hooks/use-theme-colors"
import { getOrderedStudentPhotos } from "@/lib/scan-documents/ordered-photos"
import type { ScanDocumentsPhoto } from "@/types/scan-documents"

type PublishOptionsSheetProps = {
    title: string
    studentId: string
    folderId?: string
    photos: ScanDocumentsPhoto[]
}

export function PublishOptionsSheet({
    title,
    studentId,
    folderId,
    photos,
}: PublishOptionsSheetProps) {
    const router = useRouter()
    const colors = useThemeColors()
    const { uploadPhotos } = useUploadPhotos({
        studentId,
        folderId,
    })
    const { uploadPdfFromPhotos, uploadSummary: pdfUploadSummary } =
        useUploadPdf({
            studentId,
            folderId,
        })

    const close = useCallback(() => {
        router.back()
    }, [router])

    const ensureHasPhotos = useCallback(() => {
        const orderedPhotos = getOrderedStudentPhotos(studentId)
        if (orderedPhotos.length > 0) return true

        Alert.alert(
            "No photos yet",
            "Scan documents for this student before publishing."
        )
        return false
    }, [studentId])

    const handlePublishPdf = useCallback(() => {
        if (!ensureHasPhotos() || pdfUploadSummary.isActive) return

        const started = uploadPdfFromPhotos(photos, title)
        if (!started) {
            Alert.alert(
                "Upload failed",
                "Could not start PDF generation. Please try again."
            )
            return
        }

        close()
        const pdfHref =
            `/scan-documents/students/${folderId ?? ""}/${studentId}/pdf?student_name=${encodeURIComponent(title)}` as Href
        router.push(pdfHref)
    }, [
        close,
        ensureHasPhotos,
        folderId,
        pdfUploadSummary.isActive,
        photos,
        router,
        studentId,
        title,
        uploadPdfFromPhotos,
    ])

    const handlePublishPhotos = useCallback(() => {
        if (!ensureHasPhotos()) return

        const started = uploadPhotos(photos)
        if (started) {
            close()
        }
    }, [close, ensureHasPhotos, photos, uploadPhotos])

    const busy = pdfUploadSummary.isActive

    return (
        <Box className="flex-1 bg-background-0">
            <HStack className="h-14 items-center px-3">
                <HeaderIconButton
                    onPress={close}
                    accessibilityLabel="Close"
                >
                    <X size={HEADER_ICON_SIZE_LARGE} color={colors.primary} />
                </HeaderIconButton>
            </HStack>

            <VStack className="flex-1 justify-center gap-4 px-6 pb-8">
                <Button
                    size="lg"
                    action="primary"
                    onPress={handlePublishPdf}
                    isDisabled={busy}
                    className="min-h-14 bg-primary-500"
                >
                    {busy ? (
                        <ActivityIndicator color="#ffffff" />
                    ) : (
                        <>
                            <ButtonIcon
                                as={FileDown}
                                className="text-white"
                            />
                            <ButtonText>Publish as PDF</ButtonText>
                        </>
                    )}
                </Button>

                <Button
                    size="lg"
                    variant="outline"
                    action="secondary"
                    onPress={handlePublishPhotos}
                    isDisabled={busy}
                    className="min-h-14"
                >
                    <>
                        <ButtonIcon as={Images} />
                        <ButtonText>Publish photos</ButtonText>
                    </>
                </Button>
            </VStack>
        </Box>
    )
}

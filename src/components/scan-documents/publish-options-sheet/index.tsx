import { useRouter } from "expo-router"
import { FileDown, Images, X } from "lucide-react-native"
import { useCallback, useState } from "react"
import { ActivityIndicator, Alert } from "react-native"

import {
    HEADER_ICON_SIZE_LARGE,
    HeaderIconButton,
} from "@/components/scan-documents/header/header-icon-button"
import { Box } from "@/components/ui/box"
import { Button, ButtonIcon, ButtonText } from "@/components/ui/button"
import { HStack } from "@/components/ui/hstack"
import { VStack } from "@/components/ui/vstack"
import { useUploadPhotos } from "@/hooks/upload-photos"
import { useThemeColors } from "@/hooks/use-theme-colors"
import { exportCollectionToPdf } from "@/lib/camscan/export-collection-pdf"
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
    const [exportingPdf, setExportingPdf] = useState(false)
    const { uploadPhotos } = useUploadPhotos({
        studentId,
        folderId,
    })

    const close = useCallback(() => {
        router.back()
    }, [router])

    const ensureHasPhotos = useCallback(() => {
        if (photos.length > 0) return true

        Alert.alert(
            "No photos yet",
            "Scan documents for this student before publishing."
        )
        return false
    }, [photos.length])

    const handlePublishPdf = useCallback(async () => {
        if (!ensureHasPhotos() || exportingPdf) return

        setExportingPdf(true)
        try {
            await exportCollectionToPdf(photos, title)
        } catch {
            Alert.alert(
                "Export failed",
                "Could not create the PDF. Please try again."
            )
        } finally {
            setExportingPdf(false)
        }
    }, [ensureHasPhotos, exportingPdf, photos, title])

    const handlePublishPhotos = useCallback(() => {
        if (!ensureHasPhotos()) return

        const started = uploadPhotos(photos)
        if (started) {
            close()
        }
    }, [close, ensureHasPhotos, photos, uploadPhotos])

    const busy = exportingPdf

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
                    {exportingPdf ? (
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

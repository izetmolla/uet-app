import { type Href, useRouter } from "expo-router"
import { Eye, FileText, Plus } from "lucide-react-native"
import { useCallback } from "react"
import { Alert, FlatList, Pressable, type ListRenderItem } from "react-native"

import { HeaderIconButton } from "@/components/scan-documents/header/header-icon-button"
import { PdfUploadProgressOverlay } from "@/components/scan-documents/pdf-upload-progress-overlay"
import { Box } from "@/components/ui/box"
import { Button, ButtonIcon, ButtonText } from "@/components/ui/button"
import { Heading } from "@/components/ui/heading"
import { HStack } from "@/components/ui/hstack"
import { Text } from "@/components/ui/text"
import { VStack } from "@/components/ui/vstack"
import { useUploadPdf } from "@/hooks/upload-pdf"
import { useThemeColors } from "@/hooks/use-theme-colors"
import { usePdfUploadStore } from "@/store/pdf-upload"
import { getOrderedStudentPhotos } from "@/lib/scan-documents/ordered-photos"
import type { ScanDocumentsPdf } from "@/types/scan-documents"

type StudentPdfsListProps = {
    studentId: string
    folderId?: string
    studentName: string
}

function formatDate(iso: string) {
    try {
        return new Date(iso).toLocaleString(undefined, {
            dateStyle: "medium",
            timeStyle: "short",
        })
    } catch {
        return iso
    }
}

function PdfRow({
    pdf,
    uploadLabel,
    onPreview,
}: {
    pdf: ScanDocumentsPdf
    uploadLabel?: string
    onPreview: () => void
}) {
    const colors = useThemeColors()

    return (
        <HStack className="items-center gap-3 rounded-2xl border border-outline-200 bg-background-0 px-4 py-3 shadow-sm">
            <Pressable
                onPress={onPreview}
                className="min-w-0 flex-1 active:opacity-80"
                accessibilityRole="button"
                accessibilityLabel={`Preview ${pdf.title}`}
            >
                <HStack className="items-center gap-3">
                    <Box className="rounded-xl bg-primary-100 p-3">
                        <FileText size={22} color={colors.primary} />
                    </Box>

                    <VStack className="min-w-0 flex-1 gap-0.5">
                        <Text
                            className="text-base font-semibold text-typography-900"
                            numberOfLines={2}
                        >
                            {pdf.title}
                        </Text>
                        <Text className="text-xs text-typography-500">
                            {pdf.pageCount} page
                            {pdf.pageCount === 1 ? "" : "s"} ·{" "}
                            {formatDate(pdf.createdAt)}
                        </Text>
                        {uploadLabel ? (
                            <Text className="text-[11px] font-medium text-primary-600">
                                {uploadLabel}
                            </Text>
                        ) : null}
                    </VStack>
                </HStack>
            </Pressable>

            <HeaderIconButton
                onPress={onPreview}
                accessibilityLabel={`Preview ${pdf.title}`}
            >
                <Eye size={22} color={colors.primary} />
            </HeaderIconButton>
        </HStack>
    )
}

export function StudentPdfsList({
    studentId,
    folderId,
    studentName,
}: StudentPdfsListProps) {
    const router = useRouter()
    const colors = useThemeColors()
    const uploadSession = usePdfUploadStore((s) => s.sessions[studentId])

    const { pdfs, uploadPdfFromPhotos, getPdfUploadStatus, uploadSummary } =
        useUploadPdf({ studentId, folderId })

    const handleGenerateAndUpload = useCallback(() => {
        const photos = getOrderedStudentPhotos(studentId)

        if (photos.length === 0) {
            Alert.alert(
                "No photos yet",
                "Scan documents for this student before generating a PDF."
            )
            return
        }

        if (uploadSummary.isActive) {
            Alert.alert(
                "Upload in progress",
                "Wait for the current PDF upload to finish."
            )
            return
        }

        const started = uploadPdfFromPhotos(photos, studentName)
        if (!started) {
            Alert.alert("Could not start", "PDF generation could not begin.")
        }
    }, [studentId, studentName, uploadPdfFromPhotos, uploadSummary.isActive])

    const openPdfPreview = useCallback(
        (pdf: ScanDocumentsPdf) => {
            router.push({
                pathname:
                    "/scan-documents/students/[folder_id]/[student_id]/pdf-preview",
                params: {
                    folder_id: folderId ?? "",
                    student_id: studentId,
                    pdf_id: pdf.id,
                    pdf_title: pdf.title,
                },
            } as Href)
        },
        [folderId, router, studentId]
    )

    const renderPdf: ListRenderItem<ScanDocumentsPdf> = ({ item }) => {
        const status = getPdfUploadStatus(item.id)
        const uploadLabel =
            status.status === "uploading"
                ? status.phase === "generating"
                    ? "Generating…"
                    : `Uploading ${status.progress}%`
                : status.status === "success"
                  ? "Uploaded"
                  : status.status === "error"
                    ? "Upload failed"
                    : undefined

        return (
            <PdfRow
                pdf={item}
                uploadLabel={uploadLabel}
                onPreview={() => openPdfPreview(item)}
            />
        )
    }

    const listHeader = (
        <VStack className="gap-3 pb-3">
            <Box className="-mx-4 -mt-4">
                <PdfUploadProgressOverlay
                    studentId={studentId}
                    folderId={folderId}
                />
            </Box>

            <Button
                size="md"
                action="primary"
                onPress={handleGenerateAndUpload}
                isDisabled={uploadSummary.isActive}
                className="bg-primary-500"
            >
                <ButtonIcon as={Plus} className="text-white" />
                <ButtonText>Generate & upload PDF</ButtonText>
            </Button>

            {pdfs.length > 0 ? (
                <Text size="sm" className="text-typography-500">
                    {pdfs.length} PDF{pdfs.length === 1 ? "" : "s"}
                </Text>
            ) : null}
        </VStack>
    )

    if (pdfs.length === 0 && !uploadSummary.hasVisibleSession) {
        return (
            <Box className="flex-1 bg-background-50 px-4 pt-4">
                {listHeader}
                <VStack className="flex-1 items-center justify-center py-16">
                    <Box className="mb-4 rounded-full bg-background-muted p-5">
                        <FileText size={28} color={colors.mutedForeground} />
                    </Box>
                    <Heading
                        size="md"
                        className="text-center text-typography-900"
                    >
                        No PDFs yet
                    </Heading>
                    <Text className="mt-2 px-6 text-center text-typography-500">
                        Generate a PDF from scanned photos and upload it to the
                        server.
                    </Text>
                    <Button
                        size="md"
                        variant="outline"
                        action="secondary"
                        onPress={() =>
                            router.push({
                                pathname:
                                    "/scan-documents/students/camera",
                                params: {
                                    folder_id: folderId,
                                    student_id: studentId,
                                    student_name: studentName,
                                },
                            } as Href)
                        }
                        className="mt-6"
                    >
                        <ButtonText>Open camera</ButtonText>
                    </Button>
                </VStack>
            </Box>
        )
    }

    return (
        <FlatList
            data={pdfs}
            keyExtractor={(item) => item.id}
            renderItem={renderPdf}
            ListHeaderComponent={listHeader}
            extraData={{ uploadSession }}
            contentContainerStyle={{ padding: 16, paddingBottom: 24, gap: 12 }}
            showsVerticalScrollIndicator={false}
            style={{ flex: 1, backgroundColor: "transparent" }}
        />
    )
}

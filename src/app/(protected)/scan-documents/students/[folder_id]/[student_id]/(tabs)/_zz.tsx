import { EmptyCollection } from "@/components/scan-documents/emptycollection"
import { getRouteParam } from "@/components/scan-documents/student-tab-shell"
import { SinglePhoto } from "@/components/scan-documents/singlephoto"
import { type Href, useLocalSearchParams, useRouter } from "expo-router"
import { Plus, Trash2 } from "lucide-react-native"
import { useCallback, useEffect, useState } from "react"
import { ActivityIndicator, Alert, FlatList } from "react-native"

import { AppHeader } from "@/components/navigation/app-header"
import {
    ScreenContentSafeArea,
    ScreenSafeArea,
} from "@/components/navigation/screen-safe-area"
import { Button, ButtonIcon, ButtonText } from "@/components/ui/button"
import { Input, InputField } from "@/components/ui/input"
import { Text } from "@/components/ui/text"
import { VStack } from "@/components/ui/vstack"
import { exportCollectionToPdf } from "@/lib/camscan/export-collection-pdf"
import { scanDocuments } from "@/lib/camscan/scanner"
import { useCamscanStore } from "@/store/camscan-store"
import type { CamscanPhoto } from "@/types/camscan"

export default function CamscanEditScreen() {
    const { student_id, student_name } = useLocalSearchParams<{
        student_id: string
        student_name?: string | string[]
    }>()
    const router = useRouter()
    const item = useCamscanStore((s) => s.getItem(student_id))
    const updateItemTitle = useCamscanStore((s) => s.updateItemTitle)
    const reorderPhotos = useCamscanStore((s) => s.reorderPhotos)
    const deletePhoto = useCamscanStore((s) => s.deletePhoto)
    const addPhotosToItem = useCamscanStore((s) => s.addPhotosToItem)
    const createItemFromScan = useCamscanStore((s) => s.createItemFromScan)
    const deleteItem = useCamscanStore((s) => s.deleteItem)

    const [title, setTitle] = useState("")
    const [adding, setAdding] = useState(false)
    const [exportingPdf, setExportingPdf] = useState(false)

    const headerTitle = getRouteParam(student_name) ?? "Student"

    const openSettings = useCallback(() => {
        router.push({
            pathname: "/scan-documents/students/settings",
            params: { student_name: getRouteParam(student_name) },
        } as Href)
    }, [router, student_name])

    const handleExportPdf = useCallback(async () => {
        if (!item?.photos.length) {
            Alert.alert(
                "Nothing to export",
                "Add at least one scanned page before creating a PDF."
            )
            return
        }

        setExportingPdf(true)
        try {
            await exportCollectionToPdf(
                item.photos,
                title.trim() || headerTitle
            )
        } catch {
            Alert.alert(
                "Export failed",
                "Could not create the PDF. Please try again."
            )
        } finally {
            setExportingPdf(false)
        }
    }, [headerTitle, item?.photos, title])

    useEffect(() => {
        if (item) {
            setTitle(item.title)
        }
    }, [item])

    const saveTitle = useCallback(() => {
        if (!student_id || !title.trim()) return
        updateItemTitle(student_id, title)
    }, [student_id, title, updateItemTitle])

    const handleAddPages = async () => {
        if (!student_id) return

        setAdding(true)
        try {
            const images = await scanDocuments()
            if (images.length > 0) {
                await addPhotosToItem(student_id, images)
            }
        } catch {
            Alert.alert("Scan failed", "Could not add new pages.")
        } finally {
            setAdding(false)
        }
    }

    const handleStartScan = async () => {
        if (!student_id) return

        setAdding(true)
        try {
            const images = await scanDocuments()
            if (images.length > 0) {
                await createItemFromScan(
                    images,
                    headerTitle,
                    student_id
                )
            }
        } catch {
            Alert.alert("Scan failed", "Could not start scanning.")
        } finally {
            setAdding(false)
        }
    }

    const confirmDeletePhoto = (photo: CamscanPhoto) => {
        if (!student_id) return

        Alert.alert("Remove photo", "Delete this page from the collection?", [
            { text: "Cancel", style: "cancel" },
            {
                text: "Delete",
                style: "destructive",
                onPress: () => deletePhoto(student_id, photo.id),
            },
        ])
    }

    const confirmDeleteItem = () => {
        if (!student_id || !item) return

        Alert.alert(
            "Delete collection",
            `Remove "${item.title}" and all photos?`,
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Delete",
                    style: "destructive",
                    onPress: async () => {
                        await deleteItem(student_id)
                        router.replace("/camscan/library" as Href)
                    },
                },
            ]
        )
    }

    if (!item) {
        return (
            <ScreenSafeArea>
                <AppHeader
                    title={headerTitle}
                    showBack
                    showMenu={false}
                    showSearch={false}
                    showSettings
                    showNotifications={false}
                    onSettingsPress={openSettings}
                    onExportPdfPress={handleExportPdf}
                    exportPdfDisabled={exportingPdf}
                />
                <ScreenContentSafeArea>
                    <EmptyCollection
                        onScanPress={handleStartScan}
                        scanning={adding}
                        onGoBack={() => router.back()}
                    />
                </ScreenContentSafeArea>
            </ScreenSafeArea>
        )
    }

    return (
        <ScreenSafeArea>
            <AppHeader
                title={headerTitle}
                showBack
                showMenu={false}
                showSearch={false}
                showSettings
                showNotifications={false}
                onSettingsPress={openSettings}
                onExportPdfPress={handleExportPdf}
                exportPdfDisabled={exportingPdf || item.photos.length === 0}
            />
            <ScreenContentSafeArea>
                <FlatList
                    className="flex-1 bg-background-50"
                    data={item.photos}
                    keyExtractor={(photo) => photo.id}
                    renderItem={({ item: photo, index }) => (
                        <SinglePhoto
                            photo={photo}
                            index={index}
                            photoCount={item.photos.length}
                            onMoveUp={() =>
                                student_id &&
                                reorderPhotos(student_id, index, index - 1)
                            }
                            onMoveDown={() =>
                                student_id &&
                                reorderPhotos(student_id, index, index + 1)
                            }
                            onDelete={() => confirmDeletePhoto(photo)}
                        />
                    )}
                    contentContainerClassName="p-4 pb-8"
                    ListHeaderComponent={
                        <VStack className="mb-4 gap-4">
                            <VStack space="xs">
                                <Text size="sm" className="text-typography-500">
                                    Title
                                </Text>
                                <Input variant="outline" size="md">
                                    <InputField
                                        value={title}
                                        onChangeText={setTitle}
                                        onBlur={saveTitle}
                                        returnKeyType="done"
                                        onSubmitEditing={saveTitle}
                                    />
                                </Input>
                            </VStack>

                            <Button
                                size="md"
                                action="primary"
                                onPress={handleAddPages}
                                isDisabled={adding}
                                className="bg-primary-500"
                            >
                                {adding ? (
                                    <ActivityIndicator color="#ffffff" />
                                ) : (
                                    <>
                                        <ButtonIcon as={Plus} className="text-white" />
                                        <ButtonText>Add pages</ButtonText>
                                    </>
                                )}
                            </Button>

                            <Text size="sm" className="text-typography-400">
                                Reorder with arrows, or remove individual pages.
                            </Text>
                        </VStack>
                    }
                    ListEmptyComponent={
                        <VStack className="items-center py-8">
                            <Text className="text-typography-500">
                                No pages in this collection.
                            </Text>
                            <Button
                                variant="outline"
                                className="mt-4"
                                onPress={handleAddPages}
                                isDisabled={adding}
                            >
                                <ButtonText>Scan pages</ButtonText>
                            </Button>
                        </VStack>
                    }
                    ListFooterComponent={
                        <Button
                            variant="outline"
                            action="negative"
                            className="mt-4 border-error-300"
                            onPress={confirmDeleteItem}
                        >
                            <ButtonIcon as={Trash2} className="text-error-600" />
                            <ButtonText className="text-error-600">
                                Delete collection
                            </ButtonText>
                        </Button>
                    }
                />
            </ScreenContentSafeArea>
        </ScreenSafeArea>
    )
}

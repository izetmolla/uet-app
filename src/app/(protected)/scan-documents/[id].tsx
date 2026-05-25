import { Image } from "expo-image"
import { type Href, useLocalSearchParams, useRouter } from "expo-router"
import { ArrowDown, ArrowUp, Plus, Trash2 } from "lucide-react-native"
import { useCallback, useEffect, useState } from "react"
import { ActivityIndicator, Alert, FlatList, Pressable } from "react-native"

import { AppHeader } from "@/components/navigation/app-header"
import {
    ScreenContentSafeArea,
    ScreenSafeArea,
} from "@/components/navigation/screen-safe-area"
import { Box } from "@/components/ui/box"
import { Button, ButtonIcon, ButtonText } from "@/components/ui/button"
import { HStack } from "@/components/ui/hstack"
import { Input, InputField } from "@/components/ui/input"
import { Text } from "@/components/ui/text"
import { VStack } from "@/components/ui/vstack"
import { scanDocuments } from "@/lib/camscan/scanner"
import { useCamscanStore } from "@/store/camscan-store"
import type { CamscanPhoto } from "@/types/camscan"

export default function CamscanEditScreen() {
    const { id } = useLocalSearchParams<{ id: string }>()
    const router = useRouter()
    const item = useCamscanStore((s) => s.getItem(id ?? ""))
    const updateItemTitle = useCamscanStore((s) => s.updateItemTitle)
    const reorderPhotos = useCamscanStore((s) => s.reorderPhotos)
    const deletePhoto = useCamscanStore((s) => s.deletePhoto)
    const addPhotosToItem = useCamscanStore((s) => s.addPhotosToItem)
    const deleteItem = useCamscanStore((s) => s.deleteItem)

    const [title, setTitle] = useState("")
    const [adding, setAdding] = useState(false)

    useEffect(() => {
        if (item) {
            setTitle(item.title)
        }
    }, [item])

    const saveTitle = useCallback(() => {
        if (!id || !title.trim()) return
        updateItemTitle(id, title)
    }, [id, title, updateItemTitle])

    const handleAddPages = async () => {
        if (!id) return

        setAdding(true)
        try {
            const images = await scanDocuments()
            if (images.length > 0) {
                await addPhotosToItem(id, images)
            }
        } catch {
            Alert.alert("Scan failed", "Could not add new pages.")
        } finally {
            setAdding(false)
        }
    }

    const confirmDeletePhoto = (photo: CamscanPhoto) => {
        if (!id) return

        Alert.alert("Remove photo", "Delete this page from the collection?", [
            { text: "Cancel", style: "cancel" },
            {
                text: "Delete",
                style: "destructive",
                onPress: () => deletePhoto(id, photo.id),
            },
        ])
    }

    const confirmDeleteItem = () => {
        if (!id || !item) return

        Alert.alert(
            "Delete collection",
            `Remove "${item.title}" and all photos?`,
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Delete",
                    style: "destructive",
                    onPress: async () => {
                        await deleteItem(id)
                        router.replace("/scan-documents/library" as Href)
                    },
                },
            ]
        )
    }

    if (!item) {
        return (
            <ScreenSafeArea>
                <AppHeader
                    title="Edit collection"
                    showBack
                    showMenu={false}
                    showSearch={false}
                    showNotifications={false}
                />
                <ScreenContentSafeArea>
                    <Box className="flex-1 items-center justify-center bg-background-50">
                        <Text className="text-typography-500">
                            Collection not found
                        </Text>
                        <Button
                            variant="link"
                            onPress={() => router.back()}
                            className="mt-4"
                        >
                            <ButtonText>Go back</ButtonText>
                        </Button>
                    </Box>
                </ScreenContentSafeArea>
            </ScreenSafeArea>
        )
    }

    const renderPhoto = ({
        item: photo,
        index,
    }: {
        item: CamscanPhoto
        index: number
    }) => (
        <Box className="mb-3 overflow-hidden rounded-xl border border-outline-200 bg-background-0">
            <Image
                source={{ uri: photo.uri }}
                style={{ width: "100%", height: 220 }}
                contentFit="contain"
            />
            <HStack className="items-center justify-between border-t border-outline-100 px-3 py-2">
                <Text size="sm" className="text-typography-500">
                    Page {index + 1}
                </Text>
                <HStack className="items-center gap-1">
                    <Pressable
                        onPress={() =>
                            id && reorderPhotos(id, index, index - 1)
                        }
                        disabled={index === 0}
                        className="p-2 opacity-100 disabled:opacity-30"
                        accessibilityLabel="Move up"
                    >
                        <ArrowUp size={20} color="#5358ee" />
                    </Pressable>
                    <Pressable
                        onPress={() =>
                            id && reorderPhotos(id, index, index + 1)
                        }
                        disabled={index === item.photos.length - 1}
                        className="p-2 opacity-100 disabled:opacity-30"
                        accessibilityLabel="Move down"
                    >
                        <ArrowDown size={20} color="#5358ee" />
                    </Pressable>
                    <Pressable
                        onPress={() => confirmDeletePhoto(photo)}
                        className="p-2"
                        accessibilityLabel="Delete photo"
                    >
                        <Trash2 size={18} color="#dc2626" />
                    </Pressable>
                </HStack>
            </HStack>
        </Box>
    )

    return (
        <ScreenSafeArea>
            <AppHeader
                title="Edit collection"
                showBack
                showMenu={false}
                showSearch={false}
                showNotifications={false}
            />
            <ScreenContentSafeArea>
            <FlatList
                className="flex-1 bg-background-50"
                data={item.photos}
                keyExtractor={(photo) => photo.id}
                renderItem={renderPhoto}
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

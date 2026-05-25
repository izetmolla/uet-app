import { type Href, useRouter } from "expo-router"
import { Alert, FlatList, Pressable } from "react-native"
import { ChevronRight, Trash2 } from "lucide-react-native"
import { Image } from "expo-image"

import { CamscanShell } from "@/components/camscan/camscan-shell"
import { Box } from "@/components/ui/box"
import { Heading } from "@/components/ui/heading"
import { HStack } from "@/components/ui/hstack"
import { Text } from "@/components/ui/text"
import { VStack } from "@/components/ui/vstack"
import { useCamscanStore } from "@/store/camscan-store"
import type { CamscanItem } from "@/types/camscan"

export default function CamscanLibraryScreen() {
    const router = useRouter()
    const items = useCamscanStore((s) => s.items)
    const deleteItem = useCamscanStore((s) => s.deleteItem)

    const confirmDelete = (item: CamscanItem) => {
        Alert.alert(
            "Delete collection",
            `Remove "${item.title}" and all ${item.photos.length} photo(s)?`,
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Delete",
                    style: "destructive",
                    onPress: () => deleteItem(item.id),
                },
            ]
        )
    }

    return (
        <CamscanShell>
            <Box className="flex-1 bg-background-50">
                <FlatList
                    data={items}
                    keyExtractor={(item) => item.id}
                    contentContainerClassName="gap-3 p-4 grow"
                    ListEmptyComponent={
                        <VStack className="flex-1 items-center justify-center px-6 py-16">
                            <Heading
                                size="md"
                                className="text-center text-typography-900"
                            >
                                No scans yet
                            </Heading>
                            <Text className="mt-2 text-center text-typography-500">
                                Use the Scan tab to capture your first
                                document collection.
                            </Text>
                        </VStack>
                    }
                    renderItem={({ item }) => (
                        <HStack className="items-center gap-2 rounded-xl border border-outline-200 bg-background-0 p-4">
                            <Pressable
                                onPress={() =>
                                    router.push(`/camscan/${item.id}` as Href)
                                }
                                className="min-w-0 flex-1 active:opacity-80"
                            >
                                <HStack className="items-center gap-3">
                                    <Box className="h-16 w-14 overflow-hidden rounded-lg bg-background-100">
                                        {item.photos[0] ? (
                                            <Image
                                                source={{
                                                    uri: item.photos[0].uri,
                                                }}
                                                style={{
                                                    width: "100%",
                                                    height: "100%",
                                                }}
                                                contentFit="cover"
                                            />
                                        ) : (
                                            <Box className="h-full w-full items-center justify-center">
                                                <Text
                                                    size="xs"
                                                    className="text-typography-400"
                                                >
                                                    Empty
                                                </Text>
                                            </Box>
                                        )}
                                    </Box>

                                    <VStack className="min-w-0 flex-1" space="xs">
                                        <Text
                                            className="font-semibold text-typography-900"
                                            numberOfLines={1}
                                        >
                                            {item.title}
                                        </Text>
                                        <Text
                                            size="sm"
                                            className="text-typography-500"
                                        >
                                            {item.photos.length} photo
                                            {item.photos.length === 1
                                                ? ""
                                                : "s"}
                                        </Text>
                                        <Text
                                            size="xs"
                                            className="text-typography-400"
                                        >
                                            {new Date(
                                                item.updatedAt
                                            ).toLocaleString()}
                                        </Text>
                                    </VStack>

                                    <ChevronRight size={20} color="#595d69" />
                                </HStack>
                            </Pressable>

                            <Pressable
                                onPress={() => confirmDelete(item)}
                                hitSlop={8}
                                className="p-2"
                                accessibilityLabel="Delete collection"
                            >
                                <Trash2 size={18} color="#dc2626" />
                            </Pressable>
                        </HStack>
                    )}
                />
            </Box>
        </CamscanShell>
    )
}

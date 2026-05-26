import { Image } from "expo-image"
import { useCallback } from "react"
import { Alert, FlatList, Pressable } from "react-native"
import { ArrowDown, ArrowUp, Trash2 } from "lucide-react-native"

import { useStudentPhotosStore } from "@/components/scanner/student-photos-store"
import { Box } from "@/components/ui/box"
import { HStack } from "@/components/ui/hstack"
import { Text } from "@/components/ui/text"
import { VStack } from "@/components/ui/vstack"
import type { StudentScanPhoto } from "@/types/student-scanner"

type StudentDocumentsListProps = {
    studentId: string
}

const EMPTY_PHOTOS: StudentScanPhoto[] = []

export function StudentDocumentsList({ studentId }: StudentDocumentsListProps) {
    const photos = useStudentPhotosStore(
        (s) => s.byStudent[studentId] ?? EMPTY_PHOTOS
    )
    const reorderPhotos = useStudentPhotosStore((s) => s.reorderPhotos)
    const deletePhoto = useStudentPhotosStore((s) => s.deletePhoto)

    const confirmDelete = useCallback(
        (photo: StudentScanPhoto) => {
            Alert.alert("Remove photo", "Delete this scanned page?", [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Delete",
                    style: "destructive",
                    onPress: () => deletePhoto(studentId, photo.id),
                },
            ])
        },
        [deletePhoto, studentId]
    )

    const renderItem = ({
        item: photo,
        index,
    }: {
        item: StudentScanPhoto
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
                            reorderPhotos(studentId, index, index - 1)
                        }
                        disabled={index === 0}
                        className="p-2 opacity-100 disabled:opacity-30"
                        accessibilityLabel="Move up"
                    >
                        <ArrowUp size={20} color="#5358ee" />
                    </Pressable>
                    <Pressable
                        onPress={() =>
                            reorderPhotos(studentId, index, index + 1)
                        }
                        disabled={index === photos.length - 1}
                        className="p-2 opacity-100 disabled:opacity-30"
                        accessibilityLabel="Move down"
                    >
                        <ArrowDown size={20} color="#5358ee" />
                    </Pressable>
                    <Pressable
                        onPress={() => confirmDelete(photo)}
                        className="p-2"
                        accessibilityLabel="Delete photo"
                    >
                        <Trash2 size={18} color="#dc2626" />
                    </Pressable>
                </HStack>
            </HStack>
        </Box>
    )

    if (!studentId) {
        return (
            <Text className="text-typography-500">
                Missing student. Go back and open a student again.
            </Text>
        )
    }

    return (
        <FlatList
            data={photos}
            keyExtractor={(photo) => photo.id}
            renderItem={renderItem}
            style={{ flex: 1 }}
            contentContainerClassName="pb-6 grow"
            showsVerticalScrollIndicator={false}
            ListHeaderComponent={
                photos.length > 0 ? (
                    <Text size="sm" className="mb-3 text-typography-500">
                        {photos.length} page{photos.length === 1 ? "" : "s"} ·
                        Use arrows to reorder
                    </Text>
                ) : null
            }
            ListEmptyComponent={
                <VStack className="items-center py-12">
                    <Text className="text-center text-typography-500">
                        No scanned pages yet.
                    </Text>
                    <Text className="mt-2 text-center text-typography-400">
                        Open Scan Now to capture documents for this student.
                    </Text>
                </VStack>
            }
        />
    )
}

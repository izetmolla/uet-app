import { Image } from "expo-image"
import { ArrowDown, ArrowUp, Trash2 } from "lucide-react-native"
import { Pressable } from "react-native"

import { Box } from "@/components/ui/box"
import { HStack } from "@/components/ui/hstack"
import { Text } from "@/components/ui/text"
import type { CamscanPhoto } from "@/types/camscan"

type SinglePhotoProps = {
    photo: CamscanPhoto
    index: number
    photoCount: number
    onMoveUp: () => void
    onMoveDown: () => void
    onDelete: () => void
}

export function SinglePhoto({
    photo,
    index,
    photoCount,
    onMoveUp,
    onMoveDown,
    onDelete,
}: SinglePhotoProps) {
    return (
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
                        onPress={onMoveUp}
                        disabled={index === 0}
                        className="p-2 opacity-100 disabled:opacity-30"
                        accessibilityLabel="Move up"
                    >
                        <ArrowUp size={20} color="#5358ee" />
                    </Pressable>
                    <Pressable
                        onPress={onMoveDown}
                        disabled={index === photoCount - 1}
                        className="p-2 opacity-100 disabled:opacity-30"
                        accessibilityLabel="Move down"
                    >
                        <ArrowDown size={20} color="#5358ee" />
                    </Pressable>
                    <Pressable
                        onPress={onDelete}
                        className="p-2"
                        accessibilityLabel="Delete photo"
                    >
                        <Trash2 size={18} color="#dc2626" />
                    </Pressable>
                </HStack>
            </HStack>
        </Box>
    )
}

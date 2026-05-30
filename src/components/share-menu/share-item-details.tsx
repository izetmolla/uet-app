import { Image } from "expo-image"
import { File } from "expo-file-system"
import { useEffect, useMemo, useState } from "react"
import { ScrollView } from "react-native"
import { FileIcon, FileText, ImageIcon, Link2 } from "lucide-react-native"

import { useThemeColors } from "@/hooks/use-theme-colors"
import type { SharedFileItem } from "@/types/share-menu"
import { Box } from "@/components/ui/box"
import { Heading } from "@/components/ui/heading"
import { HStack } from "@/components/ui/hstack"
import { Text } from "@/components/ui/text"
import { VStack } from "@/components/ui/vstack"

type ShareItemDetailsProps = {
    item: SharedFileItem
    index: number
}

function getDisplayName(uri: string) {
    const withoutQuery = uri.split("?")[0] ?? uri
    const segments = withoutQuery.split("/")
    const lastSegment = segments[segments.length - 1]

    return lastSegment || uri
}

function getKindLabel(mimeType: string) {
    if (mimeType === "text/plain") {
        return "Text"
    }

    if (mimeType.startsWith("image/")) {
        return "Image"
    }

    if (mimeType.startsWith("video/")) {
        return "Video"
    }

    if (mimeType.startsWith("audio/")) {
        return "Audio"
    }

    if (mimeType.includes("pdf")) {
        return "PDF"
    }

    return "File"
}

function ShareKindIcon({
    mimeType,
    color,
}: {
    mimeType: string
    color: string
}) {
    const size = 20

    if (mimeType === "text/plain") {
        return <FileText size={size} color={color} />
    }

    if (mimeType.startsWith("image/")) {
        return <ImageIcon size={size} color={color} />
    }

    if (mimeType.startsWith("http://") || mimeType.startsWith("https://")) {
        return <Link2 size={size} color={color} />
    }

    return <FileIcon size={size} color={color} />
}

export function ShareItemDetails({ item, index }: ShareItemDetailsProps) {
    const colors = useThemeColors()
    const [fileSize, setFileSize] = useState<string | null>(null)
    const displayName = useMemo(() => getDisplayName(item.data), [item.data])
    const kindLabel = useMemo(() => getKindLabel(item.mimeType), [item.mimeType])
    const isImage = item.mimeType.startsWith("image/")
    const isText = item.mimeType === "text/plain"

    useEffect(() => {
        let cancelled = false

        async function loadFileSize() {
            if (isText || item.data.startsWith("http")) {
                return
            }

            try {
                const file = new File(item.data)
                if (!file.exists || file.size <= 0) {
                    return
                }

                if (!cancelled) {
                    setFileSize(formatBytes(file.size))
                }
            } catch {
                // Shared content may use content:// URIs that are not readable here.
            }
        }

        void loadFileSize()

        return () => {
            cancelled = true
        }
    }, [isText, item.data])

    return (
        <Box
            className="rounded-xl border p-4"
            style={{
                borderColor: colors.border,
                backgroundColor: colors.card,
            }}
        >
            <VStack space="md">
                <HStack className="items-start justify-between gap-3">
                    <HStack className="flex-1 items-start gap-3">
                        <Box
                            className="rounded-lg p-2"
                            style={{ backgroundColor: colors.pageBackground }}
                        >
                            <ShareKindIcon
                                mimeType={item.mimeType}
                                color={colors.primary}
                            />
                        </Box>
                        <VStack className="flex-1" space="xs">
                            <Text
                                size="xs"
                                style={{ color: colors.mutedForeground }}
                            >
                                Item {index + 1} · {kindLabel}
                            </Text>
                            <Heading
                                size="sm"
                                style={{ color: colors.foreground }}
                            >
                                {displayName}
                            </Heading>
                        </VStack>
                    </HStack>
                </HStack>

                <VStack space="xs">
                    <Text size="sm" style={{ color: colors.mutedForeground }}>
                        MIME type
                    </Text>
                    <Text size="sm" style={{ color: colors.foreground }}>
                        {item.mimeType}
                    </Text>
                </VStack>

                {fileSize ? (
                    <VStack space="xs">
                        <Text
                            size="sm"
                            style={{ color: colors.mutedForeground }}
                        >
                            Size
                        </Text>
                        <Text size="sm" style={{ color: colors.foreground }}>
                            {fileSize}
                        </Text>
                    </VStack>
                ) : null}

                <VStack space="xs">
                    <Text size="sm" style={{ color: colors.mutedForeground }}>
                        Location
                    </Text>
                    <Text
                        size="sm"
                        selectable
                        style={{ color: colors.foreground }}
                    >
                        {item.data}
                    </Text>
                </VStack>

                {isText ? (
                    <VStack space="xs">
                        <Text
                            size="sm"
                            style={{ color: colors.mutedForeground }}
                        >
                            Content
                        </Text>
                        <Text
                            size="sm"
                            selectable
                            style={{ color: colors.foreground }}
                        >
                            {item.data}
                        </Text>
                    </VStack>
                ) : null}

                {isImage ? (
                    <Box
                        className="overflow-hidden rounded-lg border"
                        style={{ borderColor: colors.border }}
                    >
                        <Image
                            source={{ uri: item.data }}
                            style={{ width: "100%", height: 220 }}
                            contentFit="contain"
                        />
                    </Box>
                ) : null}
            </VStack>
        </Box>
    )
}

function formatBytes(bytes: number) {
    if (bytes < 1024) {
        return `${bytes} B`
    }

    if (bytes < 1024 * 1024) {
        return `${(bytes / 1024).toFixed(1)} KB`
    }

    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

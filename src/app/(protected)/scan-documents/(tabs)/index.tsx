import { type Href, useRouter } from "expo-router"
import { ChevronRight, FolderOpen } from "lucide-react-native"
import { useCallback } from "react"
import { FlatList, Pressable, RefreshControl } from "react-native"

import {
    getScanDocumentsTabs,
    type ScanDocumentFolder,
} from "@/api/protected/scan-documents/tabs"
import { CamscanShell } from "@/components/camscan/camscan-shell"
import ContentLoader from "@/components/content-loader"
import { Box } from "@/components/ui/box"
import { Heading } from "@/components/ui/heading"
import { HStack } from "@/components/ui/hstack"
import { Text } from "@/components/ui/text"
import { VStack } from "@/components/ui/vstack"
import { useThemeColors } from "@/hooks/use-theme-colors"
import { withError } from "@/lib/network"
import { useQuery } from "@tanstack/react-query"

function FolderRow({
    folder,
    onPress,
}: {
    folder: ScanDocumentFolder
    onPress: () => void
}) {
    return (
        <Pressable
            onPress={onPress}
            className="active:opacity-80"
            accessibilityRole="button"
            accessibilityLabel={`Open folder ${folder.name}`}
        >
            <HStack className="items-center gap-3 rounded-2xl border border-outline-200 bg-background-0 px-4 py-4 shadow-sm">
                <Box className="h-12 w-12 items-center justify-center rounded-xl bg-primary-100">
                    <FolderOpen size={22} color="#2e4d88" />
                </Box>

                <VStack className="min-w-0 flex-1" space="xs">
                    <Text
                        className="text-base font-semibold text-typography-900"
                        numberOfLines={2}
                    >
                        {folder.name}
                    </Text>
                    <Text size="sm" className="text-typography-500">
                        Tap to scan documents
                    </Text>
                </VStack>

                <ChevronRight size={20} color="#8c8f98" />
            </HStack>
        </Pressable>
    )
}

export default function ScanDocumentsFoldersScreen() {
    const router = useRouter()
    const { primary, mutedForeground } = useThemeColors()

    const { refetch, data, isLoading, isRefetching, error } = useQuery({
        queryKey: ["scan-documents-tabs"],
        queryFn: getScanDocumentsTabs,
    })

    const folders = data?.folders ?? []

    const onRefresh = useCallback(() => {
        void refetch()
    }, [refetch])



    return (
        <CamscanShell>
            <Box className="flex-1 bg-background-50">
                <ContentLoader
                    forMeta
                    title="Scan documents"
                    isLoading={isLoading}
                    error={withError(error, data)}
                    showHeaderOnLoader
                >
                    <FlatList
                        data={folders}
                        keyExtractor={(item) => item.id}
                        style={{ flex: 1 }}
                        contentContainerClassName="gap-3 px-4 pb-6 grow"
                        showsVerticalScrollIndicator={false}
                        refreshControl={
                            <RefreshControl
                                refreshing={isRefetching}
                                onRefresh={onRefresh}
                                tintColor={primary}
                                colors={[primary]}
                                progressBackgroundColor="#ffffff"
                            />
                        }
                        ListHeaderComponent={
                            folders.length > 0 ? (
                                <VStack space="xs" className="pb-2 pt-1">
                                    <Heading
                                        size="sm"
                                        className="text-typography-900"
                                    >
                                        Folders to scan
                                    </Heading>
                                    <Text size="sm" className="text-typography-500">
                                        {folders.length} folder
                                        {folders.length === 1 ? "" : "s"} available
                                    </Text>
                                </VStack>
                            ) : null
                        }
                        ListEmptyComponent={
                            <VStack className="flex-1 items-center justify-center px-6 py-20">
                                <Box className="mb-4 rounded-full bg-background-muted p-5">
                                    <FolderOpen
                                        size={32}
                                        color={mutedForeground}
                                    />
                                </Box>
                                <Heading
                                    size="md"
                                    className="text-center text-typography-900"
                                >
                                    No folders yet
                                </Heading>
                                <Text className="mt-2 text-center text-typography-500">
                                    Pull down to refresh, or check back when
                                    folders are assigned to this device.
                                </Text>
                            </VStack>
                        }
                        renderItem={({ item }) => (
                            <FolderRow
                                folder={item}
                                onPress={() => router.push(`/scan-documents/students/${item.id}` as Href)}
                            />
                        )}
                    />
                </ContentLoader>
            </Box>
        </CamscanShell>
    )
}

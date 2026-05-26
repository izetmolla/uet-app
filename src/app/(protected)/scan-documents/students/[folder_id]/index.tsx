import { Image } from "expo-image"
import { type Href, useLocalSearchParams, useRouter } from "expo-router"
import { ChevronRight, Search, User } from "lucide-react-native"
import { useCallback, useMemo, useRef, useState } from "react"
import {
    FlatList,
    type NativeScrollEvent,
    type NativeSyntheticEvent,
    Pressable,
    RefreshControl,
    StyleSheet,
} from "react-native"

import { type ScanDocumentsFoldersResponse } from "@/api/protected/scan-documents/tabs"
import {
    getStudents,
    type Student,
} from "@/api/protected/scan-documents/tabs/students"
import ContentLoader from "@/components/content-loader"
import { AppHeader } from "@/components/navigation/app-header"
import {
    ScreenContentSafeArea,
    ScreenSafeArea,
} from "@/components/navigation/screen-safe-area"
import { Box } from "@/components/ui/box"
import { Heading } from "@/components/ui/heading"
import { HStack } from "@/components/ui/hstack"
import { Input, InputField, InputIcon, InputSlot } from "@/components/ui/input"
import { Text } from "@/components/ui/text"
import { VStack } from "@/components/ui/vstack"
import { useThemeColors } from "@/hooks/use-theme-colors"
import { withError } from "@/lib/network"
import { useQuery, useQueryClient } from "@tanstack/react-query"

function getRouteParam(
    value: string | string[] | undefined
): string | undefined {
    if (typeof value === "string") return value
    if (Array.isArray(value)) return value[0]
    return undefined
}

function getInitials(name?: string) {
    if (!name?.trim()) return "?"
    return name
        .trim()
        .split(/\s+/)
        .slice(0, 2)
        .map((part) => part[0]?.toUpperCase() ?? "")
        .join("")
}

/** Approximates VStack `space="md"` below the title block before the search bar. */
const HEADER_TITLE_SEARCH_GAP = 12

function matchesSearch(student: Student, query: string) {
    const haystack = [
        student.fullname,
        student.id_number,
        student.email,
        student.study_program,
        student.study_year,
    ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase()

    return haystack.includes(query)
}

function StudentAvatar({ student }: { student: Student }) {
    const displayName = student.fullname ?? student.email ?? "?"

    if (student.image) {
        return (
            <Box className="h-12 w-12 overflow-hidden rounded-full bg-background-100">
                <Image
                    source={{ uri: student.image }}
                    style={{ width: "100%", height: "100%" }}
                    contentFit="cover"
                    accessibilityLabel={displayName}
                />
            </Box>
        )
    }

    return (
        <Box className="h-12 w-12 items-center justify-center rounded-full bg-primary-100">
            <Text className="text-sm font-semibold text-primary-700">
                {getInitials(student.fullname ?? student.email)}
            </Text>
        </Box>
    )
}

function StudentRow({
    student,
    onPress,
}: {
    student: Student
    onPress: () => void
}) {
    const idNumber = student.id_number?.trim() || "-"

    return (
        <Pressable
            onPress={onPress}
            className="active:opacity-80"
            accessibilityRole="button"
            accessibilityLabel={student.fullname ?? "Student"}
        >
            <HStack className="items-center gap-3 rounded-2xl border border-outline-200 bg-background-0 px-4 py-3 shadow-sm">
                <StudentAvatar student={student} />

                <VStack className="min-w-0 flex-1" space="xs">
                    <Text
                        className="text-base font-semibold text-typography-900"
                        numberOfLines={1}
                    >
                        {student.fullname ?? student.email ?? "Unknown student"}
                    </Text>
                    <Text
                        size="sm"
                        className="text-typography-500"
                        numberOfLines={1}
                    >
                        {idNumber}
                    </Text>
                </VStack>

                <ChevronRight size={20} color="#8c8f98" />
            </HStack>
        </Pressable>
    )
}

function SearchBar({
    value,
    onChangeText,
}: {
    value: string
    onChangeText: (text: string) => void
}) {
    return (
        <Input variant="outline" size="md" className="rounded-xl border-outline-200 bg-background-0">
            <InputSlot className="pl-3">
                <InputIcon as={Search} className="text-typography-400" />
            </InputSlot>
            <InputField
                placeholder="Search by name, ID, email, or program…"
                value={value}
                onChangeText={onChangeText}
                autoCapitalize="none"
                autoCorrect={false}
                returnKeyType="search"
                className="placeholder:text-typography-400"
            />
        </Input>
    )
}

export default function StudentsScreen() {
    const router = useRouter()
    const { folder_id, folder_name } = useLocalSearchParams<{
        folder_id: string
        folder_name?: string | string[]
    }>()
    const queryClient = useQueryClient()
    const folderId = getRouteParam(folder_id) ?? ""
    const { primary, mutedForeground } = useThemeColors()
    const [search, setSearch] = useState("")
    const [isSearchSticky, setIsSearchSticky] = useState(false)
    const titleSectionHeightRef = useRef(0)
    const searchBarHeightRef = useRef(0)

    const { data, isLoading, isRefetching, error, refetch } = useQuery({
        queryKey: ["students", folderId],
        queryFn: () => getStudents({ folder_id: folderId }),
        enabled: Boolean(folderId),
        initialData: { students: [] },
    })

    const students = data?.students ?? []
    const normalizedSearch = search.trim().toLowerCase()

    const folderName = useMemo(() => {
        const fromRoute = getRouteParam(folder_name)
        if (fromRoute) return fromRoute

        const foldersData =
            queryClient.getQueryData<ScanDocumentsFoldersResponse>([
                "scan-documents-tabs",
            ])
        return (
            foldersData?.folders.find((folder) => folder.id === folderId)
                ?.name ?? "Students"
        )
    }, [folder_name, folderId, queryClient])

    const filteredStudents = useMemo(() => {
        if (!normalizedSearch) return students
        return students.filter((student) =>
            matchesSearch(student, normalizedSearch)
        )
    }, [students, normalizedSearch])

    const onRefresh = useCallback(() => {
        void refetch()
    }, [refetch])

    const onTitleSectionLayout = useCallback(
        (height: number) => {
            titleSectionHeightRef.current = height
        },
        []
    )

    const onSearchBarLayout = useCallback((height: number) => {
        if (height > 0) {
            searchBarHeightRef.current = height
        }
    }, [])

    const onScroll = useCallback(
        (event: NativeSyntheticEvent<NativeScrollEvent>) => {
            const offsetY = event.nativeEvent.contentOffset.y
            const shouldStick =
                titleSectionHeightRef.current > 0 &&
                offsetY >
                    titleSectionHeightRef.current + HEADER_TITLE_SEARCH_GAP

            setIsSearchSticky((prev) =>
                prev === shouldStick ? prev : shouldStick
            )
        },
        []
    )

    const listHeader = (
        <VStack space="md" className="pb-3 pt-1">
            <VStack
                space="sm"
                onLayout={(event) =>
                    onTitleSectionLayout(event.nativeEvent.layout.height)
                }
            >
                <Text size="sm" className="text-typography-500">
                    {students.length} student{students.length === 1 ? "" : "s"}
                    {normalizedSearch
                        ? ` · ${filteredStudents.length} shown`
                        : ""}
                </Text>
                <Heading
                    size="sm"
                    className="text-typography-900"
                    numberOfLines={2}
                >
                    {folderName}
                </Heading>
            </VStack>
            <Box
                style={
                    isSearchSticky && searchBarHeightRef.current > 0
                        ? { height: searchBarHeightRef.current }
                        : undefined
                }
                onLayout={(event) => {
                    if (!isSearchSticky) {
                        onSearchBarLayout(event.nativeEvent.layout.height)
                    }
                }}
            >
                {!isSearchSticky ? (
                    <SearchBar value={search} onChangeText={setSearch} />
                ) : null}
            </Box>
        </VStack>
    )

    return (
        <ScreenSafeArea>
            <AppHeader
                title={folderName}
                showBack
                showMenu={false}
                showSearch={false}
                showNotifications={false}
            />
            <ScreenContentSafeArea>
                <Box className="flex-1 bg-background-50">
                    <ContentLoader
                        isLoading={isLoading}
                        forMeta
                        error={withError(error, data)}
                    >
                        {isSearchSticky ? (
                            <Box
                                className="absolute inset-x-0 top-0 z-10 border-b border-outline-200 bg-background-50 px-4 pb-3 pt-1"
                                style={styles.stickySearch}
                            >
                                <SearchBar
                                    value={search}
                                    onChangeText={setSearch}
                                />
                            </Box>
                        ) : null}
                        <FlatList
                            data={filteredStudents}
                            keyExtractor={(item) => item.id}
                            style={{ flex: 1 }}
                            contentContainerClassName="gap-3 px-4 pb-6 grow"
                            keyboardShouldPersistTaps="handled"
                            showsVerticalScrollIndicator={false}
                            scrollEventThrottle={16}
                            onScroll={onScroll}
                            refreshControl={
                                <RefreshControl
                                    refreshing={isRefetching}
                                    onRefresh={onRefresh}
                                    tintColor={primary}
                                    colors={[primary]}
                                    progressBackgroundColor="#ffffff"
                                />
                            }
                            ListHeaderComponent={listHeader}
                            ListEmptyComponent={
                                <VStack className="flex-1 items-center justify-center px-6 py-16">
                                    <Box className="mb-4 rounded-full bg-background-muted p-5">
                                        {normalizedSearch ? (
                                            <Search
                                                size={28}
                                                color={mutedForeground}
                                            />
                                        ) : (
                                            <User
                                                size={28}
                                                color={mutedForeground}
                                            />
                                        )}
                                    </Box>
                                    <Heading
                                        size="md"
                                        className="text-center text-typography-900"
                                    >
                                        {normalizedSearch
                                            ? "No matches found"
                                            : "No students yet"}
                                    </Heading>
                                    <Text className="mt-2 text-center text-typography-500">
                                        {normalizedSearch
                                            ? "Try a different name, ID, or program."
                                            : "Pull down to refresh this folder."}
                                    </Text>
                                </VStack>
                            }
                            renderItem={({ item }) => (
                                <StudentRow
                                    student={item}
                                    onPress={() =>
                                        router.push({
                                            pathname:
                                                "/scan-documents/students/[folder_id]/[student_id]",
                                            params: {
                                                folder_id: folderId,
                                                student_id: item.id,
                                                folder_name: folderName,
                                                student_name:
                                                    item.fullname ??
                                                    item.email ??
                                                    "Student",
                                            },
                                        } as Href)
                                    }
                                />
                            )}
                        />
                    </ContentLoader>
                </Box>
            </ScreenContentSafeArea>
        </ScreenSafeArea>
    )
}

const styles = StyleSheet.create({
    stickySearch: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.06,
        shadowRadius: 3,
        elevation: 2,
    },
})

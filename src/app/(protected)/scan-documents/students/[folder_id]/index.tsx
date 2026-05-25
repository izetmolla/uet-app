import { Image } from "expo-image"
import { useLocalSearchParams } from "expo-router"
import { ChevronRight, Search, User } from "lucide-react-native"
import { useCallback, useMemo, useState } from "react"
import { FlatList, Pressable, RefreshControl } from "react-native"

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
import { useQuery } from "@tanstack/react-query"

function getInitials(name?: string) {
    if (!name?.trim()) return "?"
    return name
        .trim()
        .split(/\s+/)
        .slice(0, 2)
        .map((part) => part[0]?.toUpperCase() ?? "")
        .join("")
}

function matchesSearch(student: Student, query: string) {
    const haystack = [
        student.fullname,
        student.personal_id,
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

function StudentRow({ student }: { student: Student }) {
    const subtitle = [
        student.personal_id,
        student.study_program,
        student.study_year ? `Year ${student.study_year}` : null,
    ]
        .filter(Boolean)
        .join(" · ")

    return (
        <Pressable
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
                    {subtitle ? (
                        <Text
                            size="sm"
                            className="text-typography-500"
                            numberOfLines={2}
                        >
                            {subtitle}
                        </Text>
                    ) : null}
                    {student.email && student.fullname ? (
                        <Text
                            size="xs"
                            className="text-typography-400"
                            numberOfLines={1}
                        >
                            {student.email}
                        </Text>
                    ) : null}
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
    const { folder_id } = useLocalSearchParams<{ folder_id: string }>()
    const { primary, mutedForeground } = useThemeColors()
    const [search, setSearch] = useState("")

    const { data, isLoading, isRefetching, error, refetch } = useQuery({
        queryKey: ["students", folder_id],
        queryFn: () => getStudents({ folder_id: folder_id }),
        enabled: Boolean(folder_id),
        initialData: { students: [] },
    })

    const students = data?.students ?? []
    const normalizedSearch = search.trim().toLowerCase()

    const filteredStudents = useMemo(() => {
        if (!normalizedSearch) return students
        return students.filter((student) =>
            matchesSearch(student, normalizedSearch)
        )
    }, [students, normalizedSearch])

    const onRefresh = useCallback(() => {
        void refetch()
    }, [refetch])


  const listHeader = (
        <VStack space="md" className="pb-3 pt-1">
            <VStack space="xs">
                <Heading size="sm" className="text-typography-900">
                    Students
                </Heading>
                <Text size="sm" className="text-typography-500">
                    {students.length} student{students.length === 1 ? "" : "s"}
                    {normalizedSearch
                        ? ` · ${filteredStudents.length} shown`
                        : ""}
                </Text>
            </VStack>
            <SearchBar value={search} onChangeText={setSearch} />
        </VStack>
    )

    return (
        <ScreenSafeArea>
            <AppHeader
                title="Students"
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
                        <FlatList
                            data={filteredStudents}
                            keyExtractor={(item) => item.id}
                            style={{ flex: 1 }}
                            contentContainerClassName="gap-3 px-4 pb-6 grow"
                            keyboardShouldPersistTaps="handled"
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
                                <StudentRow student={item} />
                            )}
                        />
                    </ContentLoader>
                </Box>
            </ScreenContentSafeArea>
        </ScreenSafeArea>
    )
}

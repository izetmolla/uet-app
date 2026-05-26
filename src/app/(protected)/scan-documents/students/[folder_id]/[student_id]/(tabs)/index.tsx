import { useLocalSearchParams } from "expo-router"

import ContentLoader from "@/components/content-loader"
import { Box } from "@/components/ui/box"
import { Text } from "@/components/ui/text"

import {
    getRouteParam,
    StudentTabShell,
} from "@/components/scan-documents/student-tab-shell"

export default function StudentDocumentsScreen() {
    const { student_name } = useLocalSearchParams<{
        student_name?: string | string[]
    }>()
    const title = getRouteParam(student_name) ?? "Student"

    return (
        <StudentTabShell title={title}>
            <ContentLoader isLoading={false} forMeta error={null}>
                <Box className="flex-1 px-4 py-6">
                    <Text className="text-typography-500">
                        Student documents will appear here.
                    </Text>
                </Box>
            </ContentLoader>
        </StudentTabShell>
    )
}

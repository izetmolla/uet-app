import { useLocalSearchParams } from "expo-router"
import { Camera } from "lucide-react-native"

import { Box } from "@/components/ui/box"
import { Heading } from "@/components/ui/heading"
import { Text } from "@/components/ui/text"
import { VStack } from "@/components/ui/vstack"
import { useThemeColors } from "@/hooks/use-theme-colors"

import {
    getRouteParam,
    StudentTabShell,
} from "@/components/scan-documents/student-tab-shell"

export default function StudentScanNowScreen() {
    const { student_name } = useLocalSearchParams<{
        student_name?: string | string[]
    }>()
    const title = getRouteParam(student_name) ?? "Student"
    const { mutedForeground } = useThemeColors()

    return (
        <StudentTabShell title={title}>
            <VStack className="flex-1 items-center justify-center px-6 py-16">
                <Box className="mb-4 rounded-full bg-background-muted p-5">
                    <Camera size={32} color={mutedForeground} />
                </Box>
                <Heading
                    size="md"
                    className="text-center text-typography-900"
                >
                    Scan Now
                </Heading>
                <Text className="mt-2 text-center text-typography-500">
                    Scan documents for this student.
                </Text>
            </VStack>
        </StudentTabShell>
    )
}

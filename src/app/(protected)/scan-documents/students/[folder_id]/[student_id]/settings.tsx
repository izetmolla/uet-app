import { useLocalSearchParams } from "expo-router"

import { AppHeader } from "@/components/navigation/app-header"
import {
    ScreenContentSafeArea,
    ScreenSafeArea,
} from "@/components/navigation/screen-safe-area"
import { getRouteParam } from "@/components/scan-documents/student-tab-shell"
import { Box } from "@/components/ui/box"
import { Heading } from "@/components/ui/heading"
import { Text } from "@/components/ui/text"
import { VStack } from "@/components/ui/vstack"

export default function StudentSettingsScreen() {
    const { student_name } = useLocalSearchParams<{
        student_name?: string | string[]
    }>()
    const title = getRouteParam(student_name) ?? "Student"

    return (
        <ScreenSafeArea>
            <AppHeader
                title={`${title} settings`}
                showBack
                showMenu={false}
                showSearch={false}
                showSettings={false}
                showNotifications={false}
            />
            <ScreenContentSafeArea>
                <Box className="flex-1 bg-background-50 px-4 py-6">
                    <VStack space="sm">
                        <Heading size="sm" className="text-typography-900">
                            Settings
                        </Heading>
                        <Text className="text-typography-500">
                            Student scan options for this folder will appear
                            here.
                        </Text>
                    </VStack>
                </Box>
            </ScreenContentSafeArea>
        </ScreenSafeArea>
    )
}

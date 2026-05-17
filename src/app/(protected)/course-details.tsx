import { StackScreen } from "@/components/navigation/stack-screen"
import { Box } from "@/components/ui/box"
import { Text } from "@/components/ui/text"
import { VStack } from "@/components/ui/vstack"

export default function CourseDetailsScreen() {
    return (
        <StackScreen title="Course details">
            <VStack className="gap-4 p-4">
                <Box className="rounded-xl border border-outline-200 bg-background-0 p-5">
                    <VStack space="sm">
                        <Text className="text-lg font-semibold text-typography-900">
                            Introduction to Software Engineering
                        </Text>
                        <Text className="text-typography-500">CS-301 · 6 ECTS</Text>
                        <Text className="text-typography-500">
                            Instructor: Dr. Ana Gjoka
                        </Text>
                    </VStack>
                </Box>

                <Box className="rounded-xl border border-outline-200 bg-background-0 p-5">
                    <VStack space="xs">
                        <Text className="font-medium text-typography-900">
                            This week
                        </Text>
                        <Text className="text-typography-500">
                            Lecture: Design patterns · Lab: API integration
                        </Text>
                    </VStack>
                </Box>
            </VStack>
        </StackScreen>
    )
}

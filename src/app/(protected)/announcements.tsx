import { ScrollView } from "react-native"

import { StackScreen } from "@/components/navigation/stack-screen"
import { Box } from "@/components/ui/box"
import { Text } from "@/components/ui/text"
import { VStack } from "@/components/ui/vstack"

const items = [
    {
        title: "Spring semester registration",
        body: "Registration opens Monday at 08:00. Check your faculty portal for required documents.",
        date: "Today",
    },
    {
        title: "Library extended hours",
        body: "The main library will stay open until 22:00 during exam week.",
        date: "Yesterday",
    },
    {
        title: "Campus Wi‑Fi maintenance",
        body: "Scheduled maintenance on Saturday 02:00–04:00. Minimal disruption expected.",
        date: "Mar 12",
    },
]

export default function AnnouncementsScreen() {
    return (
        <StackScreen title="Announcements" showNotifications={false}>
            <ScrollView
                className="flex-1"
                contentContainerClassName="gap-3 p-4"
                showsVerticalScrollIndicator={false}
            >
                {items.map((item) => (
                    <Box
                        key={item.title}
                        className="rounded-xl border border-outline-200 bg-background-0 p-4"
                    >
                        <VStack space="xs">
                            <Text size="xs" className="text-typography-400">
                                {item.date}
                            </Text>
                            <Text className="text-base font-semibold text-typography-900">
                                {item.title}
                            </Text>
                            <Text className="text-typography-500">{item.body}</Text>
                        </VStack>
                    </Box>
                ))}
            </ScrollView>
        </StackScreen>
    )
}

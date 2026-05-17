import { type Href, useRouter } from "expo-router"
import { Pressable } from "react-native"
import { ChevronRight } from "lucide-react-native"

import { TabPage } from "@/components/navigation/tab-page"
import { Box } from "@/components/ui/box"
import { Heading } from "@/components/ui/heading"
import { HStack } from "@/components/ui/hstack"
import { Text } from "@/components/ui/text"
import { VStack } from "@/components/ui/vstack"
import useAuthorizationStore from "@/store/authorization"

type QuickLink = {
    title: string
    description: string
    href: Href
}

const quickLinks: QuickLink[] = [
    {
        title: "Announcements",
        description: "University news and alerts",
        href: "/announcements" as Href,
    },
    {
        title: "Course details",
        description: "Syllabus, materials, and grades",
        href: "/course-details" as Href,
    },
    {
        title: "Campus services",
        description: "Library, transport, and support",
        href: "/campus-services" as Href,
    },
    {
        title: "Camscan",
        description: "Scan documents and manage collections",
        href: "/camscan" as Href,
    },
]

export default function HomeScreen() {
    const router = useRouter()
    const user = useAuthorizationStore((s) => s.user)

    return (
        <TabPage title="Home">
            <Box className="flex-1 bg-background-50">
            <VStack className="gap-6 p-4">
                <VStack space="xs" className="rounded-xl border border-outline-200 bg-background-0 p-5">
                    <Text size="sm" className="text-typography-500">
                        Welcome back
                    </Text>
                    <Heading size="xl" className="text-typography-900">
                        {user?.first_name ?? "Student"} {user?.last_name ?? ""}
                    </Heading>
                    <Text className="text-typography-500">{user?.email}</Text>
                </VStack>

                <VStack space="sm">
                    <Text className="text-sm font-medium text-typography-500">
                        Quick access
                    </Text>
                    {quickLinks.map((link) => (
                        <Pressable
                            key={link.title}
                            onPress={() => router.push(link.href)}
                            className="rounded-xl border border-outline-200 bg-background-0 p-4 active:bg-background-100"
                        >
                            <HStack className="items-center justify-between">
                                <VStack className="flex-1 pr-3" space="xs">
                                    <Text className="text-base font-semibold text-typography-900">
                                        {link.title}
                                    </Text>
                                    <Text size="sm" className="text-typography-500">
                                        {link.description}
                                    </Text>
                                </VStack>
                                <ChevronRight size={20} color="#595d69" />
                            </HStack>
                        </Pressable>
                    ))}
                </VStack>
            </VStack>
            </Box>
        </TabPage>
    )
}

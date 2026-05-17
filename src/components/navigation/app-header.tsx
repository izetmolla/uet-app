import { DrawerActions } from "@react-navigation/native"
import { type Href, useNavigation, useRouter } from "expo-router"
import { Pressable } from "react-native"
import {
    ArrowLeft,
    Bell,
    Menu,
    Search,
} from "lucide-react-native"

import { Box } from "@/components/ui/box"
import { HStack } from "@/components/ui/hstack"
import { Text } from "@/components/ui/text"

type AppHeaderProps = {
    title: string
    showBack?: boolean
    showMenu?: boolean
    showSearch?: boolean
    showNotifications?: boolean
}

export function AppHeader({
    title,
    showBack = false,
    showMenu = true,
    showSearch = true,
    showNotifications = true,
}: AppHeaderProps) {
    const router = useRouter()
    const navigation = useNavigation()

    const iconColor = "#5358ee"
    const mutedColor = "#595d69"

    const openDrawer = () => {
        navigation.dispatch(DrawerActions.openDrawer())
    }

    return (
        <Box className="border-b border-outline-200 bg-background-0">
            <HStack className="h-14 items-center justify-between px-4">
                <HStack className="min-w-[88px] items-center gap-1">
                    {showBack ? (
                        <Pressable
                            onPress={() => router.back()}
                            className="h-10 w-10 items-center justify-center rounded-full active:bg-background-100"
                            accessibilityRole="button"
                            accessibilityLabel="Go back"
                        >
                            <ArrowLeft size={22} color={iconColor} />
                        </Pressable>
                    ) : showMenu ? (
                        <Pressable
                            onPress={openDrawer}
                            className="h-10 w-10 items-center justify-center rounded-full active:bg-background-100"
                            accessibilityRole="button"
                            accessibilityLabel="Open menu"
                        >
                            <Menu size={22} color={iconColor} />
                        </Pressable>
                    ) : (
                        <Box className="h-10 w-10" />
                    )}
                </HStack>

                <Text
                    className="flex-1 text-center text-lg font-semibold text-typography-900"
                    numberOfLines={1}
                >
                    {title}
                </Text>

                <HStack className="min-w-[88px] items-center justify-end gap-1">
                    {showSearch && (
                        <Pressable
                            onPress={() =>
                                router.push("/campus-services" as Href)
                            }
                            className="h-10 w-10 items-center justify-center rounded-full active:bg-background-100"
                            accessibilityRole="button"
                            accessibilityLabel="Search"
                        >
                            <Search size={20} color={mutedColor} />
                        </Pressable>
                    )}
                    {showNotifications && (
                        <Pressable
                            onPress={() =>
                                router.push("/announcements" as Href)
                            }
                            className="h-10 w-10 items-center justify-center rounded-full active:bg-background-100"
                            accessibilityRole="button"
                            accessibilityLabel="Notifications"
                        >
                            <Bell size={20} color={mutedColor} />
                        </Pressable>
                    )}
                </HStack>
            </HStack>
        </Box>
    )
}

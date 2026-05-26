import { DrawerActions } from "@react-navigation/native"
import { type Href, useNavigation, useRouter } from "expo-router"
import { Pressable, StyleSheet } from "react-native"
import {
    ArrowLeft,
    Bell,
    Menu,
    Search,
    Settings,
} from "lucide-react-native"

import { useThemeColors } from "@/hooks/use-theme-colors"
import { Box } from "@/components/ui/box"
import { HStack } from "@/components/ui/hstack"
import { Text } from "@/components/ui/text"

type AppHeaderProps = {
    title: string
    showBack?: boolean
    showMenu?: boolean
    showSearch?: boolean
    showSettings?: boolean
    showNotifications?: boolean
    onSettingsPress?: () => void
}

export function AppHeader({
    title,
    showBack = false,
    showMenu = true,
    showSearch = true,
    showSettings = true,
    showNotifications = true,
    onSettingsPress,
}: AppHeaderProps) {
    const router = useRouter()
    const navigation = useNavigation()
    const colors = useThemeColors()

    const openDrawer = () => {
        navigation.dispatch(DrawerActions.openDrawer())
    }

    const iconButtonStyle = (pressed: boolean) => [
        styles.iconButton,
        { backgroundColor: pressed ? colors.pressed : "transparent" },
    ]

    const rightActionCount =
        (showSearch ? 1 : 0) + (showSettings ? 1 : 0) + (showNotifications ? 1 : 0)
    const rightMinWidth = Math.max(88, rightActionCount * 40)

    return (
        <Box
            style={{
                backgroundColor: colors.card,
                borderBottomColor: colors.border,
            }}
            className="border-b"
        >
            <HStack className="h-14 items-center justify-between px-4">
                <HStack className="min-w-[88px] items-center gap-1">
                    {showBack ? (
                        <Pressable
                            onPress={() => router.back()}
                            style={({ pressed }) => iconButtonStyle(pressed)}
                            accessibilityRole="button"
                            accessibilityLabel="Go back"
                        >
                            <ArrowLeft size={22} color={colors.primary} />
                        </Pressable>
                    ) : showMenu ? (
                        <Pressable
                            onPress={openDrawer}
                            style={({ pressed }) => iconButtonStyle(pressed)}
                            accessibilityRole="button"
                            accessibilityLabel="Open menu"
                        >
                            <Menu size={22} color={colors.primary} />
                        </Pressable>
                    ) : (
                        <Box className="h-10 w-10" />
                    )}
                </HStack>

                <Text
                    className="flex-1 text-center text-lg font-semibold"
                    style={{ color: colors.foreground }}
                    numberOfLines={1}
                >
                    {title}
                </Text>

                <HStack
                    className="items-center justify-end gap-0.5"
                    style={{ minWidth: rightMinWidth }}
                >
                    {showSearch && (
                        <Pressable
                            onPress={() =>
                                router.push("/campus-services" as Href)
                            }
                            style={({ pressed }) => iconButtonStyle(pressed)}
                            accessibilityRole="button"
                            accessibilityLabel="Search"
                        >
                            <Search size={20} color={colors.mutedForeground} />
                        </Pressable>
                    )}
                    {showSettings && (
                        <Pressable
                            onPress={
                                onSettingsPress ??
                                (() => router.push("/settings" as Href))
                            }
                            style={({ pressed }) => iconButtonStyle(pressed)}
                            accessibilityRole="button"
                            accessibilityLabel="Settings"
                        >
                            <Settings size={20} color={colors.mutedForeground} />
                        </Pressable>
                    )}
                    {showNotifications && (
                        <Pressable
                            onPress={() =>
                                router.push("/announcements" as Href)
                            }
                            style={({ pressed }) => iconButtonStyle(pressed)}
                            accessibilityRole="button"
                            accessibilityLabel="Notifications"
                        >
                            <Bell size={20} color={colors.mutedForeground} />
                        </Pressable>
                    )}
                </HStack>
            </HStack>
        </Box>
    )
}

const styles = StyleSheet.create({
    iconButton: {
        height: 40,
        width: 40,
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 9999,
    },
})

import {
    DrawerContentScrollView,
    type DrawerContentComponentProps,
} from "@react-navigation/drawer"
import { type Href, useRouter } from "expo-router"
import { Pressable } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"

import { useThemeColors } from "@/hooks/use-theme-colors"
import { Heading } from "@/components/ui/heading"
import { Text } from "@/components/ui/text"
import { VStack } from "@/components/ui/vstack"
import useAuthorizationStore from "@/store/authorization"

type DrawerLink = {
    label: string
    href: Href
}

const drawerLinks: DrawerLink[] = [
    { label: "Home", href: "/" },
    { label: "My courses", href: "/courses" as Href },
    { label: "Schedule", href: "/schedule" as Href },
    { label: "Messages", href: "/messages" as Href },
    { label: "Profile", href: "/profile" as Href },
    { label: "Announcements", href: "/announcements" as Href },
    { label: "Campus services", href: "/campus-services" as Href },
    { label: "Camscan", href: "/camscan" as Href },
    { label: "Settings", href: "/settings" as Href },
]

export function AppDrawerContent(props: DrawerContentComponentProps) {
    const router = useRouter()
    const user = useAuthorizationStore((s) => s.user)
    const signOut = useAuthorizationStore((s) => s.signOut)
    const colors = useThemeColors()

    const navigate = (href: Href) => {
        props.navigation.closeDrawer()
        router.push(href)
    }

    const handleSignOut = () => {
        props.navigation.closeDrawer()
        signOut()
    }

    return (
        <SafeAreaView
            style={{ flex: 1, backgroundColor: colors.card }}
            edges={["top", "left", "right", "bottom"]}
        >
        <DrawerContentScrollView
            {...props}
            contentContainerStyle={{ flex: 1 }}
            style={{ backgroundColor: colors.card }}
        >
            <VStack className="flex-1 px-4 py-4" space="lg">
                <VStack space="xs">
                    <Heading
                        size="lg"
                        style={{ color: colors.foreground }}
                    >
                        UET App
                    </Heading>
                    <Text
                        size="sm"
                        style={{ color: colors.mutedForeground }}
                    >
                        {user?.email}
                    </Text>
                </VStack>

                <VStack space="xs" className="flex-1">
                    {drawerLinks.map((link) => (
                        <Pressable
                            key={link.label}
                            onPress={() => navigate(link.href)}
                            style={({ pressed }) => ({
                                borderRadius: 8,
                                paddingHorizontal: 12,
                                paddingVertical: 12,
                                backgroundColor: pressed
                                    ? colors.pressed
                                    : "transparent",
                            })}
                        >
                            <Text
                                className="text-base"
                                style={{ color: colors.foreground }}
                            >
                                {link.label}
                            </Text>
                        </Pressable>
                    ))}
                </VStack>

                <Pressable
                    onPress={handleSignOut}
                    style={({ pressed }) => ({
                        borderRadius: 8,
                        borderWidth: 1,
                        borderColor: colors.border,
                        paddingHorizontal: 12,
                        paddingVertical: 12,
                        backgroundColor: pressed ? colors.pressed : "transparent",
                    })}
                >
                    <Text className="text-center text-base text-error-600">
                        Sign out
                    </Text>
                </Pressable>
            </VStack>
        </DrawerContentScrollView>
        </SafeAreaView>
    )
}

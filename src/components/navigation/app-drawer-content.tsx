import {
    DrawerContentScrollView,
    type DrawerContentComponentProps,
} from "@react-navigation/drawer"
import { type Href, useRouter } from "expo-router"
import { Pressable } from "react-native"

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
]

export function AppDrawerContent(props: DrawerContentComponentProps) {
    const router = useRouter()
    const user = useAuthorizationStore((s) => s.user)
    const signOut = useAuthorizationStore((s) => s.signOut)

    const navigate = (href: Href) => {
        props.navigation.closeDrawer()
        router.push(href)
    }

    const handleSignOut = () => {
        props.navigation.closeDrawer()
        signOut()
    }

    return (
        <DrawerContentScrollView
            {...props}
            contentContainerStyle={{ flex: 1 }}
            className="bg-background-0"
        >
            <VStack className="flex-1 px-4 py-4" space="lg">
                <VStack space="xs">
                    <Heading size="lg" className="text-typography-900">
                        UET App
                    </Heading>
                    <Text size="sm" className="text-typography-500">
                        {user?.email}
                    </Text>
                </VStack>

                <VStack space="xs" className="flex-1">
                    {drawerLinks.map((link) => (
                        <Pressable
                            key={link.label}
                            onPress={() => navigate(link.href)}
                            className="rounded-lg px-3 py-3 active:bg-background-100"
                        >
                            <Text className="text-base text-typography-900">
                                {link.label}
                            </Text>
                        </Pressable>
                    ))}
                </VStack>

                <Pressable
                    onPress={handleSignOut}
                    className="rounded-lg border border-outline-200 px-3 py-3 active:bg-error-50"
                >
                    <Text className="text-center text-base text-error-600">
                        Sign out
                    </Text>
                </Pressable>
            </VStack>
        </DrawerContentScrollView>
    )
}

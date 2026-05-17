import { router } from "expo-router"

import { Box } from "@/components/ui/box"
import { Button, ButtonIcon, ButtonText } from "@/components/ui/button"
import { Center } from "@/components/ui/center"
import { MoonIcon, SunIcon } from "@/components/ui/icon"
import { Text } from "@/components/ui/text"
import { VStack } from "@/components/ui/vstack"
import { useColorMode } from "@/contexts/color-mode"
import useAuthorizationStore from "@/store/authorization"

export default function HomeScreen() {
    const user = useAuthorizationStore((s) => s.user)
    const signOut = useAuthorizationStore((s) => s.signOut)
    const { colorMode, toggleColorMode } = useColorMode()

    const handleLogout = async () => {
        signOut()
        router.replace("/login")
    }

    const isDark = colorMode === "dark"

    return (
        <Box className="flex-1 bg-background-0">
            <Center className="flex-1 px-6">
                <VStack className="w-full max-w-sm items-center gap-6">
                    <VStack className="items-center gap-2">
                        <Text className="text-2xl font-semibold text-typography-900">
                            Welcome
                        </Text>
                        <Text className="text-typography-500">{user?.email}</Text>
                    </VStack>

                    <Button
                        action="secondary"
                        variant="outline"
                        size="md"
                        onPress={toggleColorMode}
                        className="w-full"
                    >
                        <ButtonIcon
                            as={isDark ? SunIcon : MoonIcon}
                            className="text-typography-700"
                        />
                        <ButtonText>
                            {isDark ? "Switch to light mode" : "Switch to dark mode"}
                        </ButtonText>
                    </Button>

                    <Button
                        action="negative"
                        variant="solid"
                        size="md"
                        onPress={handleLogout}
                        className="w-full"
                    >
                        <ButtonText>Logout</ButtonText>
                    </Button>
                </VStack>
            </Center>
        </Box>
    )
}

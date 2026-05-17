import { TabPage } from "@/components/navigation/tab-page"
import { Box } from "@/components/ui/box"
import { Button, ButtonText } from "@/components/ui/button"
import { Text } from "@/components/ui/text"
import { VStack } from "@/components/ui/vstack"
import useAuthorizationStore from "@/store/authorization"

export default function ProfileScreen() {
    const user = useAuthorizationStore((s) => s.user)
    const signOut = useAuthorizationStore((s) => s.signOut)

    const handleLogout = () => {
        signOut()
    }

    return (
        <TabPage title="Profile">
        <Box className="flex-1 bg-background-50 p-4">
            <VStack className="rounded-xl border border-outline-200 bg-background-0 p-5" space="md">
                <VStack space="xs">
                    <Text className="text-xl font-semibold text-typography-900">
                        {user?.first_name} {user?.last_name}
                    </Text>
                    <Text className="text-typography-500">{user?.email}</Text>
                    <Text size="sm" className="text-typography-400">
                        {(user?.roles ?? []).join(", ") || "student"}
                    </Text>
                </VStack>

                <Text className="text-typography-500">
                    Account settings, notifications, and campus ID will be
                    available here.
                </Text>

                <Button action="negative" onPress={handleLogout}>
                    <ButtonText>Sign out</ButtonText>
                </Button>
            </VStack>
        </Box>
        </TabPage>
    )
}

import { useRouter } from "expo-router"
import { ScrollView } from "react-native"

import { ShareItemDetails } from "@/components/share-menu/share-item-details"
import { StackScreen } from "@/components/navigation/stack-screen"
import { useThemeColors } from "@/hooks/use-theme-colors"
import useShareMenuStore from "@/store/share-menu-store"
import { Box } from "@/components/ui/box"
import { Button, ButtonText } from "@/components/ui/button"
import { Text } from "@/components/ui/text"
import { VStack } from "@/components/ui/vstack"

export default function ShareToScreen() {
    const router = useRouter()
    const colors = useThemeColors()
    const payload = useShareMenuStore((state) => state.payload)
    const clearPayload = useShareMenuStore((state) => state.clearPayload)

    const handleDismiss = () => {
        clearPayload()
        if (router.canGoBack()) {
            router.back()
            return
        }

        router.replace("/")
    }

    return (
        <StackScreen
            title="Share To"
            showSearch={false}
            showNotifications={false}
            showSettings={false}
        >
            <ScrollView
                className="flex-1"
                contentContainerClassName="gap-4 p-4"
                showsVerticalScrollIndicator={false}
            >
                {payload ? (
                    <VStack space="md">
                        <Box
                            className="rounded-xl border p-4"
                            style={{
                                borderColor: colors.border,
                                backgroundColor: colors.card,
                            }}
                        >
                            <Text
                                size="sm"
                                style={{ color: colors.mutedForeground }}
                            >
                                {payload.items.length} shared item
                                {payload.items.length === 1 ? "" : "s"} received
                            </Text>
                        </Box>

                        {payload.items.map((item, index) => (
                            <ShareItemDetails
                                key={`${item.mimeType}-${item.data}-${index}`}
                                item={item}
                                index={index}
                            />
                        ))}

                        {payload.extraData ? (
                            <Box
                                className="rounded-xl border p-4"
                                style={{
                                    borderColor: colors.border,
                                    backgroundColor: colors.card,
                                }}
                            >
                                <VStack space="xs">
                                    <Text
                                        size="sm"
                                        style={{ color: colors.mutedForeground }}
                                    >
                                        Extra data
                                    </Text>
                                    <Text
                                        size="sm"
                                        selectable
                                        style={{ color: colors.foreground }}
                                    >
                                        {JSON.stringify(payload.extraData, null, 2)}
                                    </Text>
                                </VStack>
                            </Box>
                        ) : null}
                    </VStack>
                ) : (
                    <Box
                        className="rounded-xl border p-4"
                        style={{
                            borderColor: colors.border,
                            backgroundColor: colors.card,
                        }}
                    >
                        <Text size="sm" style={{ color: colors.mutedForeground }}>
                            No shared content is available. Share a file to Uet APP
                            from another app to see its details here.
                        </Text>
                    </Box>
                )}

                <Button action="secondary" onPress={handleDismiss}>
                    <ButtonText>Dismiss</ButtonText>
                </Button>
            </ScrollView>
        </StackScreen>
    )
}

import { ScrollView } from "react-native"

import { StackScreen } from "@/components/navigation/stack-screen"
import { ThemePreferenceSelector } from "@/components/settings/theme-preference-selector"
import { useColorMode } from "@/contexts/color-mode"
import { useThemeColors } from "@/hooks/use-theme-colors"
import { Box } from "@/components/ui/box"
import { Heading } from "@/components/ui/heading"
import { Text } from "@/components/ui/text"
import { VStack } from "@/components/ui/vstack"

export default function SettingsScreen() {
    const { colorMode, themePreference } = useColorMode()
    const colors = useThemeColors()

    const activeThemeLabel =
        themePreference === "system"
            ? `System (${colorMode})`
            : colorMode.charAt(0).toUpperCase() + colorMode.slice(1)

    return (
        <StackScreen
            title="Settings"
            showSearch={false}
            showNotifications={false}
            showSettings={false}
        >
            <ScrollView
                className="flex-1"
                contentContainerClassName="gap-6 p-4"
                showsVerticalScrollIndicator={false}
            >
                <VStack space="md">
                    <VStack space="xs">
                        <Heading
                            size="md"
                            style={{ color: colors.foreground }}
                        >
                            Appearance
                        </Heading>
                        <Text
                            size="sm"
                            style={{ color: colors.mutedForeground }}
                        >
                            Active theme: {activeThemeLabel}
                        </Text>
                    </VStack>

                    <ThemePreferenceSelector />
                </VStack>

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
                        System theme follows your device light or dark mode
                        and updates automatically when you change it in device
                        settings.
                    </Text>
                </Box>
            </ScrollView>
        </StackScreen>
    )
}

import { Monitor, Moon, Sun } from "lucide-react-native"
import { Pressable } from "react-native"

import {
    type ThemePreference,
    useColorMode,
} from "@/contexts/color-mode"
import { useThemeColors } from "@/hooks/use-theme-colors"
import { Box } from "@/components/ui/box"
import { HStack } from "@/components/ui/hstack"
import { Text } from "@/components/ui/text"
import { VStack } from "@/components/ui/vstack"

type ThemeOption = {
    value: ThemePreference
    label: string
    description: string
    icon: typeof Sun
}

const themeOptions: ThemeOption[] = [
    {
        value: "system",
        label: "System",
        description: "Match your device appearance",
        icon: Monitor,
    },
    {
        value: "light",
        label: "Light",
        description: "Always use light theme",
        icon: Sun,
    },
    {
        value: "dark",
        label: "Dark",
        description: "Always use dark theme",
        icon: Moon,
    },
]

export function ThemePreferenceSelector() {
    const { themePreference, setThemePreference } = useColorMode()
    const colors = useThemeColors()

    return (
        <VStack space="sm">
            {themeOptions.map((option) => {
                const selected = themePreference === option.value
                const Icon = option.icon

                return (
                    <Pressable
                        key={option.value}
                        onPress={() => setThemePreference(option.value)}
                        accessibilityRole="radio"
                        accessibilityState={{ selected }}
                        style={({ pressed }) => ({
                            borderRadius: 12,
                            borderWidth: 1,
                            borderColor: selected
                                ? colors.primary
                                : colors.border,
                            backgroundColor: selected
                                ? colors.pressed
                                : colors.card,
                            opacity: pressed ? 0.9 : 1,
                        })}
                    >
                        <HStack className="items-center gap-3 p-4">
                            <Box
                                className="h-10 w-10 items-center justify-center rounded-full"
                                style={{
                                    backgroundColor: selected
                                        ? colors.pressed
                                        : colors.pageBackground,
                                }}
                            >
                                <Icon
                                    size={20}
                                    color={
                                        selected
                                            ? colors.primary
                                            : colors.mutedForeground
                                    }
                                />
                            </Box>
                            <VStack className="min-w-0 flex-1" space="xs">
                                <Text
                                    className="font-semibold"
                                    style={{ color: colors.foreground }}
                                >
                                    {option.label}
                                </Text>
                                <Text
                                    size="sm"
                                    style={{ color: colors.mutedForeground }}
                                >
                                    {option.description}
                                </Text>
                            </VStack>
                            <Box
                                className="h-5 w-5 rounded-full border-2"
                                style={{
                                    borderColor: selected
                                        ? colors.primary
                                        : colors.border,
                                    backgroundColor: selected
                                        ? colors.primary
                                        : "transparent",
                                }}
                            />
                        </HStack>
                    </Pressable>
                )
            })}
        </VStack>
    )
}

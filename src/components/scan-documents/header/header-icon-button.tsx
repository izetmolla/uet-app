import type { ReactNode } from "react"
import { useCallback, useRef } from "react"
import { Pressable, StyleSheet, type StyleProp, type ViewStyle } from "react-native"

import { useThemeColors } from "@/hooks/use-theme-colors"

const PRESS_COOLDOWN_MS = 450
const ICON_BUTTON_SIZE = 44

type HeaderIconButtonProps = {
    onPress: () => void
    accessibilityLabel: string
    children: ReactNode
    disabled?: boolean
    variant?: "default" | "onDark"
    style?: StyleProp<ViewStyle>
}

export function HeaderIconButton({
    onPress,
    accessibilityLabel,
    children,
    disabled = false,
    variant = "default",
    style,
}: HeaderIconButtonProps) {
    const colors = useThemeColors()
    const isLockedRef = useRef(false)

    const handlePress = useCallback(() => {
        if (disabled || isLockedRef.current) return

        isLockedRef.current = true
        onPress()

        setTimeout(() => {
            isLockedRef.current = false
        }, PRESS_COOLDOWN_MS)
    }, [disabled, onPress])

    return (
        <Pressable
            onPress={handlePress}
            disabled={disabled}
            hitSlop={6}
            style={({ pressed }) => [
                styles.button,
                variant === "onDark"
                    ? pressed
                        ? styles.buttonPressedOnDark
                        : undefined
                    : pressed
                      ? [
                            styles.buttonPressed,
                            { backgroundColor: colors.pressed },
                        ]
                      : undefined,
                disabled && styles.buttonDisabled,
                style,
            ]}
            accessibilityRole="button"
            accessibilityLabel={accessibilityLabel}
        >
            {children}
        </Pressable>
    )
}

export const HEADER_ICON_SIZE = 24
export const HEADER_ICON_SIZE_LARGE = 26
export const HEADER_ICON_BUTTON_SIZE = ICON_BUTTON_SIZE

const styles = StyleSheet.create({
    button: {
        height: ICON_BUTTON_SIZE,
        width: ICON_BUTTON_SIZE,
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 9999,
    },
    buttonPressed: {
        shadowColor: "#000000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.18,
        shadowRadius: 4,
        elevation: 4,
        transform: [{ scale: 0.94 }],
    },
    buttonPressedOnDark: {
        backgroundColor: "rgba(255, 255, 255, 0.16)",
        shadowColor: "#000000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.35,
        shadowRadius: 4,
        elevation: 4,
        transform: [{ scale: 0.94 }],
    },
    buttonDisabled: {
        opacity: 0.4,
    },
})

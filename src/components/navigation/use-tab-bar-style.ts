import { useMemo } from "react"
import { useSafeAreaInsets } from "react-native-safe-area-context"

import { useThemeColors } from "@/hooks/use-theme-colors"

const TAB_BAR_BASE_HEIGHT = 60
const TAB_BAR_PADDING_TOP = 8
const TAB_BAR_PADDING_BOTTOM = 8

export function useTabBarStyle() {
    const insets = useSafeAreaInsets()
    const colors = useThemeColors()

    return useMemo(
        () => ({
            backgroundColor: colors.card,
            borderTopColor: colors.border,
            height: TAB_BAR_BASE_HEIGHT + insets.bottom,
            paddingTop: TAB_BAR_PADDING_TOP,
            paddingBottom: TAB_BAR_PADDING_BOTTOM + insets.bottom,
        }),
        [
            colors.card,
            colors.border,
            insets.bottom,
        ]
    )
}

export function useTabBarColors() {
    const colors = useThemeColors()

    return useMemo(
        () => ({
            tabBarActiveTintColor: colors.tabActive,
            tabBarInactiveTintColor: colors.tabInactive,
        }),
        [colors.tabActive, colors.tabInactive]
    )
}

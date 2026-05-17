import { useMemo } from "react"
import { useSafeAreaInsets } from "react-native-safe-area-context"

const TAB_BAR_BASE_HEIGHT = 60
const TAB_BAR_PADDING_TOP = 8
const TAB_BAR_PADDING_BOTTOM = 8

export function useTabBarStyle() {
    const insets = useSafeAreaInsets()

    return useMemo(
        () => ({
            backgroundColor: "#ffffff",
            borderTopColor: "#ebebeb",
            height: TAB_BAR_BASE_HEIGHT + insets.bottom,
            paddingTop: TAB_BAR_PADDING_TOP,
            paddingBottom: TAB_BAR_PADDING_BOTTOM + insets.bottom,
        }),
        [insets.bottom]
    )
}

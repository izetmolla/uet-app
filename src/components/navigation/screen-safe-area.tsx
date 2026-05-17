import type { ReactNode } from "react"
import { StyleSheet } from "react-native"
import {
    SafeAreaView,
    type Edge,
} from "react-native-safe-area-context"

import { useThemeColors } from "@/hooks/use-theme-colors"

const styles = StyleSheet.create({
    flex: { flex: 1 },
})

type ScreenSafeAreaProps = {
    children: ReactNode
    edges?: Edge[]
}

/** Top and horizontal safe area for full screens (status bar, notches). */
export function ScreenSafeArea({
    children,
    edges = ["top", "left", "right"],
}: ScreenSafeAreaProps) {
    const colors = useThemeColors()

    return (
        <SafeAreaView
            style={[styles.flex, { backgroundColor: colors.card }]}
            edges={edges}
        >
            {children}
        </SafeAreaView>
    )
}

/** Bottom safe area for scrollable content above tab bars / home indicator. */
export function ScreenContentSafeArea({ children }: { children: ReactNode }) {
    return (
        <SafeAreaView style={styles.flex} edges={["bottom"]}>
            {children}
        </SafeAreaView>
    )
}

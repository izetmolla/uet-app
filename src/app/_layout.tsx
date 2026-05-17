import { Stack } from "expo-router"
import { View } from "react-native"
import { GestureHandlerRootView } from "react-native-gesture-handler"

import "@/global.css"
import "@/lib/network/interceptors"
import { ColorModeProvider } from "@/contexts/color-mode"
import useAuthorizationStore from "@/store/authorization"

export default function RootLayout() {
    const hydrated = useAuthorizationStore((s) => s.hydrated)

    if (!hydrated) {
        return <View style={{ flex: 1 }} />
    }

    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <ColorModeProvider>
                <Stack screenOptions={{ headerShown: false }} />
            </ColorModeProvider>
        </GestureHandlerRootView>
    )
}

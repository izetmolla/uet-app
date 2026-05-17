import { Stack } from "expo-router"
import * as SplashScreen from "expo-splash-screen"
import { GestureHandlerRootView } from "react-native-gesture-handler"
import { SafeAreaProvider } from "react-native-safe-area-context"

import "@/global.css"
import "@/lib/network/interceptors"
import { SplashScreenController } from "@/components/splash-screen-controller"
import { ColorModeProvider } from "@/contexts/color-mode"

SplashScreen.setOptions({
    duration: 400,
    fade: true,
})

export default function RootLayout() {
    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <SafeAreaProvider>
                <ColorModeProvider>
                    <SplashScreenController />
                    <Stack screenOptions={{ headerShown: false }} />
                </ColorModeProvider>
            </SafeAreaProvider>
        </GestureHandlerRootView>
    )
}

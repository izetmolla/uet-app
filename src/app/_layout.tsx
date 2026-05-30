import { Stack } from "expo-router"
import * as SplashScreen from "expo-splash-screen"
import { GestureHandlerRootView } from "react-native-gesture-handler"
import { SafeAreaProvider } from "react-native-safe-area-context"

import Providers from "@/components/providers"
import { ShareMenuListener } from "@/components/share-menu/share-menu-listener"
import { SplashScreenController } from "@/components/splash-screen-controller"
import { ColorModeProvider } from "@/contexts/color-mode"
import "@/global.css"
import "@/lib/network/interceptors"

SplashScreen.setOptions({
    duration: 400,
    fade: true,
})

export default function RootLayout() {
    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <SafeAreaProvider>
                <ColorModeProvider>
                    <Providers>
                        <SplashScreenController />
                        <ShareMenuListener />
                        <Stack screenOptions={{ headerShown: false }} />
                    </Providers>
                </ColorModeProvider>
            </SafeAreaProvider>
        </GestureHandlerRootView>
    )
}

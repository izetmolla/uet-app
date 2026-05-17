import * as SplashScreen from "expo-splash-screen"
import { useEffect } from "react"

import { useColorMode } from "@/contexts/color-mode"
import useAuthorizationStore from "@/store/authorization"

/**
 * Hides the native splash once persisted auth and theme preferences are loaded.
 */
export function SplashScreenController() {
    const authHydrated = useAuthorizationStore((s) => s.hydrated)
    const { hydrated: themeHydrated } = useColorMode()

    useEffect(() => {
        if (!authHydrated || !themeHydrated) {
            return
        }

        void SplashScreen.hideAsync()
    }, [authHydrated, themeHydrated])

    return null
}

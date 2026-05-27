import { useFocusEffect } from "@react-navigation/native"
import * as ScreenOrientation from "expo-screen-orientation"
import { useCallback } from "react"
import { Platform } from "react-native"

async function lockPortraitUp() {
    if (Platform.OS === "ios") {
        await ScreenOrientation.lockPlatformAsync({
            screenOrientationArrayIOS: [
                ScreenOrientation.Orientation.PORTRAIT_UP,
            ],
        })
        return
    }

    await ScreenOrientation.lockAsync(
        ScreenOrientation.OrientationLock.PORTRAIT_UP
    )
}

/** Locks the screen to portrait upright while focused; restores on blur. */
export function useLockPortraitOrientation() {
    useFocusEffect(
        useCallback(() => {
            let cancelled = false

            const applyLock = async () => {
                try {
                    await lockPortraitUp()
                } catch (error) {
                    if (!cancelled) {
                        console.warn("Failed to lock screen orientation:", error)
                    }
                }
            }

            void applyLock()

            return () => {
                cancelled = true
                void ScreenOrientation.unlockAsync().catch(() => {})
            }
        }, [])
    )
}

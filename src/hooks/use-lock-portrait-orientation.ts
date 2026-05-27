import { useFocusEffect } from "@react-navigation/native"
import * as ScreenOrientation from "expo-screen-orientation"
import { useCallback } from "react"

/** Locks the screen to portrait while focused; restores on blur. */
export function useLockPortraitOrientation() {
    useFocusEffect(
        useCallback(() => {
            const lock = async () => {
                try {
                    await ScreenOrientation.lockAsync(
                        ScreenOrientation.OrientationLock.PORTRAIT_UP
                    )
                } catch (error) {
                    console.warn("Failed to lock screen orientation:", error)
                }
            }

            void lock()

            return () => {
                void ScreenOrientation.unlockAsync().catch(() => {})
            }
        }, [])
    )
}

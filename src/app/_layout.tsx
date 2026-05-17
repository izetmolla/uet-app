import { Stack, useRouter, useSegments } from "expo-router"
import { useEffect } from "react"

import "@/global.css"
import "@/lib/network/interceptors"
import { ColorModeProvider } from "@/contexts/color-mode"
import useAuthorizationStore from "@/store/authorization"

export default function RootLayout() {
    const router = useRouter()
    const segments = useSegments()

    const user = useAuthorizationStore((s) => s.user)
    const hydrated = useAuthorizationStore((s) => s.hydrated)

    useEffect(() => {
        if (!hydrated) return

        const inAuthGroup = segments[0] === "(auth)"

        if (!user && !inAuthGroup) {
            router.replace("/login")
        }

        if (user && inAuthGroup) {
            router.replace("/")
        }
    }, [user, hydrated, segments, router])

    if (!hydrated) {
        return null
    }

    return (
        <ColorModeProvider>
            <Stack screenOptions={{ headerShown: false }} />
        </ColorModeProvider>
    )
}

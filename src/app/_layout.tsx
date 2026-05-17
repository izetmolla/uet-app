// import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
// import React from 'react';
// import { useColorScheme } from 'react-native';

// import { AnimatedSplashOverlay } from '@/components/animated-icon';
// import AppTabs from '@/components/app-tabs';

// export default function TabLayout() {
//   const colorScheme = useColorScheme();
//   return (
//     <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
//       <AnimatedSplashOverlay />
//       <AppTabs />
//     </ThemeProvider>
//   );
// }



import { Stack, useRouter, useSegments } from "expo-router"
import { useEffect } from "react"

import "@/lib/network/interceptors"
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
    }, [user, hydrated, segments])

    if (!hydrated) {
        return null
    }

    return <Stack screenOptions={{ headerShown: false }} />
}
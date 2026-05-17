import { Redirect, Stack } from "expo-router"
import { View } from "react-native"

import useAuthorizationStore from "@/store/authorization"

export default function AuthLayout() {
    const user = useAuthorizationStore((s) => s.user)
    const hydrated = useAuthorizationStore((s) => s.hydrated)

    if (!hydrated) {
        return <View style={{ flex: 1 }} />
    }

    if (user) {
        return <Redirect href="/" />
    }

    return <Stack screenOptions={{ headerShown: false }} />
}

import { Stack } from "expo-router"

export default function ScanDocumentsLayout() {
    return (
        <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="(tabs)" />
            <Stack.Screen name="[id]" />
        </Stack>
    )
}

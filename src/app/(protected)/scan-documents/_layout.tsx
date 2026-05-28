import { Stack } from "expo-router"

export default function ScanDocumentsLayout() {
    return (
        <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="index" />
            <Stack.Screen
                name="students/camera/index"
                options={{ orientation: "portrait_up" }}
            />
            <Stack.Screen name="students/[folder_id]" />
        </Stack>
    )
}

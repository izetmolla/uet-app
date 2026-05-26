import { Stack } from "expo-router"

export default function FolderStudentsLayout() {
    return (
        <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="index" />
            <Stack.Screen name="[student_id]" />
        </Stack>
    )
}

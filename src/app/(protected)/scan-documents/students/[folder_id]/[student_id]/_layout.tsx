import { Stack } from "expo-router"

export default function StudentLayout() {
    return (
        <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="(tabs)" />
            <Stack.Screen
                name="document-check"
                options={{
                    presentation: "formSheet",
                    sheetAllowedDetents: [0.7],
                    sheetInitialDetentIndex: 0,
                    sheetGrabberVisible: true,
                    headerShown: false,
                }}
            />
            <Stack.Screen
                name="publish-options"
                options={{
                    presentation: "formSheet",
                    sheetAllowedDetents: [0.7],
                    sheetInitialDetentIndex: 0,
                    sheetGrabberVisible: true,
                    headerShown: false,
                }}
            />
            <Stack.Screen
                name="pdf-preview"
                options={{
                    presentation: "fullScreenModal",
                    headerShown: false,
                }}
            />
        </Stack>
    )
}

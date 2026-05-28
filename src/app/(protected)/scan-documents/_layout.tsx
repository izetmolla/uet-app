import { Stack } from "expo-router"
import { StyleSheet, View } from "react-native"

import { PhotoUploadProgressOverlay } from "@/components/scan-documents/photo-upload-progress-overlay"

export default function ScanDocumentsLayout() {
    return (
        <View style={styles.root} pointerEvents="box-none">
            <View style={styles.stackHost} pointerEvents="box-none">
                <Stack screenOptions={{ headerShown: false }}>
                    <Stack.Screen name="index" />
                    <Stack.Screen
                        name="students/camera/index"
                        options={{ orientation: "portrait_up" }}
                    />
                    <Stack.Screen name="students/[folder_id]" />
                </Stack>
            </View>
            <PhotoUploadProgressOverlay />
        </View>
    )
}

const styles = StyleSheet.create({
    root: {
        flex: 1,
    },
    stackHost: {
        flex: 1,
    },
})

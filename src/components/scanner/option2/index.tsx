import { CameraView, useCameraPermissions } from "expo-camera"
import { useCallback, useRef, useState } from "react"
import { ActivityIndicator, Pressable, StyleSheet, View } from "react-native"
import { Camera } from "lucide-react-native"

import { Box } from "@/components/ui/box"
import { Button, ButtonText } from "@/components/ui/button"
import { Text } from "@/components/ui/text"

type Option2CameraProps = {
    onCapture: (uri: string) => void | Promise<void>
    isSaving?: boolean
}

export function Option2Camera({ onCapture, isSaving = false }: Option2CameraProps) {
    const cameraRef = useRef<CameraView>(null)
    const [permission, requestPermission] = useCameraPermissions()
    const [capturing, setCapturing] = useState(false)

    const handleCapture = useCallback(async () => {
        if (!cameraRef.current || capturing || isSaving) return

        setCapturing(true)
        try {
            const photo = await cameraRef.current.takePictureAsync({
                quality: 0.9,
                skipProcessing: false,
            })

            if (photo?.uri) {
                await onCapture(photo.uri)
            }
        } finally {
            setCapturing(false)
        }
    }, [capturing, isSaving, onCapture])

    if (!permission) {
        return (
            <Box className="flex-1 items-center justify-center bg-background-900">
                <ActivityIndicator color="#ffffff" />
            </Box>
        )
    }

    if (!permission.granted) {
        return (
            <Box className="flex-1 items-center justify-center gap-4 bg-background-50 px-6">
                <Camera size={40} color="#8c8f98" />
                <Text className="text-center text-typography-600">
                    Camera access is required to scan photos for this student.
                </Text>
                <Button
                    size="md"
                    action="primary"
                    className="bg-primary-500"
                    onPress={requestPermission}
                >
                    <ButtonText>Allow camera</ButtonText>
                </Button>
            </Box>
        )
    }

    const busy = capturing || isSaving

    return (
        <View style={styles.container}>
            <CameraView ref={cameraRef} style={styles.camera} facing="back" />
            <View style={styles.controls}>
                <Pressable
                    onPress={handleCapture}
                    disabled={busy}
                    style={({ pressed }) => [
                        styles.shutter,
                        pressed && styles.shutterPressed,
                        busy && styles.shutterDisabled,
                    ]}
                    accessibilityRole="button"
                    accessibilityLabel="Take photo"
                >
                    {busy ? (
                        <ActivityIndicator color="#2e4d88" />
                    ) : (
                        <View style={styles.shutterInner} />
                    )}
                </Pressable>
                <Text size="sm" className="mt-3 text-center text-white">
                    Tap to capture a page
                </Text>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#000",
    },
    camera: {
        flex: 1,
    },
    controls: {
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        alignItems: "center",
        paddingBottom: 28,
        paddingTop: 16,
        backgroundColor: "rgba(0,0,0,0.35)",
    },
    shutter: {
        height: 72,
        width: 72,
        borderRadius: 36,
        borderWidth: 4,
        borderColor: "#ffffff",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "rgba(255,255,255,0.2)",
    },
    shutterPressed: {
        opacity: 0.85,
    },
    shutterDisabled: {
        opacity: 0.5,
    },
    shutterInner: {
        height: 56,
        width: 56,
        borderRadius: 28,
        backgroundColor: "#ffffff",
    },
})
